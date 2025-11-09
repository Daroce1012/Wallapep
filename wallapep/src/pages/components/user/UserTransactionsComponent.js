import {useState, useEffect } from "react";
import { Table, Tag, Typography, Spin, Input, Button, Space } from 'antd';
import Link from "next/link";
import { apiGet } from '../../../utils/UtilsApi';
import styles from '../../../styles/UserTransactions.module.css';

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
            dataIndex: "productPrice",
            sorter: (a, b) => (a.productPrice || 0) - (b.productPrice || 0),
            render: (price) => {
                return price ? (
                    <Text strong className={styles.priceText}>
                        € {price}
                    </Text>
                ) : '-'
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
            scroll={{ x: true }}
        />
    )
}

export default UserTransactionsComponent;

