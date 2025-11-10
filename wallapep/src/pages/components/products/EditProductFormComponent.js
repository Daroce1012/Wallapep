import {useState, useEffect } from "react";
import { Card, Input, Button, Row, Col, Form, Typography, DatePicker, message, Spin, InputNumber } from "antd";
import dayjs from "dayjs"; // Importar dayjs
import { apiGet, apiPut } from '../../../utils/UtilsApi';
import styles from '../../../styles/EditProductForm.module.css';
import CardHeader from '../common/CardHeader';
import buttonStyles from '../../../styles/buttons.module.css';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

let EditProductFormComponent = ({id, openNotification}) => {
    const [form] = Form.useForm();
    let [loading, setLoading] = useState(true);
    let [productError, setProductError] = useState(null);

    useEffect(() => {
        getProduct(id);
    }, [id]);

    let getProduct = async (id) => {
        setLoading(true);
        setProductError(null);
        try {
            let jsonData = await apiGet(`/products/${id}`);
            if (jsonData) {
                if (jsonData.date) {
                    jsonData.date = dayjs(jsonData.date); 
                }
                form.setFieldsValue(jsonData); 
            } else {
                setProductError("Product not found or failed to load.");
            }
        } catch (error) {
            console.error("Error loading product for editing:", error);
            setProductError("Failed to load product details. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    let clickEditProduct = async (values) => {
        const productData = { ...values };
        if (productData.date) {
            productData.date = productData.date.unix(); 
        }

        let result = await apiPut(`/products/${id}`, productData, {
            onError: (serverErrors) => {
                serverErrors.forEach(error => {
                  if (error.path) {
                    form.setFields([{
                      name: error.path,
                      errors: [error.msg]
                    }]);
                  } else {
                     if (openNotification) {
                        openNotification("top", error.msg, "error");
                      }
                  }
                });
            }
        });

        if (result) {
            if (openNotification) {
                openNotification("top", "Product updated successfully", "success");
            }
        }
    }

    if (loading) {
        return <LoadingSpinner tip="Loading product details..." />;
    }

    if (productError) {
        return (
            <EmptyState
                description={productError}
                title="Error loading product"
                action={
                    <Button 
                        size="small" 
                        danger 
                        onClick={() => getProduct(id)}
                    >
                        Retry
                    </Button>
                }
            />
        );
    }

    return (
        <Row align="middle" justify="center" className={styles.container}>
            <Col>
                <Card 
                    title={<CardHeader title="Edit product" />} 
                    className={styles.card}>
                    <Form 
                        form={form}
                        layout="vertical"
                        onFinish={clickEditProduct}
                        // onValuesChange={(changedValues, allValues) => setFormData(allValues)} // Ya no es necesario con form.setFieldsValue
                    >
                        <Form.Item label="Title" name="title"
                            rules={[{ required: true, message: "The product title is required" }]}>
                            <Input size="large" type="text" placeholder="product title" />
                        </Form.Item>

                        <Form.Item label="Description" name="description">
                            <Input.TextArea size="large" placeholder="description" />
                        </Form.Item>

                        {/* Price and Date */}
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Price" name="price"
                                    rules={[
                                        { required: true, message: "Price is required" },
                                        { type: 'number', min: 0.01, message: "Price must be a positive number" },
                                    ]}>
                                    <InputNumber
                                        min={0.01}
                                        className={styles.priceInput}
                                        size="large"
                                        placeholder="price"
                                        formatter={value => value ? `€ ${value}` : ''}
                                        parser={value => value.replace('€ ', '')}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Date" name="date">
                                    <DatePicker 
                                        format="YYYY-MM-DD"
                                        style={{ width: '100%' }}
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Button type="primary" htmlType="submit" block className={buttonStyles.primaryButton}>
                            Edit Product
                        </Button> 
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}

export default EditProductFormComponent;
