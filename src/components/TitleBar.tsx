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
  BorderOutlined,
  DesktopOutlined
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
          backgroundColor: 'var(--douyin-bg-main)',
          borderBottom: '1px solid var(--douyin-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          WebkitAppRegion: 'drag',
          position: 'relative',
          zIndex: 100
        } as any}
      >
        {/* 左侧Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              cursor: 'pointer',
              WebkitAppRegion: 'no-drag',
            } as any}
            onClick={handleLogoClick}
          >
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #fe2c55 0%, #ff0050 50%, #e91e63 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '18px',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(254, 44, 85, 0.3)'
            }}>
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M36 14L36 11C36 9.89543 35.1046 9 34 9L14 9C12.8954 9 12 9.89543 12 11L12 37C12 38.1046 12.8954 39 14 39L34 39C35.1046 39 36 38.1046 36 37L36 34" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24 19L24 29" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 23L24 19L28 23" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ 
              color: '#fff', 
              fontSize: '20px', 
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}>
              抖音
            </span>
          </div>
        </div>

        {/* 中间搜索框 (可选，如果侧边栏已有搜索，这里可以放其他内容，或者保留作为全局搜索) */}
        {/* 抖音PC版顶部通常是空的或者有搜索，这里保留搜索但样式微调 */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', WebkitAppRegion: 'no-drag' } as any}>
          {/* 
          <Input
            placeholder="搜索你感兴趣的内容"
            prefix={<SearchOutlined style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '16px' }} />}
            style={{
              width: '400px',
              height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
            readOnly
            onClick={() => setSearchModalVisible(true)}
          />
          */}
        </div>

        {/* 右侧操作按钮 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', WebkitAppRegion: 'no-drag' } as any}>
          <Button
            type="text"
            icon={<DesktopOutlined style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 0.6)' }} />}
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            客户端
          </Button>

          <div style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

          {/* 消息 */}
          <Badge count={5} size="small" offset={[-4, 4]}>
            <Button
              type="text"
              icon={<MessageOutlined style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 0.6)' }} />}
              style={{ 
                width: '40px', 
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
          </Badge>

          {/* 投稿按钮 */}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{
              height: '36px',
              borderRadius: '4px',
              padding: '0 20px',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            投稿
          </Button>

          {/* 用户头像 */}
          <Avatar
            size={32}
            src="https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_724c0d4aa68cf5c9c275e3bf3949f029.jpeg?card_type=303&column_n=0&from=327834062"
            style={{ 
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          />

          {/* 窗口控制按钮 */}
          <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
            <Button
              type="text"
              icon={<MinusOutlined style={{ color: '#888' }} />}
              style={{ width: '32px', height: '32px' }}
            />
            <Button
              type="text"
              icon={<BorderOutlined style={{ color: '#888' }} />}
              style={{ width: '32px', height: '32px' }}
            />
            <Button
              type="text"
              icon={<CloseOutlined style={{ color: '#888' }} />}
              style={{ width: '32px', height: '32px' }}
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