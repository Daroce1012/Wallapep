import {useState, useEffect } from "react";
import { Typography, Spin, Card, Row, Col, Space } from 'antd';
import Link from "next/link";
import { apiGet } from '../../../utils/UtilsApi';
import styles from '../../../styles/UserTransactionsCard.module.css';

const { Text, Title } = Typography;

let UserTransactionsComponent = ({userId}) => {
    let [transactions, setTransactions] = useState([])
    let [loading, setLoading] = useState(true)

    useEffect(() => {
        if (userId) {
            loadTransactions();
        }
    }, [userId])

    let loadTransactions = async () => {
        setLoading(true);
        try {
            let [sales, purchases] = await Promise.all([
                apiGet("/transactions/public", { params: { sellerId: userId } }),
                apiGet("/transactions/public", { params: { buyerId: userId } })
            ]);

            let allTransactions = [];
            if (sales) allTransactions = [...allTransactions, ...sales];
            if (purchases) allTransactions = [...allTransactions, ...purchases];

            // Remove duplicates based on transaction id
            let uniqueTransactions = allTransactions.filter((transaction, index, self) =>
                index === self.findIndex(t => t.id === transaction.id)
            );

            setTransactions(uniqueTransactions);
        } catch (error) {
            console.error("Error loading transactions:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <Spin size="large" style={{ display: 'block', margin: 'auto' }} />
    }

    if (transactions.length === 0) {
        return <p>No transactions found.</p>
    }

    return (
        <Row gutter={[16, 16]}>
            {transactions.map(transaction => (
                <Col key={transaction.id} xs={24} sm={12} md={8} lg={6}>
                    <Link href={`/detailTransaction/${transaction.id}`} className={styles.transactionCardLink}>
                        <Card
                            hoverable
                            className={styles.transactionCard}
                            title={<Title level={5} className={styles.transactionTitle}>{transaction.title || `Transaction #${transaction.id}`}</Title>}
                        >
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Text>Role: {
                                    transaction.sellerId == userId ? <Text strong type="success">Seller</Text> : <Text strong type="info">Buyer</Text>
                                }</Text>
                            </Space>
                        </Card>
                    </Link>
                </Col>
            ))}
        </Row>
    )
}

export default UserTransactionsComponent;

