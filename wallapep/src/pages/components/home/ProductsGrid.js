import React from 'react';
import Link from 'next/link';
import { Card, Col, Row, Typography, Tag, Button, Space, Flex } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import { categoryLabels } from '../../../utils/UtilsCategories';

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
      <Flex justify="space-between" align="center" style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>
          {selectedCategory === 'todos'? 'All Products': categoryLabels[selectedCategory]?.label}
        </Title>
        <Tag color="blue">
          {filteredProducts.length} products
        </Tag>
      </Flex>

      {filteredProducts.length === 0 
        ? (<Flex justify="center" align="middle" style={{ padding: '60px 0' }}>
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
                    <Flex justify="center" align="middle" style={{ height: '200px', background: '#f0f2f5' }}>
                      <img
                        src={product.image}
                        alt={product.title}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
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
                          <StarOutlined style={{ color: '#faad14' }} />
                          <Text type="secondary">
                            {product.description ? product.description.substring(0, 40) + '...' : ''}
                          </Text>
                        </Space>
                        <Flex justify="space-between" align="center" style={{ marginTop: '12px' }}>
                          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
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
