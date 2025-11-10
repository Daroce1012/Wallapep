import {useState, useEffect } from "react";
import { Card, Input, Button, Row, Col, Form, Typography, DatePicker, message, Spin, InputNumber } from "antd";
import dayjs from "dayjs"; // Importar dayjs
import { apiGet, apiPut } from '../../../utils/UtilsApi';
import styles from '../../../styles/EditProductForm.module.css';

let EditProductFormComponent = ({id, openNotification}) => {
    const [form] = Form.useForm();
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        getProduct(id);
    }, [id]);

    let getProduct = async (id) => {
        setLoading(true);
        let jsonData = await apiGet(`/products/${id}`);
        if (jsonData) {
            // Convertir timestamp a objeto dayjs para DatePicker
            if (jsonData.date) {
                jsonData.date = dayjs.unix(jsonData.date); // Convertir segundos a dayjs
            }
            form.setFieldsValue(jsonData); // Inicializar el formulario con los datos del producto
        }
        setLoading(false);
    }

    let clickEditProduct = async (values) => {
        // Convertir el objeto dayjs de DatePicker de nuevo a timestamp (segundos)
        const productData = { ...values };
        if (productData.date) {
            productData.date = productData.date.unix(); // Convertir dayjs a timestamp (segundos)
        }

        let result = await apiPut(`/products/${id}`, productData, {
            onError: (serverErrors) => {
                let notificationMsg = serverErrors.map(e => e.msg).join(", ");
                if (openNotification) {
                    openNotification("top", notificationMsg, "error");
                }
            }
        });

        if (result) {
            if (openNotification) {
                openNotification("top", "Product updated successfully", "success");
            }
        }
    }

    if (loading) {
        return (
            <Row align="middle" justify="center" className={styles.container}>
                <Col><Spin size="large" /></Col>
            </Row>
        );
    }

    return (
        <Row align="middle" justify="center" className={styles.container}>
            <Col>
                <Card title="Edit product" className={styles.card}>
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
                            />
                        </Form.Item>

                        <Form.Item label="Date" name="date">
                            <DatePicker 
                                format="YYYY-MM-DD HH:mm:ss"
                                showTime
                            />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" block>
                            Edit Product
                        </Button> 
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}

export default EditProductFormComponent;
