import { useState, useEffect } from 'react';
import { Card, Col, Row, Typography, Tag } from 'antd';
import { categoryLabels } from '../../../utils/UtilsCategories';

const { Title, Text } = Typography;

let CategoriesSection = ({ selectedCategory, setSelectedCategory, isUserLoggedIn, products }) => {
  let [categoriesCount, setCategoriesCount] = useState([]);

  useEffect(() => {
    loadCategoriesCount();
  }, []);

  let loadCategoriesCount = async () => {
    try {
      let response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/products/categories/count",
        {
          method: "GET",
          headers: {
            apikey: localStorage.getItem("apiKey") || "",
          },
        }
      );

      if (response.ok) {
        let jsonData = await response.json();
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
    <div style={{ marginBottom: '32px' }}>
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
                style={{
                  textAlign: 'center',
                  border: isSelected ? '2px solid #1890ff' : undefined,
                }}
              >
                <div style={{ fontSize: '2em', marginBottom: '12px' }}>
                  {categoryInfo.emoji}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <Text strong style={{ display: 'block' }}>
                    {categoryInfo.label}
                  </Text>
                </div>
                <Tag color="blue" style={{ marginTop: '4px' }}>
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
