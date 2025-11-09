import { useState } from "react";
import { modifyStateProperty} from "../../../utils/UtilsState";
import { Card, Input, Button, Row, Col, Form, Typography, DatePicker, Select, Space } from "antd";
import {validateFormDataInputRequired,validateFormDataInputEmail,allowSubmitForm,setServerErrors,joinAllServerErrorMessages} from "../../../utils/UtilsValidations"
import { countries } from "../../../utils/UtilsCountries";
import dayjs from "dayjs";
import { apiPost } from '../../../utils/UtilsApi';
import styles from '../../../styles/CreateUser.module.css';

const { Option } = Select;


let CreateUserComponent = ({ openNotification }) => {

    let [formErrors, setFormErrors] = useState({});
    let requiredInForm = ["email", "password"];

    let [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        surname: '',
        documentIdentity: '',
        documentNumber: '',
        country: '',
        address: '',
        postalCode: '',
        birthday: ''
    });

    let clickCreate = async () => {
        let result = await apiPost("/users", formData, {
            includeApiKey: false, // No requiere API key para crear usuario
            onError: (serverErrors) => {
                setServerErrors(serverErrors, setFormErrors)
                let notificationMsg = joinAllServerErrorMessages(serverErrors)
                if (openNotification) {
                    openNotification("top", notificationMsg, "error");
                }
            }
        });

        if (result) {
            if (openNotification) {
                openNotification("top", "User created successfully", "success");
            }
        }
    }


   return (
        <Row align="middle" justify="center" className={styles.container}>
        
          {/* <Col xs={0} sm={0} md={12} lg={8} xl={6}>
            <img src="/create-user.png" width="100%" alt="Create User" />
          </Col>
       */}
          <Col xs={24} sm={24} md={12} lg={12} xl={10}>
            <Card title="Create User" className={styles.card}>
              
              {formErrors?.email?.msg && (
                <Typography.Text type="danger">{formErrors?.email?.msg}</Typography.Text>
            )}
            <Form.Item label="" name="email"
            validateStatus={
                validateFormDataInputEmail(formData, "email", formErrors, setFormErrors) ? "success" : "error"
            }>
                <Input
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(i) => {
                    modifyStateProperty(formData, setFormData, "email", i.currentTarget.value);
                    validateFormDataInputEmail(formData, "email", formErrors, setFormErrors); // Validar al cambiar
                  }}
                  onBlur={() => validateFormDataInputEmail(formData, "email", formErrors, setFormErrors)} // Validar al salir del campo
                />
              </Form.Item>
      
              {formErrors?.password?.msg && (
                <Typography.Text type="danger">{formErrors?.password?.msg}</Typography.Text>
            )}
            <Form.Item label="" name="password"
            validateStatus={
                validateFormDataInputRequired(formData, "password", formErrors, setFormErrors) ? "success" : "error"
            }>
                <Input.Password
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(i) => {
                    modifyStateProperty(formData, setFormData, "password", i.currentTarget.value);
                    validateFormDataInputRequired(formData, "password", formErrors, setFormErrors); // Validar al cambiar
                  }}
                  onBlur={() => validateFormDataInputRequired(formData, "password", formErrors, setFormErrors)} // Validar al salir del campo
                />
              </Form.Item>
      
              <Form.Item label="" name="name">
                <Input
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(i) =>
                    modifyStateProperty(formData, setFormData, "name", i.currentTarget.value)
                  }
                />
              </Form.Item>
      
              <Form.Item label="" name="surname">
                <Input
                  placeholder="Enter your surname"
                  value={formData.surname}
                  onChange={(i) =>
                    modifyStateProperty(formData, setFormData, "surname", i.currentTarget.value)
                  }
                />
              </Form.Item>
      
              <Form.Item label="" name="documentIdentity">
                <Input
                  placeholder="Enter your document type"
                  value={formData.documentIdentity}
                  onChange={(i) =>
                    modifyStateProperty(formData, setFormData, "documentIdentity", i.currentTarget.value)
                  }
                />
              </Form.Item>
      
              <Form.Item label="" name="documentNumber">
                <Input
                  placeholder="Enter your document number"
                  value={formData.documentNumber}
                  onChange={(i) =>
                    modifyStateProperty(formData, setFormData, "documentNumber", i.currentTarget.value)
                  }
                />
              </Form.Item>
      
              <Form.Item label="" name="country">
                <Select
                  showSearch
                  placeholder="Select your country"
                  optionFilterProp="label"
                  filterOption={(input, option) => {
                    let countryName = option.value || '';
                    return countryName.toLowerCase().includes(input.toLowerCase());
                  }}
                  value={formData.country}
                  onChange={(value) =>
                    modifyStateProperty(formData, setFormData, "country", value)
                  }
                  allowClear
                  optionLabelProp="label"
                >
                  {countries.map((country) => (
                    <Option 
                      key={country.code} 
                      value={country.name}
                      label={
                        <Space>
                          <img 
                            src={country.flagImage} 
                            alt={country.name}
                            className={styles.flagImage}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <span>{country.name}</span>
                        </Space>
                      }
                    >
                      <Space>
                        <img 
                          src={country.flagImage} 
                          alt={country.name}
                          className={styles.flagImage}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <span>{country.name}</span>
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="" name="address">
                <Input
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={(i) =>
                    modifyStateProperty(formData, setFormData, "address", i.currentTarget.value)
                  }
                />
              </Form.Item>
      
              <Form.Item label="" name="postalCode">
                <Input
                  placeholder="Enter your postal code"
                  value={formData.postalCode}
                  onChange={(i) =>
                    modifyStateProperty(formData, setFormData, "postalCode", i.currentTarget.value)
                  }
                />
              </Form.Item>
      
              <Form.Item label="" name="birthday">
                <DatePicker
                  placeholder="Select your birthday"
                  format="DD/MM/YYYY"
                  value={formData.birthday ? dayjs(formData.birthday * 1000) : null}
                  onChange={(date) => {
                    const timestampInSeconds = date ? Math.floor(date.valueOf() / 1000) : '';
                    console.log(timestampInSeconds)
                    modifyStateProperty(formData, setFormData, "birthday", timestampInSeconds);
                  }}
                  disabledDate={(current) => {
                    return current && current > dayjs().endOf('day');
                  }}
                />
                <Typography.Text type="secondary" className={styles.helperText}>
                  Example: 01/01/1990 (DD/MM/YYYY)
                </Typography.Text>
              </Form.Item>
      
              <Form.Item>
                { allowSubmitForm(formData,formErrors,requiredInForm) ?
                    <Button type="primary" onClick={clickCreate} block>
                      Create User
                    </Button> :
                    <Button type="primary" block disabled>
                      Create User
                    </Button>
                }
              </Form.Item>
      
            </Card>
          </Col>
        </Row>
      );
}


export default CreateUserComponent;
