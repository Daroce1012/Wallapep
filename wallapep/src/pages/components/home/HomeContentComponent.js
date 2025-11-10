import { useState, useEffect, useMemo } from "react";
import { Spin } from 'antd';
import HeroSection from './HeroSection';
import CategoriesSection from './CategoriesSection';
import ProductsGrid from './ProductsGrid';
import { apiGet, getApiKey } from '../../../utils/UtilsApi';
import { processProductsImages } from '../../../utils/UtilsProducts';
import styles from '../../../styles/Home.module.css';

const HomeContentComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calcular si está logueado (no necesita estado)
  const isUserLoggedIn = useMemo(() => {
    const apiKey = getApiKey();
    return apiKey && apiKey !== "null";
  }, []);

  // Calcular conteos por categoría desde los productos que ya tenemos
  const categoriesCount = useMemo(() => {
    const counts = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  useEffect(() => {
    if (isUserLoggedIn) {
      loadProducts();
    } else {
      setLoading(false);
    }
  }, [isUserLoggedIn]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/products");
      if (data) {
        const productsWithImage = await processProductsImages(data);
        setProducts(productsWithImage);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.homeContentContainer}>
        <HeroSection />
        <div className={styles.homeLoadingContainer}>
          <Spin size="large" tip="Loading products..." />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.homeContentContainer}>
      <HeroSection />
      
      <CategoriesSection
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categoriesCount={categoriesCount}
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
