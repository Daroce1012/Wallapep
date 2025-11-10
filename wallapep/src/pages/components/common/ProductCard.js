import React from 'react';
import Link from 'next/link';
import { Typography, Button, Space } from 'antd';
import { ShoppingOutlined, StarFilled, PictureOutlined } from '@ant-design/icons';
import styles from '../../../styles/ProductCard.module.css';

const { Title, Text } = Typography;

const ProductCard = ({
  product,
  variant = 'compact', // 'compact' o 'detailed'
  onBuy,
  showBuyButton = false,
  showDescription = false,
  showStarBadge = false,
}) => {
  const isCompact = variant === 'compact';

  return (
    <Link href={`/detailProduct/${product.id}`} className={styles.productLink}>
      <div className={styles.productCard}>
        <div className={styles.productImageContainer}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className={styles.productImage}
            />
          ) : (
            <div className={styles.noImagePlaceholder}>
              <PictureOutlined className={styles.noImageIcon} />
            </div>
          )}
        </div>
        
        <div className={styles.productContent}>
          <div>
            <p className={isCompact ? styles.productTitleCompact : styles.productTitleDetailed}>
              {product.title}
            </p>
          </div>

          {showDescription && (
            <p className={styles.productDescription}>
              {product.description || 'No description available'}
            </p>
          )}
          
          <p className={styles.productPrice}>
            €{product.price.toFixed(2)}
          </p>

          {showBuyButton && (
            <Button 
            type="primary"
            icon={<ShoppingOutlined />}
            className={styles.productBuyButton}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onBuy) onBuy(product, e);
            }}
          >
            Buy
          </Button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
