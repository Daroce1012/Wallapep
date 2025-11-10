import { Typography, Space, Row, Col, Button } from 'antd';
import {
  TruckOutlined,
  SafetyOutlined,
  DollarCircleOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import styles from '../../../styles/Home.module.css';

const { Title, Text } = Typography;

const HeroSection = () => {
  const features = [
    {
      icon: <TruckOutlined />,
      title: 'Free Shipping',
      description: 'On orders over €50'
    },
    {
      icon: <SafetyOutlined />,
      title: 'Secure Payment',
      description: '100% protected'
    },
    {
      icon: <DollarCircleOutlined />,
      title: 'Best Prices',
      description: 'Guaranteed'
    }
  ];

  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroBackground} />
      <div className={styles.mainContentWrapper}>
        <div className={styles.heroContent}>
          <div className={styles.heroContentInner}>
            <div className={styles.heroTextContainer}>
                <Title level={1} className={styles.heroTitle}>
                  Welcome to Wallapep
                </Title>

                <Text className={styles.heroSubtitle}>
                  Discover the latest trends and enjoy up to 50% off on selected items. Don't miss out!
                </Text>

                <Link href="/products">
                  <Button type="primary" size="large" className={styles.heroButton}>
                    Shop Now
                  </Button>
                </Link>
              </div>

              <Row gutter={[32, 32]} justify="center" className={styles.heroFeaturesRow}>
                {features.map((feature, index) => (
                  <Col xs={24} sm={8} key={index}>
                    <Space direction="vertical" align="center" size={12}>
                      <div className={styles.heroFeatureIcon}>
                        {feature.icon}
                      </div>
                      <div>
                        <Text className={styles.heroFeatureTitle}>
                          {feature.title}
                        </Text>
                        <Text className={styles.heroFeatureDescription}>
                          {feature.description}
                        </Text>
                      </div>
                    </Space>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </div>
      </div>
  );
};

export default HeroSection;
