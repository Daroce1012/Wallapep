import {useState, useEffect } from "react";
import { Card, Descriptions, Typography, Tag, Button } from 'antd';
import Link from "next/link";
import { ArrowLeftOutlined } from '@ant-design/icons';
import { timestampToString } from "../../../utils/UtilsDates";

const { Title, Text } = Typography;

let DetailsTransactionComponent = ({id}) => {
    let [transaction, setTransaction] = useState({})
    let [userId, setUserId] = useState(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            getUserIdFromApiKey();
            getTransaction(id);
        }
    }, [id])

    let getUserIdFromApiKey = () => {
        if (typeof window === 'undefined') return null;
        
        let apiKey = localStorage.getItem("apiKey");
        if (!apiKey) {
            setUserId(null);
            return;
        }
        
        try {
            let payload = apiKey.split('.')[1];
            let decoded = JSON.parse(atob(payload));
            setUserId(decoded.id);
        } catch (error) {
            setUserId(null);
        }
    }

    let getTransaction = async (id) => {
        if (typeof window === 'undefined') return;
        
        let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL+"/transactions/own",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if ( response.ok ){
            let jsonData = await response.json();
            let foundTransaction = jsonData.find(t => (t.tid || t.id) == id);
            if (foundTransaction) {
                setTransaction(foundTransaction);
            }
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach( e => {
                console.log("Error: "+e.msg)
            })
        }
    }

    let getRole = () => {
        if (!userId || !transaction.buyerId || !transaction.sellerId) {
            return { role: "Unknown", color: "default" };
        }
        
        if (transaction.buyerId == userId) {
            return { role: "Buyer", color: "blue" };
        } else if (transaction.sellerId == userId) {
            return { role: "Seller", color: "green" };
        }
        return { role: "Unknown", color: "default" };
    }

    let roleInfo = getRole();

    return (
        <div>
            <Link href="myTransactions">
                <Button icon={<ArrowLeftOutlined />} style={{ marginBottom: '16px' }}>
                    Back to Transactions
                </Button>
            </Link>
            <Card>
                <Title level={2}>Transaction Details</Title>
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Transaction ID">
                        {transaction.tid || transaction.id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Product">
                        <Link href={`detailProduct/${transaction.productId}`}>
                            {transaction.title || `Product #${transaction.productId}`}
                        </Link>
                    </Descriptions.Item>
                    <Descriptions.Item label="Price">
                        <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                            €{transaction.productPrice || '-'}
                        </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Your Role">
                        <Tag color={roleInfo.color}>{roleInfo.role}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Buyer">
                        {transaction.buyerId ? (
                            <Link href={`user/${transaction.buyerId}`}>
                                User #{transaction.buyerId}
                            </Link>
                        ) : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Seller">
                        {transaction.sellerId ? (
                            <Link href={`user/${transaction.sellerId}`}>
                                User #{transaction.sellerId}
                            </Link>
                        ) : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Shipping Address">
                        {transaction.buyerAddress || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Postal Code">
                        {transaction.buyerPostCode || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Country">
                        {transaction.buyerCountry || '-'}
                    </Descriptions.Item>
                    {transaction.description && (
                        <Descriptions.Item label="Product Description">
                            {transaction.description}
                        </Descriptions.Item>
                    )}
                    {transaction.category && (
                        <Descriptions.Item label="Category">
                            {transaction.category}
                        </Descriptions.Item>
                    )}
                    {transaction.date && (
                        <Descriptions.Item label="Product Creation Date">
                            {timestampToString(transaction.date)}
                        </Descriptions.Item>
                    )}
                    <Descriptions.Item label="Payment Method">
                        {transaction.buyerPaymentId ? (
                            <Text>Card #{transaction.buyerPaymentId}</Text>
                        ) : (
                            <Text type="secondary">Not specified</Text>
                        )}
                    </Descriptions.Item>
                    {transaction.price && (
                        <Descriptions.Item label="Original Product Price">
                            <Text>€{transaction.price}</Text>
                        </Descriptions.Item>
                    )}
                </Descriptions>
            </Card>
        </div>
    )
}

export default DetailsTransactionComponent;

