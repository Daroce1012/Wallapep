import {useState, useEffect } from "react";
import { Card, Descriptions, Typography, Space } from 'antd';
import Link from "next/link";
import { DollarOutlined, UserOutlined, HomeOutlined, CreditCardOutlined, IdcardOutlined, GlobalOutlined } from '@ant-design/icons';
import { getUserIdFromApiKey } from '../../../utils/UtilsUser';
import { apiGet } from '../../../utils/UtilsApi';
import styles from '../../../styles/DetailsTransaction.module.css';

const { Title, Text } = Typography;

let DetailsTransactionComponent = ({id}) => {
    let [transaction, setTransaction] = useState({})
    let [userId, setUserId] = useState(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUserId(getUserIdFromApiKey());
            getTransaction(id);
        }
    }, [id])

    let getTransaction = async (id) => {
        if (typeof window === 'undefined') return;
        
        let jsonData = await apiGet("/transactions/own");
        if (jsonData) {
            let foundTransaction = jsonData.find(t => (t.tid || t.id) == id);
            if (foundTransaction) {
                setTransaction(foundTransaction);
            }
        }
    }

    return (
        <Card>
            <Title level={2} className={styles.mainTitle}>Transaction Details</Title>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Transaction ID">
                    <Space>
                        <IdcardOutlined />
                        <Text>{transaction.tid || transaction.id}</Text>
                    </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Product">
                    {transaction.productId ? (
                        <Link href={`/detailProduct/${transaction.productId}`}>
                            <Space>
                                <Text strong>{transaction.title || `Product #${transaction.productId}`}</Text>
                            </Space>
                        </Link>
                    ) : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Price">
                    <Space>
                        <DollarOutlined />
                        <Text strong className={styles.priceText}>
                            € {transaction.productPrice || '-'}
                        </Text>
                    </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Buyer">
                    {transaction.buyerId ? (
                        <Link href={`/user/${transaction.buyerId}`}>
                            <Space>
                                <UserOutlined />
                                <Text>{`User #${transaction.buyerId}`}</Text>
                            </Space>
                        </Link>
                    ) : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Seller">
                    {transaction.sellerId ? (
                        <Link href={`/user/${transaction.sellerId}`}>
                            <Space>
                                <UserOutlined />
                                <Text>{`User #${transaction.sellerId}`}</Text>
                            </Space>
                        </Link>
                    ) : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Shipping Address">
                    <Space>
                        <HomeOutlined />
                        <Text>{transaction.buyerAddress || '-'}</Text>
                    </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Postal Code">
                    <Space>
                        <HomeOutlined />
                        <Text>{transaction.buyerPostCode || '-'}</Text>
                    </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Country">
                    <Space>
                        <GlobalOutlined />
                        <Text>{transaction.buyerCountry || '-'}</Text>
                    </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Payment Method">
                    <Space>
                        <CreditCardOutlined />
                        <Text>{transaction.buyerPaymentId ? `Card #${transaction.buyerPaymentId}` : 'Not specified'}</Text>
                    </Space>
                </Descriptions.Item>
            </Descriptions>
        </Card>
    )
}

export default DetailsTransactionComponent;

