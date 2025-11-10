import {useState, useEffect } from "react";
import { Spin, Row, Col } from 'antd';
import Link from "next/link";
import { apiGet } from '../../../utils/UtilsApi';
import ProductCard from '../common/ProductCard'; // Importar ProductCard
import styles from '../../../styles/UserProducts.module.css';

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
                setProducts(jsonData);
            }
        } catch (error) {
            console.error("Error loading products:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <Spin size="large" style={{ display: 'block', margin: 'auto' }} />
    }

    if (products.length === 0) {
        return <p>No products for sale</p>
    }

    return (
        <Row gutter={[16, 16]}>
            {products.map(product => (
                <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                    <ProductCard product={product} variant="detailed" showDescription={true} />
                </Col>
            ))}
        </Row>
    )
}

export default UserProductsComponent;

