import { useState, useEffect } from 'react';
import { Card, Col, Row, Typography, Tag } from 'antd';
import { categoryLabels } from '../../../utils/UtilsCategories';
import { apiGet } from '../../../utils/UtilsApi';
import styles from '../../../styles/CategoriesSection.module.css';

const { Title, Text } = Typography;

let CategoriesSection = ({ selectedCategory, setSelectedCategory, isUserLoggedIn, products }) => {
  let [categoriesCount, setCategoriesCount] = useState([]);

  useEffect(() => {
    loadCategoriesCount();
  }, []);

  let loadCategoriesCount = async () => {
    try {
      let jsonData = await apiGet("/products/categories/count");
      if (jsonData) {
        setCategoriesCount(jsonData);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  let getCategoryCount = (category) => {
    if (!isUserLoggedIn) {
      return 0;
    }
    
    if (category === 'todos') {
      return products.length;
    }
    
    let categoryData = categoriesCount.find((c) => c.category === category);
    return categoryData ? categoryData.num_products : 0;
  };

  return (
    <div className={styles.container}>
      <Title level={2}>Categories</Title>
      <Row gutter={[16, 16]}>
        {Object.keys(categoryLabels).map((categoryKey) => {
          let categoryInfo = categoryLabels[categoryKey];
          let count = getCategoryCount(categoryKey);
          let isSelected = selectedCategory === categoryKey;

          return (
            <Col xs={12} sm={8} md={6} lg={4} xl={3} key={categoryKey}>
              <Card
                hoverable
                onClick={() => setSelectedCategory(categoryKey)}
                className={isSelected ? styles.categoryCardSelected : styles.categoryCard}
              >
                <div className={styles.emoji}>
                  {categoryInfo.emoji}
                </div>
                <div className={styles.label}>
                  <Text strong className={styles.labelText}>
                    {categoryInfo.label}
                  </Text>
                </div>
                <Tag color="blue" className={styles.tag}>
                  {count} products
                </Tag>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default CategoriesSection;
