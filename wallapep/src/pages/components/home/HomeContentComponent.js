import { useState, useEffect } from "react";
import HeroSection from './HeroSection';
import CategoriesSection from './CategoriesSection';
import ProductsGrid from './ProductsGrid';

let HomeContentComponent = () => {
  let [selectedCategory, setSelectedCategory] = useState('todos');
  let [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  let [products, setProducts] = useState([]);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  useEffect(() => {
    if (isUserLoggedIn) {
      loadProducts();
    }
  }, [isUserLoggedIn]);

  let checkUserLoggedIn = () => {
    let apiKey = localStorage.getItem("apiKey");
    let loggedIn = apiKey !== null && apiKey !== "" && apiKey !== "null";
    setIsUserLoggedIn(loggedIn);
  };

  let checkURL = async (url) => {
    try {
      let response = await fetch(url);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  let loadProducts = async () => {
    if (!isUserLoggedIn) {
      return;
    }

    try {
      let response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/products",
        {
          method: "GET",
          headers: {
            apikey: localStorage.getItem("apiKey") || "",
          },
        }
      );

      if (response.ok) {
        let jsonData = await response.json();

        let promisesForImages = jsonData.map(async (p) => {
          let urlImage = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/images/" + p.id + ".png";
          let existsImage = await checkURL(urlImage);
          if (existsImage) {
            p.image = urlImage;
          } else {
            p.image = "/imageMockup.png";
          }
          return p;
        });

        let productsWithImage = await Promise.all(promisesForImages);
        setProducts(productsWithImage);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <HeroSection />
      <CategoriesSection
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        isUserLoggedIn={isUserLoggedIn}
        products={products}
      />
      <ProductsGrid
        selectedCategory={selectedCategory}
        isUserLoggedIn={isUserLoggedIn}
        products={products}
      />
    </div>
  );
};

export default HomeContentComponent;
