import { useState, useEffect } from "react";
import HeroSection from './HeroSection';
import CategoriesSection from './CategoriesSection';
import ProductsGrid from './ProductsGrid';
import { apiGet } from '../../../utils/UtilsApi';
import { processProductsImages } from '../../../utils/UtilsProducts';
import styles from '../../../styles/HomeContent.module.css';

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

  let loadProducts = async () => {
    if (!isUserLoggedIn) {
      return;
    }

    let jsonData = await apiGet("/products");
    if (jsonData) {
      let productsWithImage = await processProductsImages(jsonData);
      setProducts(productsWithImage);
    }
  };

  return (
    <div className={styles.container}>
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
