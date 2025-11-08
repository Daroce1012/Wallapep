import React from 'react';
import { Typography, Space } from 'antd';
import { TruckOutlined, DollarCircleOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function HeroSection() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
        borderRadius: '16px',
        padding: '48px 32px',
        marginBottom: '32px',
        color: 'white',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      }}
    >
      <div style={{ maxWidth: '800px' }}>
        <Title level={1} style={{ color: 'white', marginBottom: '16px', fontSize: '48px' }}>
          Welcome to Wallapep
        </Title>
        <Paragraph style={{ fontSize: '20px', marginBottom: '24px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>
          Your trusted marketplace to find everything you need
        </Paragraph>
        <Paragraph style={{ fontSize: '16px', marginBottom: '32px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
          Discover thousands of quality products organized by categories.
          Shop safely and receive your orders in record time.
          From technology to books, we have everything you're looking for at the best price.
        </Paragraph>
        <Space size="large" wrap>
          <Space>
            <TruckOutlined style={{ fontSize: '20px' }} />
            <Text style={{ fontSize: '16px', color: 'white' }}>Free Shipping</Text>
          </Space>
          <Space>
            <DollarCircleOutlined style={{ fontSize: '20px' }} />
            <Text style={{ fontSize: '16px', color: 'white' }}>Best Prices</Text>
          </Space>
          <Space>
            <SafetyCertificateOutlined style={{ fontSize: '20px' }} />
            <Text style={{ fontSize: '16px', color: 'white' }}>Guaranteed Quality</Text>
          </Space>
        </Space>
      </div>
    </div>
  );
}
