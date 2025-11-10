import React from 'react';
import { Tag } from 'antd';
import { StarOutlined } from '@ant-design/icons';

const ReputationTags = ({ reputation }) => {
  if (!reputation) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Tag color="gold" icon={<StarOutlined />}>
        {reputation.totalTransactions} transactions
      </Tag>
      <Tag color="green">
        {reputation.sales} sales
      </Tag>
      <Tag color="blue">
        {reputation.purchases} purchases
      </Tag>
    </div>
  );
};

export default ReputationTags;
