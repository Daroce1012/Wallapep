import React from 'react';
import { Typography, Space } from 'antd';
import { TruckOutlined, DollarCircleOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import styles from '../../../styles/HeroSection.module.css';

const { Title, Paragraph, Text } = Typography;

export default function HeroSection() {
  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <Title level={1} className={styles.title}>
          Welcome to Wallapep
        </Title>
        <Paragraph className={styles.paragraph}>
          Your trusted marketplace to find everything you need
        </Paragraph>
        <Paragraph className={styles.paragraphSecondary}>
          Discover thousands of quality products organized by categories.
          Shop safely and receive your orders in record time.
          From technology to books, we have everything you're looking for at the best price.
        </Paragraph>
        <Space size="large" wrap>
          <Space>
            <TruckOutlined className={styles.icon} />
            <Text className={styles.text}>Free Shipping</Text>
          </Space>
          <Space>
            <DollarCircleOutlined className={styles.icon} />
            <Text className={styles.text}>Best Prices</Text>
          </Space>
          <Space>
            <SafetyCertificateOutlined className={styles.icon} />
            <Text className={styles.text}>Guaranteed Quality</Text>
          </Space>
        </Space>
      </div>
    </div>
  );
}
