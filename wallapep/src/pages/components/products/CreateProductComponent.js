import {useState} from "react";
import {modifyStateProperty} from "../../../utils/UtilsState";
import {Card, Input, Button, Row, Col, Form, Select, Typography, Upload } from "antd";
import { useSelector, useDispatch } from "react-redux";
//import { actions } from "../../../reducers/reducerCountSlice";
import {validateFormDataInputRequired, validateFormDataInputEmail, allowSubmitForm, setServerErrors, joinAllServerErrorMessages} from "../../../utils/UtilsValidations";
import { category } from "../../../utils/UtilsCategories";

let CreateProductComponent = ({ openNotification }) => {
    // const countGlobalState1 = useSelector(state => state.reducerCount);
    // const countGlobalState2 = useSelector(state => state.reducerCountSlice);
    const dispatch = useDispatch();

    let [formErrors, setFormErrors] = useState({});
    let requiredInForm = ["title", "price", "category"];

    let [formData, setFormData] = useState({})
   
    let clickCreateProduct = async () => {
        let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/products",{
            method: "POST",
            headers: {
                "Content-Type" : "application/json ",
                "apikey": localStorage.getItem("apiKey")
            },
            body: JSON.stringify(formData)
        })

        if (response.ok){
            let data = await response.json()
            await uploadImage(data.productId);
            if (openNotification) {
                openNotification("top", "Product created successfully", "success");
            }
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            setServerErrors(serverErrors, setFormErrors)
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            if (openNotification) {
                openNotification("top", notificationMsg, "error");
            }
        }
    }

    let uploadImage = async (productId) => {
        let formDataImage = new FormData();
        formDataImage.append('image', formData.image);

        let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/products/"+productId+"/image", {
                method: "POST",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
                body: formDataImage
            })
        if (response.ok) {
            //let data = await response.json()
            //await uploadImage(data.productId)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            setServerErrors(serverErrors, setFormErrors)
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            if (openNotification) {
                openNotification("top", notificationMsg, "error");
            }
        }
    }


    return (
        <Row align="middle" justify="center" style={{minHeight: "70vh"}}>
            <Col>
                <Card title="Create product" style={{width: "500px"}}>
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
                    <Form.Item label="" name="title"
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

                    <Form.Item label="">
                        <Input 
                        onChange={
                            (i) => modifyStateProperty(
                                formData, setFormData, "description", i.currentTarget.value)}
                               size="large" type="text" placeholder="description"></Input>
                    </Form.Item>

                    {formErrors?.price?.msg && (
                        <Typography.Text type="danger">{formErrors?.price?.msg}</Typography.Text>
                    )}
                    <Form.Item label="" name="price"
                    validateStatus={
                        validateFormDataInputRequired(formData, "price", formErrors, setFormErrors) ? "success" : "error"
                    }
                    rules={[
                        { required: true, message: "Price is required" },
                        { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "Enter a valid price (max 2 decimals)" },]}
                    >
                        <Input
                        min={0}
                        onChange={
                            (i) => {
                                modifyStateProperty(
                                formData, setFormData, "price", i.currentTarget.value);
                                validateFormDataInputRequired(formData, "price", formErrors, setFormErrors); // Validar al cambiar
                            }}
                            onBlur={() => validateFormDataInputRequired(formData, "price", formErrors, setFormErrors)} // Validar al salir del campo
                               size="large" type="number" placeholder="price"></Input>
                    </Form.Item>

                    <Form.Item name="image">
                        <Upload  action={
                            (file) => modifyStateProperty(
                                formData, setFormData, "image", file) }  listType="picture-card">
                            Upload
                        </Upload>
                    </Form.Item>
                    {formErrors?.category?.msg && (
                        <Typography.Text type="danger">{formErrors?.category?.msg}</Typography.Text>
                    )}
                    <Form.Item name="category"
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



                    <Button type="primary" onClick={clickCreateProduct} block
                    disabled={!allowSubmitForm(formData, formErrors, requiredInForm)}>
                        Sell Product
                    </Button>
                </Card>
            </Col>
        </Row>
    )
}

export default CreateProductComponent;
