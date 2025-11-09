import { useEffect } from 'react';
import { Card, Input, Select, InputNumber, Form, Space, Button } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import { categoryLabels } from '../../../utils/UtilsCategories';
import { modifyStateProperty } from '../../../utils/UtilsState';
import styles from '../../../styles/ProductFilters.module.css';

const { Option } = Select;

let ProductFiltersComponent = ({ products, filters, setFilters, setFilteredProducts, userProductIds }) => {
  let categoryOptions = Object.keys(categoryLabels).map(key => ({
    value: key,
    label: categoryLabels[key].label
  }));

  useEffect(() => {
    let filtered = products.filter((product) => {
      // Exclude sold products - use buyerEmail from product
      if (product.buyerEmail && product.buyerEmail !== '' && product.buyerEmail != null) {
        return false;
      }

      // Exclude products owned by current user - check if product ID is in user's products
      if (userProductIds.length > 0 && userProductIds.includes(product.id)) {
        return false;
      }

      // Filter by category
      if (filters.category !== 'todos' && product.category !== filters.category) {
        return false;
      }

      // Filter by title
      if (filters.title && !product.title.toLowerCase().includes(filters.title.toLowerCase())) {
        return false;
      }

      // Filter by minimum price
      if (filters.minPrice !== null && product.price < filters.minPrice) {
        return false;
      }

      // Filter by maximum price
      if (filters.maxPrice !== null && product.price > filters.maxPrice) {
        return false;
      }

      return true;
    });

    setFilteredProducts(filtered);
  }, [products, filters, setFilteredProducts, userProductIds]);

  let clearAllFilters = () => {
    setFilters({
      category: 'todos',
      title: '',
      minPrice: null,
      maxPrice: null
    });
  };

  let hasActiveFilters = filters.category !== 'todos' || filters.title || filters.minPrice !== null || filters.maxPrice !== null;

  return (
    <Card className={styles.filtersCard}>
      <Form layout="inline" className={styles.filtersForm}>
        <Space wrap className={styles.filtersSpace}>
          
          <Form.Item label="Category">
            <Select
              className={styles.categorySelect}
              value={filters.category}
              onChange={(value) => modifyStateProperty(filters, setFilters, 'category', value)}
              placeholder="All categories"
              popupMatchSelectWidth={false}
              dropdownStyle={{ minWidth: 200, maxHeight: 300 }}
              classNames={{ popup: { root: 'categoryDropdown' } }}
            >
              {categoryOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Title">
            <Input
              className={styles.titleInput}
              placeholder="Search by title..."
              value={filters.title}
              onChange={(e) => modifyStateProperty(filters, setFilters, 'title', e.target.value)}
              allowClear
            />
          </Form.Item>

          <Form.Item label="Min Price">
            <InputNumber
              className={styles.priceInput}
              placeholder="Min"
              min={0}
              value={filters.minPrice}
              onChange={(value) => modifyStateProperty(filters, setFilters, 'minPrice', value)}
              formatter={value => `€ ${value}`}
              parser={value => value.replace('€ ', '')}
            />
          </Form.Item>

          <Form.Item label="Max Price">
            <InputNumber
              className={styles.priceInput}
              placeholder="Max"
              min={0}
              value={filters.maxPrice}
              onChange={(value) => modifyStateProperty(filters, setFilters, 'maxPrice', value)}
              formatter={value => `€ ${value}`}
              parser={value => value.replace('€ ', '')}
            />
          </Form.Item>

          {hasActiveFilters && (
            <Form.Item>
              <Button 
                icon={<ClearOutlined />} 
                onClick={clearAllFilters}
                type="default"
              >
                Clear Filters
              </Button>
            </Form.Item>
          )}
        </Space>
      </Form>
    </Card>
  );
};

export default ProductFiltersComponent;

