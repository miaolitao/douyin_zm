import React from 'react'
import { Layout, Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import {
  HomeOutlined,
  RobotOutlined,
  PlaySquareOutlined,
  CustomerServiceOutlined,
  CoffeeOutlined,
  ReadOutlined,
  TrophyOutlined,
  UserOutlined,
  TeamOutlined,
  VideoCameraOutlined
} from '@ant-design/icons'

const { Sider } = Layout

const Sidebar: React.FC = () => {
  const location = useLocation()

  const menuItems = [
    {
      key: 'featured',
      icon: <VideoCameraOutlined style={{ fontSize: '22px' }} />,
      label: <span style={{ fontSize: '16px', fontWeight: 500 }}>精选</span>
    },
    {
      key: 'recommend',
      icon: <HomeOutlined style={{ fontSize: '22px' }} />,
      label: <span style={{ fontSize: '16px', fontWeight: 500 }}>推荐</span>
    },
    {
      key: 'follow',
      icon: <TeamOutlined style={{ fontSize: '22px' }} />,
      label: <span style={{ fontSize: '16px', fontWeight: 500 }}>关注</span>
    },
    {
      key: 'friend',
      icon: <UserOutlined style={{ fontSize: '22px' }} />,
      label: <span style={{ fontSize: '16px', fontWeight: 500 }}>朋友</span>
    },
    { type: 'divider', style: { background: 'rgba(255, 255, 255, 0.08)', margin: '12px 0' } },
    {
      key: '/',
      icon: <HomeOutlined style={{ fontSize: '20px' }} />,
      label: <Link to="/" style={{ fontSize: '15px', color: '#fff' }}>首页</Link>
    },
    {
      key: '/game',
      icon: <RobotOutlined style={{ fontSize: '20px' }} />,
      label: <Link to="/game" style={{ fontSize: '15px', color: '#fff' }}>游戏</Link>
    },
    {
      key: '/anime',
      icon: <PlaySquareOutlined style={{ fontSize: '20px' }} />,
      label: <Link to="/anime" style={{ fontSize: '15px', color: '#fff' }}>二次元</Link>
    },
    {
      key: '/music',
      icon: <CustomerServiceOutlined style={{ fontSize: '20px' }} />,
      label: <Link to="/music" style={{ fontSize: '15px', color: '#fff' }}>音乐</Link>
    },
    {
      key: '/food',
      icon: <CoffeeOutlined style={{ fontSize: '20px' }} />,
      label: <Link to="/food" style={{ fontSize: '15px', color: '#fff' }}>美食</Link>
    },
    {
      key: '/knowledge',
      icon: <ReadOutlined style={{ fontSize: '20px' }} />,
      label: <Link to="/knowledge" style={{ fontSize: '15px', color: '#fff' }}>知识</Link>
    },
    {
      key: '/sports',
      icon: <TrophyOutlined style={{ fontSize: '20px' }} />,
      label: <Link to="/sports" style={{ fontSize: '15px', color: '#fff' }}>体育</Link>
    }
  ]

  return (
    <Sider
      width={220}
      style={{
        backgroundColor: '#121212',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '16px'
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{
          height: '100%',
          borderRight: 0,
          backgroundColor: 'transparent',
          padding: '0 12px'
        }}
        items={menuItems}
      />
    </Sider>
  )
}

export default Sidebar