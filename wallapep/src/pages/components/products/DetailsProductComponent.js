import {useState, useEffect } from "react";
import Link from 'next/link';
import { Typography, Card, Descriptions, Image, Button, Tag } from 'antd';
import { ShoppingOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { joinAllServerErrorMessages } from '../../../utils/UtilsValidations';

let DetailsProductComponent  = ({id, openNotification}) => {
    let [product, setProduct] = useState({})
    let [canBuy, setCanBuy] = useState(true)
    let [buyMessage, setBuyMessage] = useState("")

    useEffect(() => {
        getProduct(id);
    }, [])

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
        let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL+"/transactions",
            {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                    "apikey": localStorage.getItem("apiKey")
                },
                body: JSON.stringify({
                    productId: id,
                    buyerPaymentId: null
                })
            });

        if ( response.ok ){
            let jsonData = await response.json();
            if (openNotification) {
                openNotification("top", "Transaction registered successfully", "success");
            }
            getProduct(id);
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            let notificationMsg = joinAllServerErrorMessages(serverErrors);
            if (openNotification) {
                openNotification("top", notificationMsg, "error");
            }
        }
    }


    let getProduct = async (id) => {
         let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL+"/products/"+id,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if ( response.ok ){
            let jsonData = await response.json();
            setProduct(jsonData);
            checkIfCanBuy();
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach( e => {
                console.log("Error: "+e.msg)
            })
        }
    }

    useEffect(() => {
        if (product.id) {
            checkIfCanBuy();
        }
    }, [product])

    const { Text } = Typography;
    let labelProductPrice = "No-Offer"
    if ( product.price < 10000){
        labelProductPrice="Offer"
    }


    return (
    <Card>
        <Image src="/item1.png" />
        <Descriptions title={ product.title }>
            <Descriptions.Item label="Id">
                { product.id }
            </Descriptions.Item>
            <Descriptions.Item label="Description">
                { product.description }
            </Descriptions.Item>
            <Descriptions.Item label="Seller">
                {product.sellerId ? (
                    <Link href={`user/${product.sellerId}`}>
                        View Seller Profile
                    </Link>
                ) : '-'}
            </Descriptions.Item>
            <Descriptions.Item >
                <Text strong underline style={{ fontSize:20 }}>€{ product.price }</Text>
                { labelProductPrice }
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
