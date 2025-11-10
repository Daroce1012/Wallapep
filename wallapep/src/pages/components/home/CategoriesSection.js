import { useMemo } from 'react';
import { Row, Col, Typography, Tag } from 'antd';
import { categoryLabels } from '../../../utils/UtilsCategories';
import styles from '../../../styles/Home.module.css';

const { Title, Text } = Typography;

const CategoriesSection = ({ selectedCategory, setSelectedCategory, categoriesCount }) => {
  // Mapa completo incluyendo 'todos'
  const countByCategory = useMemo(() => {
    const totalCount = Object.values(categoriesCount).reduce((sum, count) => sum + count, 0);
    return { todos: totalCount, ...categoriesCount };
  }, [categoriesCount]);

  return (
    <div className={styles.categoriesContainer}>
      <div className={styles.mainContentWrapper}>
        <div className={styles.categoriesHeader}>
          <Title level={2} className={styles.categoriesTitle}>
            Browse Categories
          </Title>
        </div>

        <Row gutter={[16, 16]}>
          {Object.entries(categoryLabels).map(([categoryKey, categoryInfo]) => {
            const count = countByCategory[categoryKey] || 0;
            const isSelected = selectedCategory === categoryKey;

            return (
              <Col xs={12} sm={8} md={6} lg={4} xl={3} key={categoryKey}>
                <div
                  onClick={() => setSelectedCategory(categoryKey)}
                  className={isSelected ? styles.categoryCardSelected : styles.categoryCard}
                >
                  <div className={isSelected ? styles.categoryEmojiSelected : styles.categoryEmoji}>
                    {categoryInfo.emoji}
                  </div>

                  <Text 
                    strong 
                    className={isSelected ? styles.categoryLabelSelected : styles.categoryLabel}
                  >
                    {categoryInfo.label}
                  </Text>

                  <Tag 
                    color={isSelected ? 'default' : 'blue'}
                    className={isSelected ? styles.categoryTagSelected : styles.categoryTag}
                  >
                    {count} {count === 1 ? 'product' : 'products'}
                  </Tag>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default CategoriesSection;
