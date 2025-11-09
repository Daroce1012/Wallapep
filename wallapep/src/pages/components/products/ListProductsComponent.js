import { useState, useEffect } from "react";
import Link from 'next/link';
import { Typography, Row, Col, Card, Tag, Space, Button, Modal, message } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import ProductFiltersComponent from './ProductFiltersComponent';
import { getUserInfoFromApiKey } from '../../../utils/UtilsUser';
import { apiGet, apiPost } from '../../../utils/UtilsApi';
import { processProductsImages } from '../../../utils/UtilsProducts';
import styles from '../../../styles/ListProducts.module.css';

const { Title, Paragraph } = Typography;

let ListProductsComponent = () => {
  let [products, setProducts] = useState([]);
  let [filteredProducts, setFilteredProducts] = useState([]);
  let [filters, setFilters] = useState({
    category: 'todos',
    title: '',
    minPrice: null,
    maxPrice: null
  });
  let [userProductIds, setUserProductIds] = useState([]);

  useEffect(() => {
    loadProducts();
    loadUserProducts();
  }, []);

  let loadUserProducts = async () => {
    let userInfo = getUserInfoFromApiKey();
    if (!userInfo?.id) return;
    
    let userProducts = await apiGet("/products", {
      params: { sellerId: userInfo.id }
    });
    
    if (userProducts) {
      setUserProductIds(userProducts.map(p => p.id));
    }
  };

  let handleBuy = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    let userInfo = getUserInfoFromApiKey();
    if (!userInfo?.id) {
      message.warning("You must be logged in to buy");
      return;
    }

    // No need to check if sold or if user's own product - ProductFiltersComponent already filters these
    // If product is in filteredProducts, it's available and not user's own

    Modal.confirm({
      title: 'Confirm Purchase',
      content: `Are you sure you want to buy "${product.title}" for € ${product.price}?`,
      onOk: async () => {
        let result = await apiPost("/transactions", {
          productId: product.id,
          buyerPaymentId: null
        }, {
          onError: (serverErrors) => {
            let errorMsg = serverErrors.map(e => e.msg).join(', ');
            message.error(errorMsg || "Failed to register transaction");
          }
        });

        if (result) {
          message.success("Transaction registered successfully");
          // Update product in list with buyerEmail - ProductFiltersComponent will filter it
          let updatedProducts = products.map(p =>
            p.id === product.id ? { ...p, buyerEmail: userInfo.email } : p
          );
          setProducts(updatedProducts);
        }
      }
    });
  };

  let loadProducts = async () => {
    let jsonData = await apiGet("/products", {
      onError: (serverErrors) => {
        // Error ya se maneja en handleApiError
      }
    });

    if (jsonData) {
      let productsWithImage = await processProductsImages(jsonData);
      setProducts(productsWithImage);
    }
  };

  return (
    <div>
      <Space align="center" className={styles.header}>
        <ShoppingOutlined className={styles.headerIcon} />
        <Title level={2} className={styles.headerTitle}>Products</Title>
      </Space>
      
      <ProductFiltersComponent 
        products={products}
        filters={filters} 
        setFilters={setFilters}
        setFilteredProducts={setFilteredProducts}
        userProductIds={userProductIds}
      />

      <div className={styles.resultsTag}>
        <Tag color="blue" className={styles.resultsTagContent}>
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
        </Tag>
      </div>

      {filteredProducts.length === 0 ? (
        <div className={styles.emptyState}>
          <Paragraph>No products found with the selected filters.</Paragraph>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredProducts.map((p) => (
            <Col xs={24} sm={12} md={8} lg={8} xl={6} key={p.id}>
              <Card 
                title={p.title} 
                cover={<img src={p.image} alt={p.title} className={styles.productImage} />}
                hoverable
                actions={[
                  <Button 
                    type="primary" 
                    icon={<ShoppingOutlined />}
                    onClick={(e) => handleBuy(p, e)}
                    block
                  >
                    Buy
                  </Button>
                ]}
              >
                <Link href={`detailProduct/${p.id}`} className={styles.productLink}>
                  <Title level={4} className={styles.productPrice}>
                    € {p.price}
                  </Title>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ListProductsComponent;