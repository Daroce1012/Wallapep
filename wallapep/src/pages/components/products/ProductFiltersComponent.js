import { useMemo } from 'react';
import { Card, Input, Select, InputNumber, Form, Space, Button } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import { categoryLabels } from '../../../utils/UtilsCategories';
import styles from '../../../styles/ProductFilters.module.css';

const ProductFiltersComponent = ({ filters, setFilters }) => {
  
  // Opciones de categorías (calculado una sola vez)
  const categoryOptions = useMemo(() => {
    return Object.keys(categoryLabels).map(key => ({
      value: key,
      label: categoryLabels[key].label
    }));
  }, []);

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return filters.category !== 'todos' || 
           filters.title !== '' || 
           filters.minPrice !== null || 
           filters.maxPrice !== null;
  }, [filters]);

  // Handler genérico para actualizar filtros
  const updateFilter = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: 'todos',
      title: '',
      minPrice: null,
      maxPrice: null
    });
  };

  return (
    <Card className={styles.filtersCard}>
      <Form layout="inline" className={styles.filtersForm}>
        <Space wrap className={styles.filtersSpace}>
          
          {/* Filtro de categoría */}
          <Form.Item label="Category">
            <Select
              className={styles.categorySelect}
              value={filters.category}
              onChange={(value) => updateFilter('category', value)}
              placeholder="All categories"
              popupMatchSelectWidth={false}
              dropdownStyle={{ minWidth: 200, maxHeight: 300 }}
              options={categoryOptions}
            />
          </Form.Item>

          {/* Filtro de título */}
          <Form.Item label="Title">
            <Input
              className={styles.titleInput}
              placeholder="Search by title..."
              value={filters.title}
              onChange={(e) => updateFilter('title', e.target.value)}
              allowClear
            />
          </Form.Item>

          {/* Precio mínimo */}
          <Form.Item label="Min Price">
            <InputNumber
              className={styles.priceInput}
              placeholder="Min"
              min={0}
              value={filters.minPrice}
              onChange={(value) => updateFilter('minPrice', value)}
              formatter={value => value ? `€ ${value}` : ''}
              parser={value => value.replace('€ ', '')}
            />
          </Form.Item>

          {/* Precio máximo */}
          <Form.Item label="Max Price">
            <InputNumber
              className={styles.priceInput}
              placeholder="Max"
              min={filters.minPrice || 0}
              value={filters.maxPrice}
              onChange={(value) => updateFilter('maxPrice', value)}
              formatter={value => value ? `€ ${value}` : ''}
              parser={value => value.replace('€ ', '')}
            />
          </Form.Item>

          {/* Botón de limpiar */}
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
