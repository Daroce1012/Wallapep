import {useState, useEffect } from "react";
import { Table, Tag, Typography, Spin } from 'antd';
import Link from "next/link";

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
            let response = await fetch(
                process.env.NEXT_PUBLIC_BACKEND_BASE_URL+"/products?sellerId="+userId,
                {
                    method: "GET",
                    headers: {
                        "apikey": localStorage.getItem("apiKey") || ""
                    },
                });

            if ( response.ok ){
                let jsonData = await response.json();
                jsonData.forEach(product => {
                    product.key = product.id;
                });
                setProducts(jsonData);
            } else {
                let responseBody = await response.json();
                let serverErrors = responseBody.errors;
                serverErrors.forEach( e => {
                    console.log("Error: "+e.msg)
                })
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
            render: (price) => price ? `€${price}` : '-'
        },
        {
            title: "Status",
            key: "status",
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
        />
    )
}

export default UserProductsComponent;

