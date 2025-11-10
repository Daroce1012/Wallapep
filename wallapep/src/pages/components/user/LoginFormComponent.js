import { useState } from "react";
import { useRouter } from "next/router";
import {Card, Col, Row, Form, Input, Button , Typography, message } from "antd";
import { apiPost } from '../../../utils/UtilsApi';
import styles from '../../../styles/LoginForm.module.css';

let LoginFormComponent = ({setLogin, openNotification}) => {
    const [form] = Form.useForm();
    let router = useRouter();

    let onFinish = async (values) => {
        let responseBody = await apiPost("/users/login", values, {
            includeApiKey: false, // No requiere API key para login
            onError: (serverErrors) => {
                serverErrors.forEach(error => {
                    if (error.path) {
                        form.setFields([{
                            name: error.path,
                            errors: [error.msg]
                        }]);
                    } else {
                        // Para errores no relacionados con un campo específico
                        if (openNotification) {
                            openNotification("top", error.msg, "error");
                        }
                    }
                });
            }
        });

        if (responseBody) {
            if (responseBody.apiKey && responseBody.email) {
                localStorage.setItem("apiKey", responseBody.apiKey);
                localStorage.setItem("email", responseBody.email);
            }
            setLogin(true);
            openNotification("top", "Login successfull", "success");
            router.push("/products");
        }
    };

    return (
        <Row align="middle" justify="center" className={styles.container}>
            <Col xs={0} sm={0} md={12} lg={8} xl={6}><img src="/iniciar-sesion.png" width="100%" alt="Iniciar Sesión" /></Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={10} >
                <Card title="Login" className={styles.card}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            email: '',
                            password: '',
                        }}
                    >
                        <Form.Item label="Email" name="email"
                            rules={[
                                { required: true, message: "Please enter your email!" },
                                { type: 'email', message: "Please enter a valid email!" }
                            ]}
                        >
                            <Input placeholder="your email" />
                        </Form.Item>

                        <Form.Item label="Password" name="password"
                            rules={[{ required: true, message: "Please enter your password!" }]}>
                            <Input.Password placeholder="your password" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>Login</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>

        </Row>

    )
}

export default LoginFormComponent;
