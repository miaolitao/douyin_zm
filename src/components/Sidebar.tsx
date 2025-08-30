import React from 'react'
import { Layout, Menu, Avatar, Button } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import type { MenuProps } from 'antd'
import {
  HomeOutlined,
  FireOutlined,
  HeartOutlined,
  UserOutlined,
  PlaySquareOutlined,
  CustomerServiceOutlined,
  CoffeeOutlined,
  ReadOutlined,
  TrophyOutlined,
  VideoCameraOutlined,
  PlusOutlined,
  SearchOutlined,
  ExperimentOutlined,
  SettingOutlined
} from '@ant-design/icons'

const { Sider } = Layout

const Sidebar: React.FC = () => {
  const location = useLocation()

  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <HomeOutlined style={{ fontSize: '24px', color: '#fff' }} />,
      label: <Link to="/" style={{ fontSize: '16px', fontWeight: 500, color: '#fff', textDecoration: 'none' }}>首页</Link>
    },
    {
      key: '/featured',
      icon: <FireOutlined style={{ fontSize: '24px', color: '#fff' }} />,
      label: <Link to="/featured" style={{ fontSize: '16px', fontWeight: 500, color: '#fff', textDecoration: 'none' }}>热门</Link>
    },
    {
      key: '/follow',
      icon: <HeartOutlined style={{ fontSize: '24px', color: '#fff' }} />,
      label: <Link to="/follow" style={{ fontSize: '16px', fontWeight: 500, color: '#fff', textDecoration: 'none' }}>关注</Link>
    },
    {
      key: '/friend',
      icon: <UserOutlined style={{ fontSize: '24px', color: '#fff' }} />,
      label: <Link to="/friend" style={{ fontSize: '16px', fontWeight: 500, color: '#fff', textDecoration: 'none' }}>朋友</Link>
    },
    { type: 'divider', style: { background: 'rgba(255, 255, 255, 0.1)', margin: '16px 0' } },
    {
      key: '/demo',
      icon: <ExperimentOutlined style={{ fontSize: '20px', color: '#ff0050' }} />,
      label: <Link to="/demo" style={{ fontSize: '15px', color: '#ff0050', fontWeight: 600 }}>演示页面</Link>
    },
    {
      key: '/game',
      icon: <PlaySquareOutlined style={{ fontSize: '20px', color: '#888' }} />,
      label: <Link to="/game" style={{ fontSize: '14px', color: '#888' }}>游戏</Link>
    },
    {
      key: '/anime',
      icon: <PlaySquareOutlined style={{ fontSize: '20px', color: '#888' }} />,
      label: <Link to="/anime" style={{ fontSize: '14px', color: '#888' }}>二次元</Link>
    },
    {
      key: '/music',
      icon: <CustomerServiceOutlined style={{ fontSize: '20px', color: '#888' }} />,
      label: <Link to="/music" style={{ fontSize: '14px', color: '#888' }}>音乐</Link>
    },
    {
      key: '/food',
      icon: <CoffeeOutlined style={{ fontSize: '20px', color: '#888' }} />,
      label: <Link to="/food" style={{ fontSize: '14px', color: '#888' }}>美食</Link>
    },
    {
      key: '/knowledge',
      icon: <ReadOutlined style={{ fontSize: '20px', color: '#888' }} />,
      label: <Link to="/knowledge" style={{ fontSize: '14px', color: '#888' }}>知识</Link>
    },
    {
      key: '/sports',
      icon: <TrophyOutlined style={{ fontSize: '20px', color: '#888' }} />,
      label: <Link to="/sports" style={{ fontSize: '14px', color: '#888' }}>体育</Link>
    },
    { type: 'divider', style: { background: 'rgba(255, 255, 255, 0.1)', margin: '12px 0' } },
    {
      key: '/settings',
      icon: <SettingOutlined style={{ fontSize: '20px', color: '#ff0050' }} />,
      label: <Link to="/settings" style={{ fontSize: '14px', color: '#ff0050', fontWeight: 500 }}>设置</Link>
    }
  ]

  return (
    <Sider
      width={240}
      style={{
        backgroundColor: '#000000',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '20px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 搜索框 */}
      <div style={{ padding: '0 20px 20px' }}>
        <Button 
          icon={<SearchOutlined />} 
          style={{ 
            width: '100%', 
            height: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#888',
            borderRadius: '20px',
            textAlign: 'left'
          }}
        >
          搜索视频和用户
        </Button>
      </div>

      {/* 菜单 */}
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{
          height: '100%',
          borderRight: 0,
          backgroundColor: 'transparent',
          padding: '0 12px',
          flex: 1
        }}
        items={menuItems}
      />

      {/* 底部用户信息 */}
      <div style={{ 
        padding: '20px', 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        marginTop: 'auto'
      }}>
        <Link to="/profile" style={{ textDecoration: 'none' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '12px',
            padding: '8px',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          className="user-info-hover"
          >
            <Avatar 
              size={40} 
              src="https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_724c0d4aa68cf5c9c275e3bf3949f029.jpeg?card_type=303&column_n=0&from=327834062" 
              style={{ 
                marginRight: '12px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
            />
            <div>
              <div style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>我的抖音</div>
              <div style={{ color: '#888', fontSize: '12px' }}>查看个人资料</div>
            </div>
          </div>
        </Link>
        <Button 
          icon={<PlusOutlined />} 
          style={{ 
            width: '100%', 
            height: '36px',
            backgroundColor: '#ff0050',
            border: 'none',
            color: '#fff',
            borderRadius: '18px',
            fontWeight: 500
          }}
        >
          上传视频
        </Button>
      </div>
    </Sider>
  )
}

export default Sidebar