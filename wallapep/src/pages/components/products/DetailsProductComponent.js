import {useState, useEffect } from "react";
import Link from 'next/link';
import { Typography, Card, Descriptions, Image, Button, Tag, Avatar, Space } from 'antd';
import { ShoppingOutlined, StopOutlined, UserOutlined, StarOutlined } from '@ant-design/icons';
import { joinAllServerErrorMessages } from '../../../utils/UtilsValidations';
import { getUserIdFromApiKey } from '../../../utils/UtilsUser';
import { apiGet, apiPost } from '../../../utils/UtilsApi';
import { processProductImage } from '../../../utils/UtilsProducts';
import styles from '../../../styles/DetailsProduct.module.css';

let DetailsProductComponent  = ({id, openNotification}) => {
    let [product, setProduct] = useState({})
    let [canBuy, setCanBuy] = useState(true)
    let [buyMessage, setBuyMessage] = useState("")
    let [sellerName, setSellerName] = useState(null)
    let [sellerReputation, setSellerReputation] = useState(null)

    useEffect(() => {
        getProduct(id);
    }, [])

    let checkIfCanBuy = () => {
        let userId = getUserIdFromApiKey();
        
        if (!userId) {
            setCanBuy(false);
            setBuyMessage("You must be logged in to buy");
            return;
        }

        if (product.buyerId != null) {
            setCanBuy(false);
            setBuyMessage("This product has already been sold");
            return;
        }

        if (product.sellerId == userId) {
            setCanBuy(false);
            setBuyMessage("You cannot buy your own product");
            return;
        }

        setCanBuy(true);
        setBuyMessage("");
    }

    let buyProduct = async () => {
        let result = await apiPost("/transactions", {
            productId: id,
            buyerPaymentId: null
        }, {
            onError: (serverErrors) => {
                let notificationMsg = joinAllServerErrorMessages(serverErrors);
                if (openNotification) {
                    openNotification("top", notificationMsg, "error");
                }
            }
        });

        if (result) {
            if (openNotification) {
                openNotification("top", "Transaction registered successfully", "success");
            }
            getProduct(id);
        }
    }


    let loadSellerInfo = async (sellerId) => {
        if (!sellerId) return;
        
        let userData = await apiGet(`/users/${sellerId}`);
        if (userData) {
            setSellerName(userData.name || null);
        }
    }

    let loadSellerReputation = async (sellerId) => {
        if (!sellerId) return;
        
        try {
            let [sales, purchases] = await Promise.all([
                apiGet("/transactions/public", { params: { sellerId } }),
                apiGet("/transactions/public", { params: { buyerId: sellerId } })
            ]);

            sales = sales || [];
            purchases = purchases || [];

            // Remove duplicates
            let allTransactions = [...sales, ...purchases];
            let uniqueTransactions = allTransactions.filter((transaction, index, self) =>
                index === self.findIndex(t => t.id === transaction.id)
            );

            setSellerReputation({
                totalTransactions: uniqueTransactions.length,
                sales: sales.length,
                purchases: purchases.length
            });
        } catch (error) {
            console.error("Error loading seller reputation:", error);
        }
    }

    let getProduct = async (id) => {
        let jsonData = await apiGet(`/products/${id}`);
        
        if (jsonData) {
            let productWithImage = await processProductImage(jsonData);
            setProduct(productWithImage);
            checkIfCanBuy();
            if (productWithImage.sellerId) {
                loadSellerInfo(productWithImage.sellerId);
                loadSellerReputation(productWithImage.sellerId);
            }
        }
    }

    useEffect(() => {
        if (product.id) {
            checkIfCanBuy();
        }
    }, [product])

    const { Text } = Typography;

    return (
    <Card>
        {product.image && <Image src={product.image} alt={product.title} className={styles.productImage} />}
        <Descriptions title={ product.title } column={1}>
            <Descriptions.Item label="Id">
                { product.id }
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={3}>
                <Text className={styles.description}>
                    { product.description || '-' }
                </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Seller">
                {product.sellerId ? (
                    <Space>
                        <Avatar size="small" icon={<UserOutlined />} />
                        <Link href={`user/${product.sellerId}`}>
                            {sellerName || `User #${product.sellerId}`}
                        </Link>
                    </Space>
                ) : '-'}
            </Descriptions.Item>
            {sellerReputation && (
                <Descriptions.Item label="Seller Reputation">
                    <Space>
                        <Tag color="gold" icon={<StarOutlined />}>
                            {sellerReputation.totalTransactions} transactions
                        </Tag>
                        <Tag color="green">
                            {sellerReputation.sales} sales
                        </Tag>
                        <Tag color="blue">
                            {sellerReputation.purchases} purchases
                        </Tag>
                    </Space>
                </Descriptions.Item>
            )}
            <Descriptions.Item >
                <Text strong underline className={styles.price}>€ { product.price }</Text>
            </Descriptions.Item>
            {!canBuy && buyMessage && (
                <Descriptions.Item>
                    <Tag color="orange" icon={<StopOutlined />}>
                        {buyMessage}
                    </Tag>
                </Descriptions.Item>
            )}
            <Descriptions.Item>
                <Button 
                    type="primary" 
                    onClick={buyProduct}
                    icon={<ShoppingOutlined/>} 
                    size="large"
                    disabled={!canBuy}
                >
                    {canBuy ? "Buy" : "Not available"}
                </Button>
            </Descriptions.Item>

        </Descriptions>
    </Card>

    )
}

export default DetailsProductComponent;
