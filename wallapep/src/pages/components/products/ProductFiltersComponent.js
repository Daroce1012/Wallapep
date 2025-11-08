import { useEffect } from 'react';
import { Card, Input, Select, InputNumber, Form, Space } from 'antd';
import { categoryLabels } from '../../../utils/UtilsCategories';
import { modifyStateProperty } from '../../../utils/UtilsState';

const { Option } = Select;

let ProductFiltersComponent = ({ products, filters, setFilters, setFilteredProducts }) => {
  let categoryOptions = Object.keys(categoryLabels).map(key => ({
    value: key,
    label: categoryLabels[key].label
  }));

  useEffect(() => {
    let filtered = products.filter((product) => {
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
  }, [products, filters, setFilteredProducts]);

  return (
    <Card style={{ marginBottom: '24px' }}>
      <Form layout="inline" style={{ width: '100%', justifyContent: 'space-between' }}>
        <Space wrap style={{ width: '100%' }}>
          <Form.Item label="Category">
            <Select
              style={{ width: 150 }}
              value={filters.category}
              onChange={(value) => modifyStateProperty(filters, setFilters, 'category', value)}
              placeholder="All categories"
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
              style={{ width: 200 }}
              placeholder="Search by title..."
              value={filters.title}
              onChange={(e) => modifyStateProperty(filters, setFilters, 'title', e.target.value)}
              allowClear
            />
          </Form.Item>

          <Form.Item label="Min Price">
            <InputNumber
              style={{ width: 120 }}
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
              style={{ width: 120 }}
              placeholder="Max"
              min={0}
              value={filters.maxPrice}
              onChange={(value) => modifyStateProperty(filters, setFilters, 'maxPrice', value)}
              formatter={value => `€ ${value}`}
              parser={value => value.replace('€ ', '')}
            />
          </Form.Item>
        </Space>
      </Form>
    </Card>
  );
};

export default ProductFiltersComponent;

