import { useState } from "react";
import { Card, Input, Button, Row, Col, Form, Typography, DatePicker, Select, Space } from "antd";
import { UserAddOutlined, MailOutlined, LockOutlined, UserOutlined, IdcardOutlined, GlobalOutlined, HomeOutlined, CalendarOutlined } from '@ant-design/icons';
import { countries } from "../../../utils/UtilsCountries";
import { useRouter } from 'next/router';
import Link from 'next/link';
import dayjs from "dayjs";
import { apiPost } from '../../../utils/UtilsApi';
import styles from '../../../styles/CreateUser.module.css';

const { Title, Text } = Typography;

const DOCUMENT_TYPES = [
  { value: 'DNI', label: 'DNI' },
  { value: 'Pasaporte', label: 'Pasaporte' },
  { value: 'NIE', label: 'NIE' }
];

const CreateUserComponent = ({ openNotification }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const onFinish = async (values) => {
    setSubmitting(true);
    const userData = { ...values };
    
    if (userData.birthday) {
      userData.birthday = Math.floor(userData.birthday.valueOf() / 1000);
    }

    try {
      const result = await apiPost("/users", userData, {
        includeApiKey: false,
        onError: (serverErrors) => {
          serverErrors.forEach(error => {
            if (error.path) {
              form.setFields([{
                name: error.path,
                errors: [error.msg]
              }]);
            } else {
              // openNotification?.("top", `Error: ${error.msg}`, "error");
            }
          });
        }
      });

      if (result) {
        // Limpiar formulario
        form.resetFields();
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setSubmitting(false); // Asegurarse de que el estado de envío se restablezca
    }
    // NO poner setSubmitting(false) aquí si es exitoso, para mantener el botón en loading durante la redirección
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
    searchLabel: country.name
  }));

  return (
    <div className={styles.pageContainer}>
      <Row align="middle" justify="center" className={styles.container}>
        <Col xs={24} sm={22} md={18} lg={14} xl={8}> {/* Reduced xl from 10 to 8 */}
          <Card 
            className={styles.modernCard}
            bordered={false}
          >
            {/* Header */}
            <div className={styles.header}>
              <UserAddOutlined className={styles.headerIcon} />
              <Title level={3} className={styles.title}>
                Create Your Account
              </Title>
              <Text type="secondary" className={styles.subtitle}>
                Join our marketplace to start buying and selling.
              </Text>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={true}
              className={styles.modernForm}
            >
              {/* Email */}
              <Form.Item 
                label={<Text strong>Email</Text>}
                name="email"
                rules={[
                  { required: true, message: "Please enter your email!" },
                  { type: 'email', message: "Please enter a valid email!" }
                ]}
              >
                <Input 
                  prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Enter your email address" 
                  size="default"
                />
              </Form.Item>

              {/* Password */}
              <Form.Item 
                label={<Text strong>Password</Text>}
                name="password"
                rules={[
                  { required: true, message: "Please enter your password!" },
                  { min: 8, message: "Password must be at least 8 characters" }
                ]}
                extra={<Text type="secondary" style={{ fontSize: '12px' }}>Must be at least 8 characters.</Text>}
              >
                <Input.Password 
                  prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Enter your password" 
                  size="default"
                />
              </Form.Item>

              {/* Name & Surname */}
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item 
                    label={<Text strong>First Name</Text>}
                    name="name"
                  >
                    <Input 
                      prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="e.g. Jane" 
                      size="default"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item 
                    label={<Text strong>Last Name</Text>}
                    name="surname"
                  >
                    <Input 
                      placeholder="e.g. Doe" 
                      size="default"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Document Type & Number */}
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item 
                    label={<Text strong>Document Type</Text>}
                    name="documentIdentity"
                  >
                    <Select
                      placeholder="Select document type"
                      size="default"
                      options={DOCUMENT_TYPES}
                      suffixIcon={<IdcardOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item 
                    label={<Text strong>Document Number</Text>}
                    name="documentNumber"
                  >
                    <Input 
                      placeholder="e.g. 12345678X" 
                      size="default"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Country & Birthday */}
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item 
                    label={<Text strong>Country</Text>}
                    name="country"
                  >
                    <Select
                      showSearch
                      placeholder="Select your country"
                      size="default"
                      optionFilterProp="searchLabel"
                      filterOption={(input, option) =>
                        option.searchLabel.toLowerCase().includes(input.toLowerCase())
                      }
                      allowClear
                      suffixIcon={<GlobalOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                      options={countryOptions}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item 
                    label={<Text strong>Date of Birth</Text>}
                    name="birthday"
                  >
                    <DatePicker
                      placeholder="DD/MM/YYYY"
                      format="DD/MM/YYYY"
                      size="default"
                      style={{ width: '100%' }}
                      suffixIcon={<CalendarOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                      disabledDate={(current) => {
                        return current && current > dayjs().endOf('day');
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Address & Postal Code */}
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item 
                    label={<Text strong>Address</Text>}
                    name="address"
                  >
                    <Input 
                      prefix={<HomeOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="e.g. 123 Main Street" 
                      size="default"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item 
                    label={<Text strong>Postal Code</Text>}
                    name="postalCode"
                  >
                    <Input 
                      placeholder="e.g. 90210" 
                      size="default"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Submit Button */}
              <Form.Item style={{ marginTop: '0px', marginBottom: '0px' }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block
                  size="default"
                  loading={submitting}
                  className={styles.submitButton}
                >
                  {submitting ? 'Creating Account...' : 'Create Account'}
                </Button>
              </Form.Item>

              {/* Sign In Link */}
              <div className={styles.signInLink}>
                <Text type="secondary" style={{ fontSize: '13px' }}>
                  Already have an account?{' '}
                  <Link href="/login" className={styles.loginLink}>
                    <Text strong style={{ color: '#1890ff', cursor: 'pointer', fontSize: '13px' }}>
                      Sign In
                    </Text>
                  </Link>
                </Text>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateUserComponent;
