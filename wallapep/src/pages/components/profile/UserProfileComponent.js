import { useState, useEffect, useMemo, useCallback } from "react";

import { Card, Typography, Row, Col, Spin, Avatar, Space, Divider, Tabs, Statistic, Button } from 'antd';

import { UserOutlined, MailOutlined, GlobalOutlined, ShoppingOutlined, DollarOutlined, StarOutlined, MessageOutlined } from '@ant-design/icons';

import UserTransactionsComponent from './UserTransactionsComponent';

import UserProductsComponent from './UserProductsComponent';

import { apiGet } from '../../../utils/UtilsApi';

import styles from '../../../styles/UserProfile.module.css';

const { Title, Text, Paragraph } = Typography;

const STATS_CONFIG = {

  sales: {

    title: "Total Sales",

    icon: <ShoppingOutlined />,

    color: '#52c41a'

  },

  purchases: {

    title: "Total Purchases",

    icon: <DollarOutlined />,

    color: '#1890ff'

  },

  products: {

    title: "Products for Sale",

    icon: <ShoppingOutlined />,

    color: '#faad14'

  },

  transactions: {

    title: "Total Transactions",

    icon: <StarOutlined />,

    color: '#722ed1'

  }

};

const UserProfileComponent = ({ userId }) => {
    let [user, setUser] = useState(null)
    let [transactionsCount, setTransactionsCount] = useState(0)
    let [productsCount, setProductsCount] = useState(0)
    let [totalSales, setTotalSales] = useState(0)
    let [totalPurchases, setTotalPurchases] = useState(0)
    let [loading, setLoading] = useState(true)
    let [activeTab, setActiveTab] = useState('products')

    useEffect(() => {
        if (userId) {
            loadUserData();
        }
    }, [userId])

    let loadUserData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                loadUser(),
                loadCounts()
            ]);
        } catch (error) {
            console.error("Error loading user data:", error);
        } finally {
            setLoading(false);
        }
    }

    let loadUser = async () => {
        let jsonData = await apiGet(`/users/${userId}`);
        if (jsonData) {
            setUser(jsonData);
        }
    }

    let loadCounts = async () => {
        try {
            let [sales, purchases, productsData] = await Promise.all([
                apiGet("/transactions/public", { params: { sellerId: userId } }),
                apiGet("/transactions/public", { params: { buyerId: userId } }),
                apiGet("/products", { params: { sellerId: userId } })
            ]);

            let allTransactions = [];
            let salesCount = 0;
            let purchasesCount = 0;

            if (sales) {
                allTransactions = [...allTransactions, ...sales];
                salesCount = sales.length;
            }

            if (purchases) {
                allTransactions = [...allTransactions, ...purchases];
                purchasesCount = purchases.length;
            }

            // Remove duplicates based on transaction id
            let uniqueTransactions = allTransactions.filter((transaction, index, self) =>
                index === self.findIndex(t => t.id === transaction.id)
            );

            // Find last transaction date
            let lastDate = null;
            uniqueTransactions.forEach(transaction => {
                let transactionDate = transaction.date || 0;
                if (!lastDate || transactionDate > lastDate) {
                    lastDate = transactionDate;
                }
            });

            setTransactionsCount(uniqueTransactions.length);
            setTotalSales(salesCount);
            setTotalPurchases(purchasesCount);

            if (productsData) {
                setProductsCount(productsData.length);
            }
        } catch (error) {
            console.error("Error loading counts:", error);
        }
    }

  const stats = useMemo(() => ({
    sales: totalSales,
    purchases: totalPurchases,
    products: productsCount,
    transactions: transactionsCount,
  }), [totalSales, totalPurchases, productsCount, transactionsCount]);

  const userRating = useMemo(() => {
    if (stats.transactions === 0) return 0;
    return (stats.sales / stats.transactions) * 5; // Assuming a 5-star rating system
  }, [stats.sales, stats.transactions]);

  const tabItems = useMemo(() => [
    {
      key: 'products',
      label: (
        <span>
          <ShoppingOutlined /> Products ({stats.products})
        </span>
      ),
      children: <UserProductsComponent userId={userId} />
    },
    {
      key: 'transactions',
      label: (
        <span>
          <StarOutlined /> Transactions ({stats.transactions})
        </span>
      ),
      children: <UserTransactionsComponent userId={userId} />
    }
  ], [userId, stats.products, stats.transactions]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="Loading profile..." />
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Title level={3}>User not found</Title>
          <Text type="secondary">The requested user profile could not be found.</Text>
        </div>
      </Card>
    );
  }

  return (
    <div className={styles.profileContainer}>
      {/* Header Banner */}
      <div className={styles.profileBanner}>
        <div 
          style={{ 
            width: '100%', 
            height: '200px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '8px 8px 0 0',
            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCkIv812LERa3nNohalzgOZbkdZeSv-TGZjLHIL_AEgCQulQ3X1EpOeZjBhPob2dg8AoXz-VZg_LlszVTqWPMaqx4ivuAzHjOk4-4jHQbho9LOLeezEvrgArUoAbQx6pgQn0gQZXgYOua6Zr97mU3DQgM7g0en8S-Ijy6eL1ImOWEvbjey5U8776uEfgTIPZp51TuP83Zve_3c_jBTOs3U8CLaGOvh19yeMqndtoPc2iniekQv0fIG1hi6wTON4MlmB6D5PPpOrMD6F")'
          }} 
        />
      </div>
      {/* Profile Card */}
      <Card className={styles.profileCard}>
        <Row gutter={[24, 24]}>
          {/* Left Sidebar - User Info */}
          <Col xs={24} lg={8}>
            <div style={{ textAlign: 'center', position: 'relative', top: '-50px' }}>
              <Avatar 
                size={140} 
                src={user.profilePicture || "https://lh3.googleusercontent.com/aida-public/AB6AXuDEl3jC24KOsg42tW4MvPht7xSSFUvP2rD_EqlrR2HX0iQFvWLGT7PDqCuCfwNCBIWYQbacUM-ewJb8Ex0FlkOFn_rtinBvf_yqC1oVn0LjMZEg1O7sFtrtCvGfuEcFb6rBnXTPwxJ8ENlxA524bgv6qTbH2DM0WyBX4-aQlZ3Nbtm4y9ZfgG2nlS-tA6PHxD91C5mLRTF4Nm3G2qZAocR8iCfiPN09kVqp9pg9-aymE_Qd6vrRr4I60ag6P4stg3Jgi8Pngfz0g8GE"}
                style={{ 
                  border: '5px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              />
              
              <div style={{ marginTop: '16px' }}>
                <Title level={2} style={{ marginBottom: '4px', fontSize: '2rem', fontWeight: 'bold' }}>
                  {user.name || 'User'}
                </Title>
                
                <Paragraph type="secondary" style={{ fontSize: '1rem', marginBottom: '12px' }}>
                  {user.description || 'Handcrafted goods for the modern home'}
                </Paragraph>
                {/* Rating */}
                {stats.transactions > 0 && (
                  <Space style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', color: '#faad14' }}>
                      {[...Array(5)].map((_, i) => (
                        <StarOutlined 
                          key={i} 
                          style={{ 
                            fontSize: '16px',
                            opacity: i < Math.floor(userRating) ? 1 : 0.3 
                          }} 
                        />
                      ))}
                    </div>
                    <Text strong style={{ fontSize: '15px' }}>
                      {userRating.toFixed(1)} ({stats.transactions} reviews)
                    </Text>
                  </Space>
                )}
                <Paragraph type="secondary" style={{ fontSize: '15px', marginBottom: '20px' }}>
                  {stats.products > 0 
                    ? `Selling ${stats.products} products` 
                    : 'No products for sale'}
                </Paragraph>
                {/* <Button 
                  type="primary" 
                  icon={<MessageOutlined />} 
                  size="large"
                  block
                  style={{ marginBottom: '16px' }}
                >
                  Contact Seller
                </Button> */}
                <Divider />
                {/* User Details */}
                <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'left' }}>
                  <Space>
                    <UserOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                    <div>
                      <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                        User ID
                      </Text>
                      <Text strong>#{user.id}</Text>
                    </div>
                  </Space>
                  {user.email && (
                    <Space>
                      <MailOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                      <div>
                        <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                          Email
                        </Text>
                        <Text strong>{user.email}</Text>
                      </div>
                    </Space>
                  )}
                  {(user.country || user.postalCode) && (
                    <Space>
                      <GlobalOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                      <div>
                        <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                          Location
                        </Text>
                        <Text strong>
                          {user.country || 'Unknown'} 
                          {user.postalCode && ` (${user.postalCode})`}
                        </Text>
                      </div>
                    </Space>
                  )}
                </Space>
              </div>
            </div>
          </Col>
          {/* Right Content - Stats & Tabs */}
          <Col xs={24} lg={16}>
            {/* Statistics */}
            <Card 
              bordered={false}
              style={{ 
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                marginBottom: '24px'
              }}
            >
              <Row gutter={[16, 16]}>
                {Object.entries(STATS_CONFIG).map(([key, config]) => (
                  <Col xs={12} sm={6} key={key}>
                    <Statistic
                      title={config.title}
                      value={stats[key]}
                      prefix={config.icon}
                      valueStyle={{ color: config.color, fontSize: '24px' }}
                    />
                  </Col>
                ))}
              </Row>
            </Card>
            {/* Tabs */}
            <Card bordered={false}>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
                size="large"
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );

}

export default UserProfileComponent;

