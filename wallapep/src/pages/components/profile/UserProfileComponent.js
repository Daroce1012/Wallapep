import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, Typography, Row, Col, Spin, Avatar, Space, Divider, Tabs, Statistic, Button, Empty } from 'antd'; // Importar Empty
import { UserOutlined, MailOutlined, GlobalOutlined, ShoppingOutlined, DollarOutlined, StarOutlined, MessageOutlined } from '@ant-design/icons';
import UserTransactionsComponent from './UserTransactionsComponent';
import UserProductsComponent from './UserProductsComponent';
import { apiGet, fetchUserCounts } from '../../../utils/UtilsApi';
import { fetchUserById } from '../../../utils/UtilsUser';
import styles from '../../../styles/UserProfile.module.css';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import UserInfoItem from '../common/UserInfoItem';
import StarRating from '../common/StarRating';
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
    let [userLoadError, setUserLoadError] = useState(null);
    let [activeTab, setActiveTab] = useState('products')
    useEffect(() => {
        if (userId) {
            loadUserData();
        }
    }, [userId])
    let loadUserData = async () => {
        setLoading(true);
        setUserLoadError(null); // Resetear error al cargar
        try {
            const [userDataResult, countsDataResult] = await Promise.allSettled([
                fetchUserById(userId),
                loadCounts()
            ]);
            if (userDataResult.status === 'fulfilled' && userDataResult.value) {
                setUser(userDataResult.value);
            }
            if (userDataResult.status === 'rejected') {
                console.error("Error loading user:", userDataResult.reason);
                setUserLoadError("Failed to load user profile. Please try again.");
            } else if (!userDataResult.value) {
                setUserLoadError("User profile not found.");
            }
            if (countsDataResult.status === 'fulfilled' && countsDataResult.value) {
                const { transactionsCount, totalSales, totalPurchases, productsCount } = countsDataResult.value;
                setTransactionsCount(transactionsCount);
                setTotalSales(totalSales);
                setTotalPurchases(totalPurchases);
                setProductsCount(productsCount);
            } else if (countsDataResult.status === 'rejected') {
                console.error("Error loading user counts:", countsDataResult.reason);
            }
        } catch (error) {
            console.error("Unhandled error loading user data:", error);
            setUserLoadError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }
    let loadCounts = async () => {
        return await fetchUserCounts(userId);
    };
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
      <LoadingSpinner tip="Loading profile..." />
    );
  }
  if (userLoadError) {
    return (
      <Card>
        <EmptyState 
          description={userLoadError}
          image={Empty.PRESENTED_IMAGE_SIMPLE} // Uso correcto de Empty.PRESENTED_IMAGE_SIMPLE
          title="Profile Load Error"
          action={(
            <Button 
              size="small" 
              danger 
              onClick={loadUserData}
            >
              Retry
            </Button>
          )}
        />
      </Card>
    );
  }
  if (!user) {
    return (
      <Card>
        <EmptyState 
          description="The requested user profile could not be found."
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          title="User not found"
        />
      </Card>
    );
  }
  return (
    <div className={styles.profileContainer}>
      {/* Header Banner */}
      <div className={styles.profileBanner}>
        <div 
          className={styles.profileBannerImage}
        />
      </div>
      {/* Profile Card */}
      <Card className={styles.profileCard}>
        <Row gutter={[24, 24]}>
          {/* Left Sidebar - User Info */}
          <Col xs={24} lg={8}>
            <div className={styles.avatarContainer}>
              <Avatar 
                size={140} 
                src={user.profilePicture || "https://lh3.googleusercontent.com/aida-public/AB6AXuDEl3jC24KOsg42tW4MvPht7xSSFUvP2rD_EqlrR2HX0iQFvWLGT7PDqCuCfwNCBIWYQbacUM-ewJb8Ex0FlkOFn_rtinBvf_yqC1oVn0LjMZEg1O7sFtrtCvGfuEcFb6rBnXTPwxJ8ENlxA524bgv6qTbH2DM0WyBX4-aQlZ3Nbtm4y9ZfgG2nlS-tA6PHxD91C5mLRTF4Nm3G2qZAocR8iCfiPN09kVqp9pg9-aymE_Qd6vrRr4I60ag6P4stg3Jgi8Pngfz0g8GE"}
                className={styles.profileAvatar}
              />
              <div className={styles.userDetailsContainer}>
                <Title level={2} className={styles.userNameTitle}>
                  {user.name || 'User'}
                </Title>
                <Paragraph className={styles.userDescriptionParagraph} type="secondary">
                  {user.description || 'Handcrafted goods for the modern home'}
                </Paragraph>
                {/* Rating */}
                {stats.transactions > 0 && (
                  <StarRating 
                    rating={userRating} 
                    totalReviews={stats.transactions}
                    className={styles.userRatingStyle}
                  />
                )}
                <Paragraph className={styles.userProductsParagraph} type="secondary">
                  {stats.products > 0 
                    ? `Selling ${stats.products} products` 
                    : 'No products for sale'}
                </Paragraph>
                <Divider />
                {/* User Details */}
                <Space direction="vertical" size="middle" className={styles.userInfoSpace}>
                  <UserInfoItem 
                    icon={<UserOutlined className={styles.userInfoIcon} />}
                    label="User ID"
                    value={`#${user.id}`}
                  />
                  <UserInfoItem
                    icon={<MailOutlined className={styles.userInfoIcon} />}
                    label="Email"
                    value={user.email}
                  />
                  {(user.country || user.postalCode) && (
                    <UserInfoItem
                      icon={<GlobalOutlined className={styles.userInfoIcon} />}
                      label="Location"
                      value={`${user.country || 'Unknown'} ${user.postalCode ? `(${user.postalCode})` : ''}`}
                    />
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
              className={styles.statsCard}
            >
              {/* Aquí podrías añadir un EmptyState si hay un statsLoadError */}
              <Row gutter={[16, 16]}>
                {Object.entries(STATS_CONFIG).map(([key, config]) => (
                  <Col xs={12} sm={6} key={key}>
                    <Statistic
                      title={config.title}
                      value={stats[key]}
                      prefix={config.icon}
                      valueStyle={{ color: config.color }} // Keep dynamic color
                      className={styles.statisticValue}
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
};
export default UserProfileComponent;

