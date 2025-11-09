import {useState, useEffect } from "react";
import { Table, Tag, Typography, Spin, Input, Button, Space } from 'antd';
import Link from "next/link";
import { apiGet, apiPut } from '../../../utils/UtilsApi';
import styles from '../../../styles/UserProducts.module.css';

const { Text } = Typography;

let UserProductsComponent = ({userId}) => {
    let [products, setProducts] = useState([])
    let [loading, setLoading] = useState(true)

    useEffect(() => {
        if (userId) {
            loadProducts();
        }
    }, [userId])

    let loadProducts = async () => {
        setLoading(true);
        try {
            let jsonData = await apiGet("/products", {
                params: { sellerId: userId }
            });
            if (jsonData) {
                jsonData.forEach(product => {
                    product.key = product.id;
                });
                setProducts(jsonData);
            }
        } catch (error) {
            console.error("Error loading products:", error);
        } finally {
            setLoading(false);
        }
    }

    let productColumns = [
        {
            title: "Title",
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
                        placeholder="Search title"
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
                <Link href={`detailProduct/${record.id}`}>
                    {title || `Product #${record.id}`}
                </Link>
            )
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (description) => description ? (description.length > 50 ? description.substring(0, 50) + '...' : description) : '-'
        },
        {
            title: "Price (€)",
            dataIndex: "price",
            key: "price",
            sorter: (a, b) => (a.price || 0) - (b.price || 0),
            align: 'right',
            render: (price) => price ? (
                <Text strong className={styles.priceText}>
                    € {price}
                </Text>
            ) : '-'
        },
        {
            title: "Status",
            key: "status",
            filters: [
                { text: 'Available', value: 'available' },
                { text: 'Sold', value: 'sold' },
            ],
            onFilter: (value, record) => {
                if (value === 'available') return !record.buyerId;
                if (value === 'sold') return !!record.buyerId;
                return true;
            },
            render: (_, record) => {
                if (record.buyerId) {
                    return <Tag color="red">Sold</Tag>
                } else {
                    return <Tag color="green">Available</Tag>
                }
            }
        },
    ]

    if (loading) {
        return <Spin />
    }

    if (products.length === 0) {
        return <Text type="secondary">No products for sale</Text>
    }

    return (
        <Table 
            columns={productColumns} 
            dataSource={products}
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
        />
    )
}

export default UserProductsComponent;

