import React from 'react';
import { Space } from 'antd';
import { StarOutlined } from '@ant-design/icons';

const StarRating = ({ rating, totalReviews, starSize = 16, style = {} }) => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  return (
    <Space style={{ display: 'flex', color: '#faad14', ...style }}>
      {[...Array(fullStars)].map((_, i) => (
        <StarOutlined key={`full-${i}`} style={{ fontSize: starSize }} />
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <StarOutlined key={`empty-${i}`} style={{ fontSize: starSize, opacity: 0.3 }} />
      ))}
      {totalReviews !== undefined && (
        <span style={{ fontSize: '15px', fontWeight: 'bold', marginLeft: '4px' }}>
          {rating.toFixed(1)} ({totalReviews} reviews)
        </span>
      )}
    </Space>
  );
};

export default StarRating;
