import { useState } from "react";
import { Card, Input, Button, Row, Col, Form, Select, Upload, InputNumber, Space, message, Modal } from "antd";
import { PlusOutlined, ShopOutlined } from '@ant-design/icons';
import { getCategoriesForSelect } from "../../../utils/UtilsCategories";
import { apiPost } from '../../../utils/UtilsApi';
import styles from '../../../styles/CreateProduct.module.css';

// Reglas de validación del formulario
const FORM_RULES = {
  title: [
    { required: true, message: "Product title is required" },
    { min: 5, message: "Title must be at least 5 characters" },
    { max: 30, message: "Title must be less than 30 characters" }
  ],
  description: [
    { max: 100, message: "Description must be less than 100 characters" }
  ],
  category: [
    { required: true, message: "Category is required" }
  ],
  price: [
    { required: true, message: "Price is required" },
    { type: 'number', min: 0.01, message: "Price must be greater than 0" },
    { type: 'number', max: 1000000, message: "Price must be less than 1,000,000" }
  ]
};

const CreateProductComponent = ({ openNotification }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState(null); // { open, image, title }
  const [submitting, setSubmitting] = useState(false);

  // Convertir archivo a base64 para preview
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  // Subir imagen del producto
  const uploadImage = async (productId, imageFile) => {
    if (!imageFile) return true;

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const result = await apiPost(`/products/${productId}/image`, formData, {
        onError: (errors) => {
          throw new Error(errors.map(e => e.msg).join(", "));
        }
      });
      return !!result;
    } catch (error) {
      message.error(error.message || "Failed to upload image");
      return false;
    }
  };

  // Crear producto
  const handleSubmit = async (values) => {
    setSubmitting(true);

    try {
      // 1. Crear producto
      const productData = { ...values };
      delete productData.image;

      const data = await apiPost("/products", productData, {
        onError: (errors) => {
          throw new Error(errors.map(e => e.msg).join(", "));
        }
      });

      if (!data?.productId) {
        throw new Error("No product ID returned");
      }

      // 2. Subir imagen si existe
      const imageFile = fileList[0]?.originFileObj;
      const imageUploaded = imageFile ? await uploadImage(data.productId, imageFile) : true;

      // 3. Mostrar resultado y resetear
      if (imageUploaded) {
        message.success("Product created successfully");
        if (openNotification) {
          openNotification("top", "Product created successfully", "success");
        }
        form.resetFields();
        setFileList([]);
      } else {
        message.warning("Product created but image upload failed");
      }

    } catch (error) {
      message.error(error.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  // Validar archivo antes de agregarlo
  const beforeUpload = (file) => {
    const isValidType = file.type === 'image/jpeg' || file.type === 'image/png';
    const isValidSize = file.size / 1024 / 1024 < 2;

    if (!isValidType) {
      message.error('Only JPG/PNG files are allowed');
      return Upload.LIST_IGNORE;
    }
    if (!isValidSize) {
      message.error('Image must be smaller than 2MB');
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  // Preview de imagen
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreview({
      open: true,
      image: file.url || file.preview,
      title: file.name || file.url?.substring(file.url.lastIndexOf('/') + 1)
    });
  };

  return (
    <>
      <Row align="middle" justify="center" className={styles.container}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card
            title={
              <Space size="middle">
                <ShopOutlined className={styles.headerIcon} />
                <span className={styles.headerTitle}>Create Product</span>
              </Space>
            }
            className={styles.card}
          >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              {/* Imagen */}
              <Form.Item 
                label="Product Image" 
                name="image"
                extra="Supported formats: JPG, PNG. Max size: 2MB"
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                  beforeUpload={beforeUpload}
                  onPreview={handlePreview}
                  className={styles.uploadContainer}
                >
                  {fileList.length < 1 && (
                    <div className={styles.uploadButton}>
                      <PlusOutlined style={{ fontSize: 20 }} />
                      <div style={{ marginTop: 8 }}>Upload Image</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              {/* Título */}
              <Form.Item label="Title" name="title" rules={FORM_RULES.title}>
                <Input 
                  size="large" 
                  placeholder="Enter product title" 
                  maxLength={30}
                  showCount
                />
              </Form.Item>

              {/* Categoría y Precio */}
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Category" name="category" rules={FORM_RULES.category}>
                    <Select
                      size="large"
                      placeholder="Select a category"
                      showSearch
                      optionFilterProp="label"
                      options={getCategoriesForSelect()}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item label="Price" name="price" rules={FORM_RULES.price}>
                    <InputNumber
                      min={0.01}
                      max={1000000}
                      className={styles.priceInput}
                      size="large"
                      placeholder="0.00"
                      formatter={value => value ? `€ ${value}` : ''}
                      parser={value => value.replace(/€\s?/g, '')}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Descripción */}
              <Form.Item label="Description" name="description" rules={FORM_RULES.description}>
                <Input.TextArea 
                  size="large" 
                  placeholder="Enter product description (optional)" 
                  rows={4}
                  maxLength={100}
                  showCount
                />
              </Form.Item>

              {/* Botón de envío */}
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large"
                  loading={submitting}
                  icon={<ShopOutlined />}
                  className={styles.submitButton}
                >
                  {submitting ? 'Creating Product...' : 'Create Product'}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Modal de preview */}
      <Modal
        open={preview?.open}
        title={preview?.title}
        footer={null}
        onCancel={() => setPreview(null)}
        centered
      >
        <img alt="preview" style={{ width: '100%' }} src={preview?.image} />
      </Modal>
    </>
  );
};

export default CreateProductComponent;
