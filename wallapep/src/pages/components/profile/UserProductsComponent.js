import {useState, useEffect } from "react";
import { Spin, Row, Col, Button } from 'antd';
import Link from "next/link";
import { apiGet, fetchProducts } from '../../../utils/UtilsApi';
import ProductCard from '../common/ProductCard'; // Importar ProductCard
import styles from '../../../styles/UserProducts.module.css';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

let UserProductsComponent = ({userId}) => {
    let [products, setProducts] = useState([])
    let [loading, setLoading] = useState(true)
    let [productLoadError, setProductLoadError] = useState(null);

    useEffect(() => {
        if (userId) {
            loadProducts();
        }
    }, [userId])

    let loadProducts = async () => {
        setLoading(true);
        setProductLoadError(null); // Resetear error al cargar
        try {
            let jsonData = await fetchProducts(userId);
            if (jsonData) {
                setProducts(jsonData);
            } else {
                setProductLoadError("Failed to retrieve products for this user.");
            }
        } catch (error) {
            console.error("Error loading products:", error);
            setProductLoadError("Failed to load user products. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <LoadingSpinner tip="Loading user products..." />
    }

    if (productLoadError) {
        return (
            <EmptyState
                description={productLoadError}
                title="Error loading products"
                action={(
                    <Button 
                        size="small" 
                        danger 
                        onClick={loadProducts}
                    >
                        Retry
                    </Button>
                )}
            />
        );
    }

    if (products.length === 0) {
        return <EmptyState description="No products for sale" />
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

