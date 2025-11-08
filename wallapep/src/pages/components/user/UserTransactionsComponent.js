import {useState, useEffect } from "react";
import { Table, Tag, Typography, Spin } from 'antd';
import Link from "next/link";

const { Text } = Typography;

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
            let sellerResponse = await fetch(
                process.env.NEXT_PUBLIC_BACKEND_BASE_URL+"/transactions/public?sellerId="+userId,
                {
                    method: "GET",
                    headers: {
                        "apikey": localStorage.getItem("apiKey") || ""
                    },
                });

            let buyerResponse = await fetch(
                process.env.NEXT_PUBLIC_BACKEND_BASE_URL+"/transactions/public?buyerId="+userId,
                {
                    method: "GET",
                    headers: {
                        "apikey": localStorage.getItem("apiKey") || ""
                    },
                });

            let allTransactions = [];

            if (sellerResponse.ok) {
                let sellerData = await sellerResponse.json();
                allTransactions = [...allTransactions, ...sellerData];
            }

            if (buyerResponse.ok) {
                let buyerData = await buyerResponse.json();
                allTransactions = [...allTransactions, ...buyerData];
            }

            // Remove duplicates based on transaction id
            let uniqueTransactions = allTransactions.filter((transaction, index, self) =>
                index === self.findIndex(t => t.id === transaction.id)
            );

            uniqueTransactions.forEach(transaction => {
                transaction.key = transaction.id;
            });

            setTransactions(uniqueTransactions);
        } catch (error) {
            console.error("Error loading transactions:", error);
        } finally {
            setLoading(false);
        }
    }

    let transactionColumns = [
        {
            title: "Product",
            dataIndex: "title",
            key: "title",
            render: (title, record) => (
                <Link href={`detailProduct/${record.productId}`}>
                    {title || `Product #${record.productId}`}
                </Link>
            )
        },
        {
            title: "Role",
            key: "role",
            render: (_, record) => {
                if (record.sellerId == userId) {
                    return <Tag color="green">Seller</Tag>
                } else if (record.buyerId == userId) {
                    return <Tag color="blue">Buyer</Tag>
                }
                return '-'
            }
        },
        {
            title: "Price (€)",
            key: "price",
            render: (_, record) => {
                return record.productPrice ? `€${record.productPrice}` : '-'
            }
        },
    ]

    if (loading) {
        return <Spin />
    }

    if (transactions.length === 0) {
        return <Text type="secondary">No transactions found</Text>
    }

    return (
        <Table 
            columns={transactionColumns} 
            dataSource={transactions}
            pagination={{ pageSize: 10 }}
        />
    )
}

export default UserTransactionsComponent;

