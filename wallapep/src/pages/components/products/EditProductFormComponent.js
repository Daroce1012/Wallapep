import {useState, useEffect } from "react";
import { Card, Input, Button, Row, Col, Form, Typography, DatePicker } from "antd";
import {modifyStateProperty} from "../../../utils/UtilsState";
import {timestampToDate, dateFormatTemplate } from "../../../utils/UtilsDates";
import { apiGet, apiPut } from '../../../utils/UtilsApi';
import styles from '../../../styles/EditProductForm.module.css';

let EditProductFormComponent = ({id}) => {
    let [formData, setFormData] = useState({})

    useEffect(() => {
        getProduct(id);
    }, [])

    let getProduct = async (id) => {
        let jsonData = await apiGet(`/products/${id}`);
        if (jsonData) {
            setFormData(jsonData)
        }
    }

    let clickEditProduct = async () => {
        let result = await apiPut(`/products/${id}`, formData);
        // Result puede ser usado para mostrar mensaje de éxito si es necesario
    }


    return (
        <Row align="middle" justify="center" className={styles.container}>
            <Col>
                <Card title="Edit product" className={styles.card}>

                    <Form.Item label="">
                        <Input onChange = { 
                            (i) => modifyStateProperty(formData, setFormData,"title",i.currentTarget.value) }
                            size="large" type="text" placeholder="product title"
                            value={formData?.title}>
                        </Input>
                    </Form.Item>

                    <Form.Item label="">
                        <Input onChange = {
                            (i) => modifyStateProperty(formData, setFormData,"description",i.currentTarget.value) }
                            size="large"  type="text" placeholder="description"
                            value={formData?.description}>
                        </Input>
                    </Form.Item>

                    <Form.Item label="">
                        <Input onChange = { 
                            (i) => modifyStateProperty(formData, setFormData,"price",i.currentTarget.value) }
                            size="large"  type="number" placeholder="price"
                            value={formData?.price}>
                        </Input>
                    </Form.Item>

                    <Form.Item label="">
                        <DatePicker value={ formData.date && timestampToDate(formData.date) }
                                    format={ dateFormatTemplate }
                                    onChange={ (inDate, inString) => {
                                        console.log(inString)
                                    } }
                        />
                    </Form.Item>

                    <Button type="primary" onClick={clickEditProduct}  block >Edit Product</Button> 
                </Card>
            </Col>
        </Row>

    )
}

export default EditProductFormComponent;
