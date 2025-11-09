import {useState} from "react";
import {modifyStateProperty} from "../../../utils/UtilsState";
import {Card, Input, Button, Row, Col, Form, Select, Typography, Upload, InputNumber, Space } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from "react-redux";
//import { actions } from "../../../reducers/reducerCountSlice";
import {validateFormDataInputRequired, validateFormDataInputEmail, allowSubmitForm, setServerErrors, joinAllServerErrorMessages} from "../../../utils/UtilsValidations";
import { category } from "../../../utils/UtilsCategories";
import { apiPost, getApiHeaders } from '../../../utils/UtilsApi';
import styles from '../../../styles/CreateProduct.module.css';

let CreateProductComponent = ({ openNotification }) => {
    // const countGlobalState1 = useSelector(state => state.reducerCount);
    // const countGlobalState2 = useSelector(state => state.reducerCountSlice);
    const dispatch = useDispatch();

    let [formErrors, setFormErrors] = useState({});
    let requiredInForm = ["title", "price", "category"];

    let [formData, setFormData] = useState({})
   
    let clickCreateProduct = async () => {
        let data = await apiPost("/products", formData, {
            onError: (serverErrors) => {
                setServerErrors(serverErrors, setFormErrors)
                let notificationMsg = joinAllServerErrorMessages(serverErrors)
                if (openNotification) {
                    openNotification("top", notificationMsg, "error");
                }
            }
        });

        if (data && data.productId) {
            await uploadImage(data.productId);
            if (openNotification) {
                openNotification("top", "Product created successfully", "success");
            }
        }
    }

    let uploadImage = async (productId) => {
        // Si no hay imagen, no intentar subirla
        if (!formData.image) {
            return;
        }

        let formDataImage = new FormData();
        formDataImage.append('image', formData.image);

        let result = await apiPost(`/products/${productId}/image`, formDataImage, {
            headers: {
                "apikey": localStorage.getItem("apiKey")
            },
            onError: (serverErrors) => {
                setServerErrors(serverErrors, setFormErrors);
                let notificationMsg = joinAllServerErrorMessages(serverErrors);
                if (openNotification) {
                    openNotification("top", notificationMsg, "error");
                }
            }
        });
    }


    return (
        <Row align="middle" justify="center" className={styles.container}>
            <Col>
                <Card 
                    title={
                        <Space>
                            <PlusOutlined className={styles.headerIcon} />
                            <span>Create Product</span>
                        </Space>
                    } 
                    className={styles.card}
                >
                    <Form 
                        layout="vertical" 
                        onFinish={clickCreateProduct} 
                        initialValues={formData} 
                        onValuesChange={(
                            changedValues, 
                            allValues
                        ) => setFormData(allValues)}
                    >
                        {/* <p> Global count1: { countGlobalState1 } </p>
                        <button onClick={ () => { dispatch({type:"plus/count"}) } }> +1 </button>
                        <button onClick={ () => { dispatch({type:"less/count"}) } }> -1 </button>
                        <button
                            onClick={ () => { dispatch({type:"modify/count", payload:999 }) } }>
                            to 999 </button>

                        <p> Global count2: { countGlobalState2 } </p>
                        <button onClick={ () => { dispatch(actions.increment()) } }> +1 </button>
                        <button onClick={ () => { dispatch(actions.decrement()) } }> -1 </button>
                        <button
                            onClick={ () => { dispatch(actions.modify(1)) } }>
                            to 1 </button> */}

                        {formErrors?.title?.msg && (
                            <Typography.Text type="danger">{formErrors?.title?.msg}</Typography.Text>
                        )}
                        <Form.Item label="Title" name="title"
                        validateStatus={
                            validateFormDataInputRequired(formData, "title", formErrors, setFormErrors) ? "success" : "error"
                        }
                        rules={[{required: true,message: "The product title is required"}]}
                        >
                            <Input
                            onChange={
                                (i) => {
                                    modifyStateProperty(
                                    formData, setFormData, "title", i.currentTarget.value);
                                    validateFormDataInputRequired(formData, "title", formErrors, setFormErrors); // Validar al cambiar
                                }}
                                onBlur={() => validateFormDataInputRequired(formData, "title", formErrors, setFormErrors)} // Validar al salir del campo
                                size="large" type="text" placeholder="product title"></Input>
                        </Form.Item>

                        <Form.Item label="Description" name="description">
                            <Input 
                            onChange={
                                (i) => modifyStateProperty(
                                    formData, setFormData, "description", i.currentTarget.value)}
                                size="large" type="text" placeholder="description"></Input>
                        </Form.Item>

                        {formErrors?.price?.msg && (
                            <Typography.Text type="danger">{formErrors?.price?.msg}</Typography.Text>
                        )}
                        <Form.Item label="Price" name="price"
                        validateStatus={
                            validateFormDataInputRequired(formData, "price", formErrors, setFormErrors) ? "success" : "error"
                        }
                        rules={[
                            { required: true, message: "Price is required" },
                            { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "Enter a valid price (max 2 decimals)" },]}
                        >
                            <InputNumber
                            min={0}
                            className={styles.priceInput}
                            size="large"
                            placeholder="price"
                            value={formData.price}
                            onChange={(value) => {
                                modifyStateProperty(formData, setFormData, "price", value);
                                validateFormDataInputRequired(formData, "price", formErrors, setFormErrors);
                            }}
                            onBlur={() => validateFormDataInputRequired(formData, "price", formErrors, setFormErrors)}
                            formatter={value => value ? `€ ${value}` : ''}
                            parser={value => value.replace('€ ', '')}
                            />
                        </Form.Item>

                        <Form.Item label="Image" name="image">
                            <Upload  
                                beforeUpload={(file) => {
                                    // Guardar el archivo antes de que se intente subir
                                    modifyStateProperty(formData, setFormData, "image", file);
                                    return false; // Prevenir la subida automática
                                }}
                                onRemove={() => {
                                    modifyStateProperty(formData, setFormData, "image", null);
                                }}
                                listType="picture-card"
                                maxCount={1}
                            >
                                Upload
                            </Upload>
                        </Form.Item>
                        {formErrors?.category?.msg && (
                            <Typography.Text type="danger">{formErrors?.category?.msg}</Typography.Text>
                        )}
                        <Form.Item label="Category" name="category"
                        validateStatus={
                            validateFormDataInputRequired(formData, "category", formErrors, setFormErrors) ? "success" : "error"
                        }
                        rules={[{ required: true, message: "Category is required" }]}>
                            <Select
                                placeholder="Select a category"
                                showSearch  
                                optionFilterProp="label"
                                onChange={
                                    (value) => {
                                        modifyStateProperty(
                                        formData, setFormData, "category", value);
                                        validateFormDataInputRequired(formData, "category", formErrors, setFormErrors); // Validar al cambiar
                                    }}
                                onBlur={() => validateFormDataInputRequired(formData, "category", formErrors, setFormErrors)} // Validar al salir del campo
                                options={category}
                            />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" block
                        disabled={!allowSubmitForm(formData, formErrors, requiredInForm)}>
                            Sell Product
                        </Button>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}

export default CreateProductComponent;
