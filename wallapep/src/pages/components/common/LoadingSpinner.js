import React from 'react';
import { Spin, Row, Col } from 'antd';

const LoadingSpinner = ({ tip = "Cargando...", size = "large" }) => {
  return (
    <Row align="middle" justify="center" style={{ textAlign: 'center', padding: '50px' }}>
      <Col>
        <Spin size={size} tip={tip} />
      </Col>
    </Row>
  );
};

export default LoadingSpinner;
