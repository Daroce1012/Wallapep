import {useState, useEffect } from "react";
import { Table, Space, Tag, Typography } from 'antd';
import Link from "next/link";
import { timestampToString } from "../../../utils/UtilsDates";
import { categoryLabels } from "../../../utils/UtilsCategories";

const { Text } = Typography;

let ListMyTransactionsComponent = () => {
    let [transactions, setTransactions] = useState([])

    useEffect(() => {
        getMyTransactions();
    }, [])

    let getMyTransactions = async () => {
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
            jsonData.map( transaction => {
                transaction.key = transaction.tid || transaction.id
                return transaction
            })
            setTransactions(jsonData)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach( e => {
                console.log("Error: "+e.msg)
            })
        }
    }

    let getUserIdFromApiKey = () => {
        let apiKey = localStorage.getItem("apiKey");
        if (!apiKey) return null;
        
        try {
            let payload = apiKey.split('.')[1];
            let decoded = JSON.parse(atob(payload));
            return decoded.id;
        } catch (error) {
            return null;
        }
    }

    let columns = [
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
            title: "Category",
            dataIndex: "category",
            key: "category",
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
            render: (price) => price ? `€${price}` : '-'
        },
        {
            title: "Role",
            key: "role",
            render: (_, record) => {
                let userId = getUserIdFromApiKey();
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
                let userId = getUserIdFromApiKey();
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
                let userId = getUserIdFromApiKey();
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
                    <Link href={`/detailTransaction/${record.tid || record.id}`}>
                        View Details
                    </Link>
                </Space>
            )
        },
    ]

    return (
        <div>
            <Typography.Title level={2}>My Transactions</Typography.Title>
            {transactions.length === 0 ? (
                <Text type="secondary">You have no registered transactions.</Text>
            ) : (
                <Table 
                    columns={columns} 
                    dataSource={transactions}
                    pagination={{ pageSize: 10 }}
                />
            )}
        </div>
    )
}

export default ListMyTransactionsComponent;

