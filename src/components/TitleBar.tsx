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
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          WebkitAppRegion: 'drag',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          position: 'relative',
          zIndex: 100
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
              width: '30px',
              height: '30px',
              background: 'linear-gradient(135deg, #fe2c55 0%, #ff0050 50%, #e91e63 100%)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(254, 44, 85, 0.3)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              抖
            </div>
            <span style={{ 
              color: '#fff', 
              fontSize: '18px', 
              fontWeight: '600',
              marginLeft: '8px',
              letterSpacing: '0.5px',
              transition: 'color 0.2s ease'
            }}>
              抖音
            </span>
          </div>

          {/* 搜索框 */}
          <div style={{ position: 'relative' }}>
            <Input
              placeholder="搜索视频、用户、话题"
              prefix={<SearchOutlined style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '16px' }} />}
              style={{
                width: '320px',
                height: '36px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '18px',
                color: '#fff',
                WebkitAppRegion: 'no-drag',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              readOnly
              onClick={() => setSearchModalVisible(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              }}
            />
          </div>
        </div>

        {/* 右侧操作按钮 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', WebkitAppRegion: 'no-drag' }}>
          {/* 通知 */}
          <Badge count={3} size="small" style={{ 
            color: '#fe2c55',
            backgroundColor: '#fe2c55' 
          }}>
            <Button
              type="text"
              icon={<BellOutlined style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.8)' }} />}
              style={{ 
                width: '36px', 
                height: '36px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '18px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            />
          </Badge>

          {/* 消息 */}
          <Badge count={5} size="small" style={{ 
            color: '#fe2c55',
            backgroundColor: '#fe2c55' 
          }}>
            <Button
              type="text"
              icon={<MessageOutlined style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.8)' }} />}
              style={{ 
                width: '36px', 
                height: '36px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '18px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            />
          </Badge>

          {/* 上传按钮 */}
          <Button
            type="primary"
            icon={<PlusOutlined style={{ fontSize: '14px' }} />}
            style={{
              height: '32px',
              background: 'linear-gradient(135deg, #fe2c55 0%, #ff0050 100%)',
              border: 'none',
              borderRadius: '16px',
              fontWeight: '500',
              fontSize: '13px',
              padding: '0 16px',
              boxShadow: '0 2px 8px rgba(254, 44, 85, 0.3)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(254, 44, 85, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(254, 44, 85, 0.3)'
            }}
          >
            上传
          </Button>

          {/* 用户头像 */}
          <Avatar
            size={32}
            src="https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_724c0d4aa68cf5c9c275e3bf3949f029.jpeg?card_type=303&column_n=0&from=327834062"
            style={{ 
              cursor: 'pointer',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(254, 44, 85, 0.5)'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
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