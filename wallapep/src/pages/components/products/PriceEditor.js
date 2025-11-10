import { Space, Typography, InputNumber, Button } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import styles from '../../../styles/ListMyProducts.module.css';

const { Text } = Typography;

const PriceEditor = ({ product, isEditing, editPrice, onEdit, onSave, onCancel, onChange }) => {
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
        />
        <Button 
          type="primary" 
          size="small" 
          icon={<CheckOutlined />}
          onClick={onSave}
        />
        <Button 
          size="small" 
          icon={<CloseOutlined />}
          onClick={onCancel}
        />
      </Space>
    );
  }

  return (
    <Text 
      strong 
      className={`${styles.priceText} ${styles.clickablePrice}`} 
      onClick={onEdit}
      title="Click to edit"
    >
      € {product.price}
    </Text>
  );
};

export default PriceEditor;

