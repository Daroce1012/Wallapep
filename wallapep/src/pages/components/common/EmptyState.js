import React from 'react';
import { Empty, Typography } from 'antd';
import styles from '../../../styles/Home.module.css'; // Usar Home.module.css por ahora para los estilos de emptyState

const { Text } = Typography;

const EmptyState = ({ description, image = Empty.PRESENTED_IMAGE_SIMPLE, imageStyle = {}, className = "" }) => {
  return (
    <Empty
      image={image}
      imageStyle={imageStyle}
      description={
        <Text type="secondary" className={styles.emptyStateText}>
          {description}
        </Text>
      }
      className={`${styles.emptyState} ${className}`}
    />
  );
};

export default EmptyState;
