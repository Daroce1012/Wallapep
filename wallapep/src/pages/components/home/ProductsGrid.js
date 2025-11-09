import React from 'react';
import Link from 'next/link';
import { Card, Col, Row, Typography, Tag, Button, Space, Flex } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import { categoryLabels } from '../../../utils/UtilsCategories';
import styles from '../../../styles/ProductsGrid.module.css';

const { Title, Paragraph, Text } = Typography;

let ProductsGrid = ({ selectedCategory, isUserLoggedIn, products }) => {
  
  let getFilteredProducts = () => {
    if (!isUserLoggedIn) {
      return [];
    }
    
    if (selectedCategory === 'todos') {
      return products;
    }
    
    let filtered = products.filter((p) => p.category === selectedCategory);
    return filtered.slice(0, 4);
  };

  let filteredProducts = getFilteredProducts();

  return (
    <div>
      <Flex justify="space-between" align="center" className={styles.header}>
        <Title level={2} className={styles.title}>
          {selectedCategory === 'todos'? 'All Products': categoryLabels[selectedCategory]?.label}
        </Title>
        <Tag color="blue">
          {filteredProducts.length} products
        </Tag>
      </Flex>

      {filteredProducts.length === 0 
        ? (<Flex justify="center" align="middle" className={styles.emptyState}>
            <Paragraph type="secondary">  No products available in this category.</Paragraph>
          </Flex>) 
        : (
        <Row gutter={[16, 16]}>
          {filteredProducts.map((product) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={product.id}>
              <Link href={`detailProduct/${product.id}`}>
                <Card
                  hoverable
                  cover={
                    <Flex justify="center" align="middle" className={styles.imageContainer}>
                      <img
                        src={product.image}
                        alt={product.title}
                        className={styles.productImage}
                      />
                    </Flex>
                  }
                >
                  <Card.Meta
                    title={
                      <Text strong ellipsis={{ tooltip: product.title }}>
                        {product.title}
                      </Text>
                    }
                    description={
                      <div>
                        <Space>
                          <StarOutlined className={styles.starIcon} />
                          <Text type="secondary">
                            {product.description ? product.description.substring(0, 40) + '...' : ''}
                          </Text>
                        </Space>
                        <Flex justify="space-between" align="center" className={styles.priceRow}>
                          <Title level={4} className={styles.productPrice}>
                            €{product.price}
                          </Title>
                          <Button type="primary" size="small">View Details</Button>
                        </Flex>
                      </div>
                    }
                  />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ProductsGrid;
