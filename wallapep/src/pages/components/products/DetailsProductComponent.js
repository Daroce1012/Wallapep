import { useState, useEffect, useCallback } from "react";
import Link from 'next/link';
import { Typography, Card, Image, Button, Tag, Avatar, Space, Divider, Row, Col } from 'antd';
import { ShoppingOutlined, StopOutlined, UserOutlined, StarOutlined } from '@ant-design/icons';
import { getUserIdFromApiKey } from '../../../utils/UtilsUser';
import { apiGet, apiPost } from '../../../utils/UtilsApi';
import { processProductImage } from '../../../utils/UtilsProducts';
import styles from '../../../styles/DetailsProduct.module.css';
import ReputationTags from '../common/ReputationTags';
import buttonStyles from '../../../styles/buttons.module.css';

const { Title, Text, Paragraph } = Typography;

const BUY_MESSAGES = {
    NOT_LOGGED_IN: "You must be logged in to buy",
    ALREADY_SOLD: "This product has already been sold",
    OWN_PRODUCT: "You cannot buy your own product"
};

const DetailsProductComponent = ({ id, openNotification }) => {
    const [product, setProduct] = useState({});
    const [purchaseState, setPurchaseState] = useState({ canBuy: true, message: "" });
    const [seller, setSeller] = useState({ name: null, reputation: null });
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Validar si el usuario puede comprar
    const validatePurchase = useCallback((userId, productData) => {
        if (!userId) {
            return { canBuy: false, message: BUY_MESSAGES.NOT_LOGGED_IN };
        }

        if (productData.buyerId != null) {
            return { canBuy: false, message: BUY_MESSAGES.ALREADY_SOLD };
        }

        if (productData.sellerId === userId) {
            return { canBuy: false, message: BUY_MESSAGES.OWN_PRODUCT };
        }

        return { canBuy: true, message: "" };
    }, []);

    // Cargar información del vendedor
    const loadSellerData = useCallback(async (sellerId) => {
        if (!sellerId) return;

        try {
            const [userData, sales, purchases] = await Promise.all([
                apiGet(`/users/${sellerId}`),
                apiGet("/transactions/public", { params: { sellerId } }),
                apiGet("/transactions/public", { params: { buyerId: sellerId } })
            ]);

            const allTransactions = [...(sales || []), ...(purchases || [])];
            const uniqueTransactions = allTransactions.filter((transaction, index, self) =>
                index === self.findIndex(t => t.id === transaction.id)
            );

            setSeller({
                name: userData?.name || null,
                reputation: {
                    totalTransactions: uniqueTransactions.length,
                    sales: (sales || []).length,
                    purchases: (purchases || []).length
                }
            });
        } catch (error) {
            console.error("Error loading seller data:", error);
        }
    }, []);

    // Cargar producto
    const loadProduct = useCallback(async () => {
        try {
            setIsLoading(true);
            const jsonData = await apiGet(`/products/${id}`);
            
            if (jsonData) {
                const productWithImage = await processProductImage(jsonData);
                setProduct(productWithImage);
                
                if (productWithImage.sellerId) {
                    loadSellerData(productWithImage.sellerId);
                }
            }
        } catch (error) {
            console.error("Error loading product:", error);
        } finally {
            setIsLoading(false);
        }
    }, [id, loadSellerData]);

    // Procesar compra
    const handlePurchase = async () => {
        const result = await apiPost("/transactions", {
            productId: id,
            buyerPaymentId: null,
            startDate: Date.now()
        }, {
            onError: (serverErrors) => {
                const notificationMsg = serverErrors.map(e => e.msg).join(", ");
                openNotification?.("top", notificationMsg, "error");
            }
        });

        if (result) {
            openNotification?.("top", "Transaction registered successfully", "success");
            loadProduct();
        }
    };

    // Inicializar
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUserId(getUserIdFromApiKey());
            loadProduct();
        }
    }, [loadProduct]);

    // Actualizar estado de compra cuando cambie el producto o usuario
    useEffect(() => {
        if (product.id && currentUserId !== null) {
            const newState = validatePurchase(currentUserId, product);
            setPurchaseState(newState);
        }
    }, [product, currentUserId, validatePurchase]);

    if (isLoading) {
        return <Card loading />;
    }

    return (
        <div className={styles.container}>
            <Card className={styles.productCard}>
                <Row gutter={[24, 24]}>
                {/* Imagen del producto */}
                <Col xs={24} md={12}>
                    <div className={styles.imageContainer}>
                        {product.image && (
                            <Image 
                                src={product.image} 
                                alt={product.title}
                                className={styles.productImage}
                            />
                        )}
                    </div>
                </Col>

                {/* Detalles del producto */}
                <Col xs={24} md={12}>
                    <div className={styles.detailsContainer}>
                        <h1 className={styles.productTitle}>{product.title}</h1>
                        
                        {product.description && (
                            <div className={styles.section}>
                                <p className={styles.description}>
                                    {product.description}
                                </p>
                            </div>
                        )}

                        <div className={styles.productPrice}>€{product.price}</div>

                        {product.sellerId && (
                            <div className={styles.sellerSection}>
                                <div className={styles.sectionLabel}>Seller</div>
                                <div className={styles.sellerInfo}>
                                    <Avatar size={40} icon={<UserOutlined />} />
                                    <Link href={`/user/${product.sellerId}`} className={styles.sellerLink}>
                                        {seller.name || `User #${product.sellerId}`}
                                    </Link>
                                </div>
                                {seller.reputation && (
                                    <ReputationTags reputation={seller.reputation} />
                                )}
                            </div>
                        )}

                        <Divider className={styles.divider} />

                        {!purchaseState.canBuy && purchaseState.message && (
                            <Tag color="orange" icon={<StopOutlined />} className={styles.warningTag}>
                                {purchaseState.message}
                            </Tag>
                        )}

                        <Button 
                            type="primary" 
                            onClick={handlePurchase}
                            icon={<ShoppingOutlined />} 
                            size="large"
                            disabled={!purchaseState.canBuy}
                            block
                            className={`${styles.buyButton} ${buttonStyles.primaryButton}`}
                        >
                            {purchaseState.canBuy ? "Buy Now" : "Not Available"}
                        </Button>
                    </div>
                </Col>
                </Row>
            </Card>
        </div>
    );
};

export default DetailsProductComponent;
