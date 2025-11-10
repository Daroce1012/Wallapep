import { useMemo } from 'react';
import { Row, Col, Typography, Empty } from 'antd';
import { categoryLabels } from '../../../utils/UtilsCategories';
import styles from '../../../styles/Home.module.css';
import ProductCard from '../common/ProductCard'; // Importar el nuevo componente
import EmptyState from '../common/EmptyState';

const { Title, Text } = Typography;

const ProductsGrid = ({ selectedCategory, isUserLoggedIn, products }) => {
  // Productos filtrados con useMemo
  const filteredProducts = useMemo(() => {
    if (!isUserLoggedIn) return [];
    if (selectedCategory === 'todos') return products;
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory, isUserLoggedIn]);

  // Título de la categoría
  const categoryTitle = selectedCategory === 'todos' 
    ? 'All Products' 
    : categoryLabels[selectedCategory]?.label || 'Products';

  // Si no está logueado
  if (!isUserLoggedIn) {
    return (
      <div className={styles.productsContainer}>
        <EmptyState
          description="Please log in to view products"
        />
      </div>
    );
  }

  return (
    <div className={styles.productsContainer}>
      <div className={styles.mainContentWrapper}>
        <div className={styles.productsHeader}>
          <div>
            <Title level={2} className={styles.productsTitle}>
              {categoryTitle}
            </Title>
            <Text className={styles.productsSubtitle}>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
            </Text>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ height: 120 }}
            description="No products available in this category"
            className={styles.emptyStateWithBorder}
          />
        ) : (
          <Row gutter={[24, 24]}>
            {filteredProducts.map((product) => (
              <Col xs={24} sm={12} lg={8} xl={3} key={product.id}>
                <ProductCard
                  product={product}
                  variant="detailed"
                  showBuyButton={false}
                  showDescription={true}
                  showStarBadge={true}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default ProductsGrid;
