import React from 'react';
import { Space, Typography } from 'antd';

const { Title } = Typography;

const CardHeader = ({ icon, title, level = 3, className = "", statusTag }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }} className={className}>
      <Space size="middle">
        {icon}
        <Title level={level} style={{ margin: 0 }}>
          {title}
        </Title>
      </Space>
      {statusTag && <div>{statusTag}</div>}
    </div>
  );
};

export default CardHeader;
