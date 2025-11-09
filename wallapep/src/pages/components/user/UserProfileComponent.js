import {useState, useEffect } from "react";
import { Card, Typography, Row, Col, Spin, Avatar, Space, Divider, Tabs, Statistic } from 'antd';
import { UserOutlined, MailOutlined, GlobalOutlined, IdcardOutlined, ShoppingOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import UserTransactionsComponent from './UserTransactionsComponent';
import UserProductsComponent from './UserProductsComponent';
import { apiGet } from '../../../utils/UtilsApi';

const { Title, Text } = Typography;

let UserProfileComponent = ({userId}) => {
    let [user, setUser] = useState(null)
    let [transactionsCount, setTransactionsCount] = useState(0)
    let [productsCount, setProductsCount] = useState(0)
    let [totalSales, setTotalSales] = useState(0)
    let [totalPurchases, setTotalPurchases] = useState(0)
    let [lastTransactionDate, setLastTransactionDate] = useState(null)
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
            console.log("User data from API:", jsonData); // Para depuración
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
            setLastTransactionDate(lastDate);

            if (productsData) {
                setProductsCount(productsData.length);
            }
        } catch (error) {
            console.error("Error loading counts:", error);
        }
    }


    if (loading) {
        return (
            <Spin size="large" />
        );
    }

    if (!user) {
        return (
            <div>
                <Title level={2}>User Profile</Title>
                <Text type="secondary">User not found</Text>
            </div>
        );
    }


    let tabItems = [
        {
            key: 'products',
            label: `Products for Sale (${productsCount})`,
            children: <UserProductsComponent userId={userId} />
        },
        {
            key: 'transactions',
            label: `Transactions (${transactionsCount})`,
            children: <UserTransactionsComponent userId={userId} />
        }
    ];

    return (
        <div>
            <Card>
                <Card.Meta
                    avatar={<Avatar size={120} icon={<UserOutlined />} />}
                    title={<Title level={2}>{user.name || 'User'}</Title>}
                    description={
                        <Space direction="vertical" size="middle">
                            <Space>
                                <UserOutlined />
                                <Text>Name: {user.name || '-'}</Text>
                            </Space>
                            <Space>
                                <IdcardOutlined />
                                <Text>ID: {user.id}</Text>
                            </Space>
                            {user.email && (
                                <Space>
                                    <MailOutlined />
                                    <Text>{user.email}</Text>
                                </Space>
                            )}
                            {(user.country || user.postalCode) && (
                                <Space>
                                    <GlobalOutlined />
                                    <Text>{user.country || '-'} {user.postalCode ? `(${user.postalCode})` : ''}</Text>
                                </Space>
                            )}
                        </Space>
                    }
                />
                <Divider />
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Statistic
                            title="Total Sales"
                            value={totalSales}
                            prefix={<ShoppingOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Statistic
                            title="Total Purchases"
                            value={totalPurchases}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Statistic
                            title="Products for Sale"
                            value={productsCount}
                            prefix={<ShoppingOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Col>
                </Row>
            </Card>

            <Card>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                />
            </Card>
        </div>
    )
}

export default UserProfileComponent;

