import { Space, Typography, InputNumber, Button } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import styles from '../../../styles/ListMyProducts.module.css';

const { Text } = Typography;

const PriceEditor = ({ product, isEditing, editPrice, onEdit, onSave, onCancel, onChange, isProductSold }) => {
  if (isEditing) {
    return (
      <Space>
        <InputNumber
          min={0}
          value={editPrice}
          onChange={onChange}
          formatter={value => value ? `€ ${value}` : ''}
          parser={value => value?.replace('€ ', '')}
          className={styles.priceInput}
          autoFocus
          onPressEnter={onSave}
          disabled={isProductSold}
        />
        <Button 
          type="primary" 
          size="small" 
          icon={<CheckOutlined />}
          onClick={onSave}
          disabled={isProductSold}
        />
        <Button 
          size="small" 
          icon={<CloseOutlined />}
          onClick={onCancel}
          disabled={isProductSold}
        />
      </Space>
    );
  }

  return (
    <Text 
      strong 
      className={`${styles.priceText} ${isProductSold ? '' : styles.priceLink}`} 
      onClick={isProductSold ? null : onEdit}
      title={isProductSold ? "Cannot edit price for a sold product" : "Click to edit"}
    >
      € {product.price}
    </Text>
  );
};

export default PriceEditor;

