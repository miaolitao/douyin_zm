import React from 'react'
import { Card, Button, Avatar, Tag, Space, Row, Col, Typography } from 'antd'
import { 
  HeartOutlined, 
  HeartFilled,
  MessageOutlined, 
  ShareAltOutlined, 
  PlayCircleOutlined,
  UserAddOutlined,
  FireOutlined,
  StarOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

const Demo: React.FC = () => {
  const [liked, setLiked] = React.useState(false)

  return (
    <div style={{ 
      padding: '24px', 
      backgroundColor: '#000000', 
      minHeight: '100vh'
    }}>
      {/* 头部介绍 */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '48px',
        padding: '32px 0'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          background: 'linear-gradient(45deg, #ff0050, #ff6b35)',
          borderRadius: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: '48px',
          fontWeight: 'bold',
          margin: '0 auto 24px'
        }}>
          抖
        </div>
        <Title level={1} style={{ color: '#ffffff', marginBottom: '16px' }}>
          抖音桌面端应用
        </Title>
        <Text style={{ color: '#888888', fontSize: '18px' }}>
          一比一还原抖音UI样式，提供原生桌面体验
        </Text>
      </div>

      {/* 特色功能 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '48px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              textAlign: 'center'
            }}
          >
            <FireOutlined style={{ fontSize: '48px', color: '#ff0050', marginBottom: '16px' }} />
            <Title level={4} style={{ color: '#ffffff', marginBottom: '8px' }}>热门推荐</Title>
            <Text style={{ color: '#888888' }}>智能算法推荐最热门的内容</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              textAlign: 'center'
            }}
          >
            <StarOutlined style={{ fontSize: '48px', color: '#ff6b35', marginBottom: '16px' }} />
            <Title level={4} style={{ color: '#ffffff', marginBottom: '8px' }}>精选内容</Title>
            <Text style={{ color: '#888888' }}>海量优质短视频内容</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              textAlign: 'center'
            }}
          >
            <UserAddOutlined style={{ fontSize: '48px', color: '#00d4ff', marginBottom: '16px' }} />
            <Title level={4} style={{ color: '#ffffff', marginBottom: '8px' }}>社交互动</Title>
            <Text style={{ color: '#888888' }}>点赞、评论、分享功能</Text>
          </Card>
        </Col>
      </Row>

      {/* 底部信息 */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '48px',
        padding: '32px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Text style={{ color: '#888888', fontSize: '14px' }}>
          抖音桌面端应用 - 记录美好生活，分享精彩瞬间
        </Text>
        <br />
        <Text style={{ color: '#666666', fontSize: '12px' }}>
          Powered by Electron + React + TypeScript + Ant Design
        </Text>
      </div>
    </div>
  )
}

export default Demo
