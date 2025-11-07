import { useState } from "react";
import { modifyStateProperty } from "../../../utils/UtilsState";
import {Card, Col, Row, Form, Input, Button , Typography } from "antd";


let CreateUserComponent = () => {

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
        let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            let responseBody = await response.json();
            console.log("ok " + responseBody);
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg);
            });
        }
    };

    return (
        <Row align="middle" justify="center" style={{ minHeight: "80vh" }}>
          {/* Imagen lateral */}
          <Col xs={0} sm={0} md={12} lg={8} xl={6}>
            <img src="/create-user.png" width="100%" alt="Create User" />
          </Col>
      
          {/* Formulario */}
          <Col xs={24} sm={24} md={12} lg={12} xl={10}>
            <Card title="Create User" style={{ width: "100%", margin: "15px" }}>
              
              {/* EMAIL */}
              <Form.Item label="Email" name="email" 
              rules={[{required: true,message: "The email is required",}]}
              >
                <Input
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(i) =>
                    modifyStateProperty(formData, setFormData, "email", i.currentTarget.value)
                  }
                />
              </Form.Item>
      
              {/* PASSWORD */}
              <Form.Item label="Password" name="password" 
              rules={[{required: true,message: "The password is required",}]}
              >
                <Input.Password
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(i) =>
                    modifyStateProperty(formData, setFormData, "password", i.currentTarget.value)
                  }
                />
              </Form.Item>
      
              {/* NAME */}
              <Form.Item label="Name" name="name">
                <Input
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(i) =>
                    modifyStateProperty(formData, setFormData, "name", i.currentTarget.value)
                  }
                />
              </Form.Item>
      
              {/* SURNAME */}
              <Form.Item label="Surname" name="surname">
                <Input
                  placeholder="Enter your surname"
                  value={formData.surname}
                  onChange={(i) =>
                    modifyStateProperty(formData, setFormData, "surname", i.currentTarget.value)
                  }
                />
              </Form.Item>
      
              {/* DOCUMENT TYPE */}
              <Form.Item label="Document Type" name="documentIdentity">
                <Input
                  placeholder="Enter your document type"
                  value={formData.documentIdentity}
                  onChange={(i) =>
                    modifyStateProperty(formData, setFormData, "documentIdentity", i.currentTarget.value)
                  }
                />
              </Form.Item>
      
              {/* DOCUMENT NUMBER */}
              <Form.Item label="Document Number" name="documentNumber">
                <Input
                  placeholder="Enter your document number"
                  value={formData.documentNumber}
                  onChange={(i) =>
                    modifyStateProperty(formData, setFormData, "documentNumber", i.currentTarget.value)
                  }
                />
              </Form.Item>
      
              {/* COUNTRY */}
              <Form.Item label="Country" name="country">
                <Input
                  placeholder="Enter your country"
                  value={formData.country}
                  onChange={(i) =>
                    modifyStateProperty(formData, setFormData, "country", i.currentTarget.value)
                  }
                />
              </Form.Item>
      
              {/* ADDRESS */}
              <Form.Item label="Address" name="address">
                <Input
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={(i) =>
                    modifyStateProperty(formData, setFormData, "address", i.currentTarget.value)
                  }
                />
              </Form.Item>
      
              {/* POSTAL CODE */}
              <Form.Item label="Postal Code" name="postalCode">
                <Input
                  placeholder="Enter your postal code"
                  value={formData.postalCode}
                  onChange={(i) =>
                    modifyStateProperty(formData, setFormData, "postalCode", i.currentTarget.value)
                  }
                />
              </Form.Item>
      
              {/* BIRTHDAY */}
              <Form.Item label="Birthday" name="birthday">
                <Input
                  type="date"
                  value={formData.birthday}
                  onChange={(i) =>
                    modifyStateProperty(formData, setFormData, "birthday", i.currentTarget.value)
                  }
                />
              </Form.Item>
      
              {/* SUBMIT BUTTON */}
              <Form.Item>
                <Button type="primary" onClick={clickCreate} block>
                  Create User
                </Button>
              </Form.Item>
      
            </Card>
          </Col>
        </Row>
      );
      
      
};

export default CreateUserComponent;

