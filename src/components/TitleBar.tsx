import React, { useState } from 'react'
import { Layout, Button, Input, Avatar, Badge } from 'antd'
import { useNavigate } from 'react-router-dom'
import { 
  SearchOutlined, 
  BellOutlined, 
  MessageOutlined, 
  PlusOutlined,
  CloseOutlined,
  MinusOutlined,
  BorderOutlined
} from '@ant-design/icons'
import SearchModal from './SearchModal'

const { Header } = Layout

const TitleBar: React.FC = () => {
  const [searchModalVisible, setSearchModalVisible] = useState(false)
  const navigate = useNavigate()

  const handleLogoClick = () => {
    navigate('/')
  }

  return (
    <>
      <Header
        style={{
          height: '60px',
          backgroundColor: '#000000',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          WebkitAppRegion: 'drag'
        }}
      >
        {/* 左侧Logo和搜索 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Logo */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              cursor: 'pointer',
              WebkitAppRegion: 'no-drag',
              padding: '4px 8px',
              borderRadius: '8px',
              transition: 'background-color 0.2s ease'
            }}
            onClick={handleLogoClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#ff0050',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '18px',
              fontWeight: 'bold',
              transition: 'transform 0.2s ease'
            }}>
              抖
            </div>
            <span style={{ 
              color: '#fff', 
              fontSize: '20px', 
              fontWeight: 'bold',
              marginLeft: '8px',
              transition: 'color 0.2s ease'
            }}>
              抖音
            </span>
          </div>

          {/* 搜索框 */}
          <div style={{ position: 'relative' }}>
            <Input
              placeholder="搜索视频、用户、音乐"
              prefix={<SearchOutlined style={{ color: '#888' }} />}
              style={{
                width: '300px',
                height: '36px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '18px',
                color: '#fff',
                WebkitAppRegion: 'no-drag',
                cursor: 'pointer'
              }}
              readOnly
              onClick={() => setSearchModalVisible(true)}
            />
          </div>
        </div>

        {/* 右侧操作按钮 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', WebkitAppRegion: 'no-drag' }}>
          {/* 通知 */}
          <Badge count={3} size="small">
            <Button
              type="text"
              icon={<BellOutlined style={{ fontSize: '20px', color: '#fff' }} />}
              style={{ 
                width: '40px', 
                height: '40px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '20px'
              }}
            />
          </Badge>

          {/* 消息 */}
          <Badge count={5} size="small">
            <Button
              type="text"
              icon={<MessageOutlined style={{ fontSize: '20px', color: '#fff' }} />}
              style={{ 
                width: '40px', 
                height: '40px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '20px'
              }}
            />
          </Badge>

          {/* 上传按钮 */}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{
              height: '36px',
              backgroundColor: '#ff0050',
              border: 'none',
              borderRadius: '18px',
              fontWeight: 500
            }}
          >
            上传
          </Button>

          {/* 用户头像 */}
          <Avatar
            size={36}
            src="https://via.placeholder.com/36x36/ff0050/ffffff?text=U"
            style={{ cursor: 'pointer' }}
          />

          {/* 窗口控制按钮 */}
          <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
            <Button
              type="text"
              icon={<MinusOutlined style={{ color: '#888' }} />}
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '16px'
              }}
            />
            <Button
              type="text"
              icon={<BorderOutlined style={{ color: '#888' }} />}
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '16px'
              }}
            />
            <Button
              type="text"
              icon={<CloseOutlined style={{ color: '#888' }} />}
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '16px'
              }}
            />
          </div>
        </div>
      </Header>

      {/* 搜索模态框 */}
      <SearchModal 
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
      />
    </>
  )
}

export default TitleBar