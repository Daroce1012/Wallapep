import { useState } from "react";
import { Card, Input, Button, Row, Col, Form, Typography, DatePicker, Select, Space, message } from "antd";
import { countries } from "../../../utils/UtilsCountries";
import dayjs from "dayjs";
import { apiPost } from '../../../utils/UtilsApi';
import styles from '../../../styles/CreateUser.module.css';

let CreateUserComponent = ({ openNotification }) => {
    const [form] = Form.useForm();

    let onFinish = async (values) => {
        // Convertir dayjs objects a timestamps para la fecha de cumpleaños
        const userData = { ...values };
        if (userData.birthday) {
            userData.birthday = Math.floor(userData.birthday.valueOf() / 1000); // Convertir a segundos
        }

        let result = await apiPost("/users", userData, {
            includeApiKey: false, // No requiere API key para crear usuario
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

        if (result) {
            if (openNotification) {
                openNotification("top", "User created successfully", "success");
            }
            form.resetFields(); // Limpiar el formulario
        }
    };

    const countryOptions = countries.map(country => ({
        value: country.name,
        label: (
            <Space>
                <img
                    src={country.flagImage}
                    alt={country.name}
                    className={styles.flagImage}
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
                <span>{country.name}</span>
            </Space>
        ),
        // También puedes añadir un searchLabel si quieres buscar por código o nombre
        // searchLabel: `${country.name} ${country.code}`
    }));

   return (
        <Row align="middle" justify="center" className={styles.container}>
          <Col xs={24} sm={24} md={12} lg={12} xl={10}>
            <Card title="Create User" className={styles.card}>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    email: '',
                    password: '',
                    name: '',
                    surname: '',
                    documentIdentity: '',
                    documentNumber: '',
                    country: '',
                    address: '',
                    postalCode: '',
                    birthday: null
                }}
              >
                <Form.Item label="Email" name="email"
                    rules={[
                        { required: true, message: "Please enter your email!" },
                        { type: 'email', message: "Please enter a valid email!" }
                    ]}>
                    <Input placeholder="Enter your email" />
                </Form.Item>
      
                <Form.Item label="Password" name="password"
                    rules={[{ required: true, message: "Please enter your password!" }]}>
                    <Input.Password placeholder="Enter your password" />
                </Form.Item>
      
                <Form.Item label="Name" name="name">
                    <Input placeholder="Enter your name" />
                </Form.Item>
      
                <Form.Item label="Surname" name="surname">
                    <Input placeholder="Enter your surname" />
                </Form.Item>
      
                <Form.Item label="Document Type" name="documentIdentity">
                    <Input placeholder="Enter your document type" />
                </Form.Item>
      
                <Form.Item label="Document Number" name="documentNumber">
                    <Input placeholder="Enter your document number" />
                </Form.Item>
      
                <Form.Item label="Country" name="country">
                    <Select
                        showSearch
                        placeholder="Select your country"
                        optionFilterProp="label"
                        filterOption={(input, option) => {
                            return option.label.toLowerCase().includes(input.toLowerCase());
                        }}
                        allowClear
                        options={countryOptions}
                    />
                </Form.Item>
      
                <Form.Item label="Address" name="address">
                    <Input placeholder="Enter your address" />
                </Form.Item>
      
                <Form.Item label="Postal Code" name="postalCode">
                    <Input placeholder="Enter your postal code" />
                </Form.Item>
      
                <Form.Item label="Birthday" name="birthday">
                    <DatePicker
                        placeholder="Select your birthday"
                        format="DD/MM/YYYY"
                        disabledDate={(current) => {
                            return current && current > dayjs().endOf('day');
                        }}
                    />
                    <Typography.Text type="secondary" className={styles.helperText}>
                        Example: 01/01/1990 (DD/MM/YYYY)
                    </Typography.Text>
                </Form.Item>
      
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Create User
                    </Button>
                </Form.Item>
      
            </Form>
          </Col>
        </Row>
      );
}

export default CreateUserComponent;
