import React from 'react'
import { Layout, Input, Button, Badge, Avatar } from 'antd';
import { MinusOutlined, BorderOutlined, CloseOutlined, SearchOutlined, BellOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'

const { Header } = Layout

const TitleBar: React.FC = () => {
  const handleMinimize = () => {
    window.electron.minimize()
  }

  const handleMaximize = () => {
    window.electron.maximize()
  }

  const handleClose = () => {
    window.electron.close()
  }

  return (
    <Header
      style={{
        height: 60,
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#121212',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        '-webkit-app-region': 'drag'
      }}
    >
      <div style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: '24px' }}>
        <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>抖音</span>
        <Input
          prefix={<SearchOutlined style={{ color: '#666', fontSize: '16px' }} />}
          placeholder="搜索你感兴趣的内容"
          style={{
            width: 300,
            backgroundColor: '#1d1d1d',
            border: 'none',
            borderRadius: '4px',
            height: '36px',
            '-webkit-app-region': 'no-drag'
          }}
        />
      </div>
      <div style={{ '-webkit-app-region': 'no-drag', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Button type="text" icon={<BellOutlined style={{ fontSize: '22px' }} />} style={{ color: '#fff' }} />
        <Badge count={5} style={{ backgroundColor: '#fe2c55' }}>
          <Button type="text" icon={<MailOutlined style={{ fontSize: '22px' }} />} style={{ color: '#fff' }} />
        </Badge>
        <Button 
          type="text" 
          icon={<Avatar size={36} icon={<UserOutlined />} style={{ backgroundColor: '#1d1d1d' }} />} 
          style={{ color: '#fff', padding: 0 }} 
        />
        <div style={{ marginLeft: '16px', display: 'flex', alignItems: 'center' }}>
          <Button
            type="text"
            icon={<MinusOutlined style={{ fontSize: 12 }} />}
            onClick={handleMinimize}
            style={{ color: '#fff', padding: '8px 12px', minWidth: 'auto' }}
          />
          <Button
            type="text"
            icon={<BorderOutlined style={{ fontSize: 12 }} />}
            onClick={handleMaximize}
            style={{ color: '#fff', padding: '8px 12px', minWidth: 'auto' }}
          />
          <Button
            type="text"
            icon={<CloseOutlined style={{ fontSize: 12 }} />}
            onClick={handleClose}
            style={{ color: '#fff', padding: '8px 12px', minWidth: 'auto', ':hover': { backgroundColor: '#ff4d4f' } }}
          />
        </div>
      </div>
    </Header>
  )
}

export default TitleBar