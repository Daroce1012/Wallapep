import { useState, useEffect, useMemo } from "react";
import { Typography, Row, Col, Tag, Space, Modal, message, Spin, Button } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import ProductFiltersComponent from './ProductFiltersComponent';
import { getUserInfoFromApiKey } from '../../../utils/UtilsUser';
import { apiGet, apiPost } from '../../../utils/UtilsApi';
import { processProductsImages } from '../../../utils/UtilsProducts';
import styles from '../../../styles/ListProducts.module.css';
import ProductCard from '../common/ProductCard';
import CardHeader from '../common/CardHeader';
import EmptyState from '../common/EmptyState';
import LoadingSpinner from '../common/LoadingSpinner';

const { Title, Paragraph } = Typography;

const ListProductsComponent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productLoadError, setProductLoadError] = useState(null); // Nuevo estado de error
  const [userInfo, setUserInfo] = useState(null);
  const [filters, setFilters] = useState({
    category: 'todos',
    title: '',
    minPrice: null,
    maxPrice: null
  });
  const [modal, contextHolderModal] = Modal.useModal();

  useEffect(() => {
    const user = getUserInfoFromApiKey();
    setUserInfo(user);
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Excluir productos ya vendidos (que tienen buyerEmail)
      if (product.buyerEmail) {
        return false;
      }

      if (userInfo?.id && product.sellerId === userInfo.id) {
        return false;
      }

      if (filters.category !== 'todos' && product.category !== filters.category) {
        return false;
      }

      if (filters.title && !product.title.toLowerCase().includes(filters.title.toLowerCase())) {
        return false;
      }

      if (filters.minPrice !== null && product.price < filters.minPrice) {
        return false;
      }

      if (filters.maxPrice !== null && product.price > filters.maxPrice) {
        return false;
      }

      return true;
    });
  }, [products, filters, userInfo?.id]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setProductLoadError(null); // Resetear error al cargar
      const jsonData = await apiGet("/products");
      if (jsonData) {
        const productsWithImage = await processProductsImages(jsonData);
        setProducts(productsWithImage);
      } else {
        // Si jsonData es null, significa que hubo un error en la API o no se devolvieron datos
        setProductLoadError("Failed to retrieve products.");
      }
    } catch (err) {
      console.error("Error loading products:", err);
      setProductLoadError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userInfo?.id) {
      message.warning("You must be logged in to buy");
      return;
    }

    modal.confirm({
      title: 'Confirm Purchase',
      content: `Are you sure you want to buy "${product.title}" for €${product.price}?`,
      onOk: async () => {
        try {
          const result = await apiPost("/transactions", {
            productId: product.id,
            buyerPaymentId: null,
            startDate: Date.now()
          }, {
            onError: (serverErrors) => {
              const errorMsg = serverErrors.map(e => e.msg).join(', ');
              message.error(errorMsg || "Failed to register transaction");
            }
          });

          if (result) {
            message.success("Transaction registered successfully");
            await loadProducts();
          }
        } catch (error) {
          console.error('Error in transaction:', error);
        }
      }
    });
  };

  if (loading) {
    return (
      <LoadingSpinner tip="Loading products..." />
    );
  }

  // Mostrar estado de error si no hay productos y hay un error de carga
  if (productLoadError) {
    return (
      <EmptyState
        description={productLoadError}
        title="Error loading products"
        action={(
          <Button 
            size="small" 
            danger 
            onClick={loadProducts}
          >
            Retry
          </Button>
        )}
      />
    );
  }

  return (
    <div>
      <CardHeader 
        icon={<ShoppingOutlined className={styles.headerIcon} />} 
        title="Products" 
        level={2}
        className={styles.header}
      />
      
      <ProductFiltersComponent 
        filters={filters} 
        setFilters={setFilters}
      />

      <div className={styles.resultsTag}>
        <Tag color="blue" className={styles.resultsTagContent}>
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
        </Tag>
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState 
          description="No products found with the selected filters." 
          className={styles.emptyState}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredProducts.map((product) => (
            <Col xs={24} sm={12} md={8} lg={8} xl={3} key={product.id}>
              <ProductCard
                product={product}
                variant="compact"
                showBuyButton={true}
                showDescription={false}
                showStarBadge={false}
                onBuy={handleBuy}
              />
            </Col>
          ))}
        </Row>
      )}

      {contextHolderModal}
    </div>
  );
};

export default ListProductsComponent;
