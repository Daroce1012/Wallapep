import {useState, useEffect } from "react";
import { Table, Space, Tag, Typography, Input, Button, Empty, Card, Row, Col, Statistic } from 'antd';
import { TransactionOutlined, DollarOutlined, ShoppingOutlined, CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import Link from "next/link";
import { timestampToString } from "../../../utils/UtilsDates";
import { categoryLabels } from "../../../utils/UtilsCategories";
import { getUserIdFromApiKey } from '../../../utils/UtilsUser';
import { apiGet } from '../../../utils/UtilsApi';
import styles from '../../../styles/ListMyTransactions.module.css';

const { Text, Title } = Typography;

let ListMyTransactionsComponent = () => {
    let [transactions, setTransactions] = useState([])
    let [totalEarnedLastMonth, setTotalEarnedLastMonth] = useState(0)
    let [totalSpentLastMonth, setTotalSpentLastMonth] = useState(0)
    let [transactionsLastMonth, setTransactionsLastMonth] = useState(0)
    let [userId, setUserId] = useState(null)

    useEffect(() => {
        let currentUserId = getUserIdFromApiKey();
        setUserId(currentUserId);
        if (currentUserId) {
            getMyTransactions(currentUserId);
        }
    }, [])

    let getMyTransactions = async (currentUserId) => {
        let jsonData = await apiGet("/transactions/own");
        if (jsonData) {
            jsonData.forEach(transaction => {
                transaction.key = transaction.tid || transaction.id
            });
            setTransactions(jsonData)
            calculateStatistics(jsonData, currentUserId)
        }
    }

    let calculateStatistics = (transactions, currentUserId) => {
        if (!currentUserId) return;

        let now = Date.now(); // milisegundos

        let earned = 0;
        let spent = 0;
        let count = 0;

        transactions.forEach(transaction => {
            let transactionDate = transaction.date; 
            
            if (transactionDate) { // Eliminado el filtro de oneMonthAgo
                count++;
                
                if (transaction.sellerId == currentUserId) {
                    earned += transaction.productPrice || 0;
                }
                if (transaction.buyerId == currentUserId) {
                    spent += transaction.productPrice || 0;
                }
            }
        });

        setTotalEarnedLastMonth(earned);
        setTotalSpentLastMonth(spent);
        setTransactionsLastMonth(count);
    }


    let columns = [
        {
            title: "Product",
            dataIndex: "title",
            key: "title",
            sorter: (a, b) => {
                let titleA = a.title || '';
                let titleB = b.title || '';
                return titleA.localeCompare(titleB);
            },
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className={styles.filterDropdown}>
                    <Input
                        placeholder="Search product"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        className={styles.filterInput}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            size="small"
                            className={styles.filterButton}
                        >
                            Search
                        </Button>
                        <Button onClick={() => clearFilters()} size="small" className={styles.filterButton}>
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            onFilter: (value, record) =>
                record.title && record.title.toLowerCase().includes(value.toLowerCase()),
            render: (title, record) => (
                <Link href={`detailProduct/${record.productId}`}>
                    {title || `Product #${record.productId}`}
                </Link>
            )
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            filters: Object.keys(categoryLabels).filter(k => k !== 'todos').map(key => ({
                text: categoryLabels[key].label,
                value: key
            })),
            onFilter: (value, record) => record.category === value,
            render: (category) => {
                if (!category) return '-';
                let categoryInfo = categoryLabels[category];
                return categoryInfo ? categoryInfo.label : category;
            }
        },
        {
            title: "Price (€)",
            dataIndex: "productPrice",
            key: "productPrice",
            sorter: (a, b) => (a.productPrice || 0) - (b.productPrice || 0),
            render: (price) => price ? (
                <Text strong>
                    € {price} {/* Añadido espacio */}
                </Text>
            ) : '-'
        },
        {
            title: "Role",
            key: "role",
            filters: [
                { text: 'Seller', value: 'seller' },
                { text: 'Buyer', value: 'buyer' },
            ],
            onFilter: (value, record) => {
                if (value === 'seller') return record.sellerId == userId;
                if (value === 'buyer') return record.buyerId == userId;
                return true;
            },
            render: (_, record) => {
                if (record.buyerId == userId) {
                    return <Tag color="blue">Buyer</Tag>
                } else if (record.sellerId == userId) {
                    return <Tag color="green">Seller</Tag>
                }
                return '-'
            }
        },
        {
            title: "Buyer",
            key: "buyer",
            render: (_, record) => {
                if (record.buyerId == userId) {
                    return <Text strong>You</Text>
                } else if (record.buyerId) {
                    return <Link href={`user/${record.buyerId}`}>User #{record.buyerId}</Link>
                }
                return '-'
            }
        },
        {
            title: "Seller",
            key: "seller",
            render: (_, record) => {
                if (record.sellerId == userId) {
                    return <Text strong>You</Text>
                } else if (record.sellerId) {
                    return <Link href={`user/${record.sellerId}`}>User #{record.sellerId}</Link>
                }
                return '-'
            }
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Link href={`/detailTransaction/${record.tid || record.id}`} passHref>
                        <Button type="link" size="small" icon={<EyeOutlined />} />
                    </Link>
                </Space>
            )
        },
    ]

    return (
        <div>
            <Space align="center" className={styles.header}>
                <TransactionOutlined className={styles.headerIcon} />
                <Title level={2} className={styles.headerTitle}>My Transactions</Title>
            </Space>
            {transactions.length > 0 && (
                <Row gutter={[16, 16]} className={styles.statisticsRow}>
                    <Col xs={24} sm={12} md={8}> {/* Cambiado de md={6} a md={8} */}
                        <Card>
                            <Statistic
                                title="Total Earned (Last Month)"
                                value={totalEarnedLastMonth}
                                prefix={<DollarOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                                formatter={(value) => `€ ${value.toFixed(2)}`} /* Añadido espacio */
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}> {/* Cambiado de md={6} a md={8} */}
                        <Card>
                            <Statistic
                                title="Total Spent (Last Month)"
                                value={totalSpentLastMonth}
                                prefix={<ShoppingOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                                formatter={(value) => `€ ${value.toFixed(2)}`} /* Añadido espacio */
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}> {/* Cambiado de md={6} a md={8} */}
                        <Card>
                            <Statistic
                                title="Transactions (Last Month)"
                                value={transactionsLastMonth}
                                prefix={<TransactionOutlined />}
                            />
                        </Card>
                    </Col>
                    
                </Row>
            )}
            {transactions.length === 0 ? (
                <Card>
                    <Empty 
                        description="You have no registered transactions."
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                </Card>
            ) : (
                <Table 
                    columns={columns} 
                    dataSource={transactions}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: true }}
                />
            )}
        </div>
    )
}

export default ListMyTransactionsComponent;

