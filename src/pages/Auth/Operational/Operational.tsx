import React from 'react';
import { Card, Row, Col, Typography, Space } from 'antd';
import { DashboardOutlined, BarChartOutlined, SettingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Operational: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Operational Dashboard</Title>
      <Text type="secondary">
        Monitor and manage operational metrics, performance indicators, and system status.
      </Text>
      
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            style={{ textAlign: 'center', height: '200px' }}
            bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}
          >
            <Space direction="vertical" size="large">
              <DashboardOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              <div>
                <Title level={4} style={{ margin: 0 }}>System Status</Title>
                <Text type="secondary">Monitor system health and uptime</Text>
              </div>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            style={{ textAlign: 'center', height: '200px' }}
            bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}
          >
            <Space direction="vertical" size="large">
              <BarChartOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
              <div>
                <Title level={4} style={{ margin: 0 }}>Performance Metrics</Title>
                <Text type="secondary">View operational KPIs and analytics</Text>
              </div>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            style={{ textAlign: 'center', height: '200px' }}
            bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}
          >
            <Space direction="vertical" size="large">
              <SettingOutlined style={{ fontSize: '48px', color: '#fa8c16' }} />
              <div>
                <Title level={4} style={{ margin: 0 }}>Configuration</Title>
                <Text type="secondary">Manage operational settings</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Recent Activity" style={{ minHeight: '300px' }}>
            <Text type="secondary">
              Operational activity logs and recent system events will be displayed here.
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Operational;