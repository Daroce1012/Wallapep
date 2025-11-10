import React from 'react';
import { Card, Row, Col, Statistic, Skeleton } from 'antd';
import styles from '../../../styles/App.module.css'; // Podría ser un estilo más general o uno específico para StatisticsCard

const StatisticsCard = ({ stats, loading = false, className }) => {
  return (
    <Card className={className} bordered={false} style={{ marginBottom: 24 }}>
      <Row gutter={16}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={8} key={index}>
            <Skeleton loading={loading} active paragraph={{ rows: 1 }} title={false}>
              <Statistic
                title={stat.title}
                value={stat.value}
                precision={stat.precision}
                valueStyle={stat.valueStyle}
                prefix={stat.prefix}
                suffix={stat.suffix}
                formatter={stat.formatter}
              />
            </Skeleton>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default StatisticsCard;
