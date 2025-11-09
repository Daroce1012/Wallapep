import { useState, useRef } from "react";
import { useRouter } from "next/router";
import {modifyStateProperty} from "../../../utils/UtilsState";
import {Card, Col, Row, Form, Input, Button , Typography } from "antd";
import {validateFormDataInputRequired,validateFormDataInputEmail,allowSubmitForm,setServerErrors,joinAllServerErrorMessages} from "../../../utils/UtilsValidations"
import { apiPost } from '../../../utils/UtilsApi';
import styles from '../../../styles/LoginForm.module.css';

let LoginFormComponent = ({setLogin, openNotification}) => {
    let router = useRouter()

    // validación
    let requiredInForm = ["email","password"]
    let [formErrors, setFormErrors] = useState({})
 
    let [formData,setFormData] = useState({

    })

    let clickLogin = async () => {
        let responseBody = await apiPost("/users/login", formData, {
            includeApiKey: false, // No requiere API key para login
            onError: (serverErrors) => {
                setServerErrors(serverErrors, setFormErrors)
                let notificationMsg = joinAllServerErrorMessages(serverErrors)
                openNotification("top", notificationMsg, "error")
            }
        });

        if (responseBody) {
            if (responseBody.apiKey && responseBody.email) {
                localStorage.setItem("apiKey", responseBody.apiKey)
                localStorage.setItem("email", responseBody.email)
            }
            setLogin(true)
            openNotification("top", "Login successfull", "success")
            router.push("/products");
        }
    }

    return (
        <Row align="middle" justify="center" className={styles.container}>
            <Col xs={0} sm={0} md={12} lg={8} xl={6}  ><img src="/iniciar-sesion.png" width="100%"/></Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={10} >
                <Card title="Login" className={styles.card}>

            {formErrors?.email?.msg &&
                    <Typography.Text type="danger"> {formErrors?.email?.msg} </Typography.Text>}
            <Form.Item label=""  key="email-input" name="email" validateStatus={
                validateFormDataInputEmail(
                    formData, "email", formErrors, setFormErrors) ? "success" : "error"}>
                <Input placeholder="your email"
                    value={formData.email}
                    onChange={(i) => {
                    modifyStateProperty(formData, setFormData,
                        "email", i.currentTarget.value)
                }}/>
            </Form.Item>

            {formErrors?.password?.msg &&
                <Typography.Text type="danger"> {formErrors?.password?.msg} </Typography.Text>}
            <Form.Item label="" name="password" validateStatus={
                validateFormDataInputRequired(
                    formData, "password", formErrors, setFormErrors) ? "success" : "error"}>
                <Input.Password
                    placeholder="your password"
                    onChange={(i) => {
                    modifyStateProperty(formData, setFormData,
                        "password", i.currentTarget.value)
                }}/>
            </Form.Item>


            <Form.Item>
                { allowSubmitForm(formData,formErrors,requiredInForm) ?
                    <Button type="primary" onClick={clickLogin} block >Login</Button> :
                    <Button type="primary" block disabled>Login</Button>
                }
            </Form.Item>
                </Card>
            </Col>

    </Row>

    )
}

export default LoginFormComponent;
