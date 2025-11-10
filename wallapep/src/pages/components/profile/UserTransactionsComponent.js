import {useState, useEffect } from "react";
import { Typography, Spin, Card, Row, Col, Space, Button } from 'antd';
import Link from "next/link";
import { apiGet } from '../../../utils/UtilsApi';
import styles from '../../../styles/UserTransactionsCard.module.css';
import LoadingSpinner from '../common/LoadingSpinner'; // Importar LoadingSpinner
import EmptyState from '../common/EmptyState'; // Importar EmptyState
// import { timestampToString } from '../../../utils/UtilsDates';
const { Text, Title } = Typography;
let UserTransactionsComponent = ({userId}) => {
    let [transactions, setTransactions] = useState([])
    let [loading, setLoading] = useState(true)
    let [transactionLoadError, setTransactionLoadError] = useState(null); // Nuevo estado de error
    useEffect(() => {
        if (userId) {
            loadTransactions();
        }
    }, [userId])
    let loadTransactions = async () => {
        setLoading(true);
        setTransactionLoadError(null); // Resetear error al cargar
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
            if (!sales && !purchases) {
                setTransactionLoadError("No transactions found for this user.");
            }
        } catch (error) {
            console.error("Error loading transactions:", error);
            setTransactionLoadError("Failed to load user transactions. Please try again.");
        } finally {
            setLoading(false);
        }
    }
    if (loading) {
        return <LoadingSpinner tip="Loading user transactions..." />;
    }
    if (transactionLoadError) {
        return (
            <EmptyState
                description={transactionLoadError}
                title="Error loading transactions"
                action={(
                    <Button 
                        size="small" 
                        danger 
                        onClick={loadTransactions}
                    >
                        Retry
                    </Button>
                )}
            />
        );
    }
    if (transactions.length === 0) {
        return <EmptyState description="No transactions found." />;
    }
    return (
        <Row gutter={[16, 16]}>
            {transactions.map(transaction => (
                <Col key={transaction.id} xs={24} sm={12} md={8} lg={6}>
                    {/* <Link href={`/detailTransaction/${transaction.id}`} className={styles.transactionCardLink}> */}
                        <Card
                            
                            className={styles.transactionCard}
                            title={<Title level={5} className={styles.transactionTitle}>{transaction.title || `Transaction #${transaction.id}`}</Title>}
                        >
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Text>Role: {
                                    transaction.sellerId == userId ? <Text strong type="success">Seller</Text> : <Text strong type="info">Buyer</Text>
                                }</Text>
                                {/* {transaction.startDate && (
                                    <Text type="secondary">Date: {timestampToString(transaction.startDate)}</Text>
                                )} */}
                            </Space>
                        </Card>
                    {/* </Link> */}
                </Col>
            ))}
        </Row>
    )
}
export default UserTransactionsComponent;

