import React from 'react';
import { Space, Typography } from 'antd';

const { Text } = Typography;

const UserInfoItem = ({ icon, label, value }) => {
  if (!value && value !== 0) return null;

  return (
    <Space>
      {icon}
      <div>
        <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
          {label}
        </Text>
        <Text strong>{value}</Text>
      </div>
    </Space>
  );
};

export default UserInfoItem;
