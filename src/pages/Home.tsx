import React, { useState, useEffect, useRef } from 'react'
import { Layout, Card, Avatar, Button, Row, Col, Tabs, Tag, Space, Badge } from 'antd'
import { 
  HeartOutlined, 
  HeartFilled,
  MessageOutlined, 
  ShareAltOutlined, 
  PlayCircleOutlined,
  UserAddOutlined,
  MoreOutlined,
  CheckOutlined
} from '@ant-design/icons'
import { categories, sampleVideos } from '../data/videos'
import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [currentCategory, setCurrentCategory] = useState('全部')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [videos, setVideos] = useState(sampleVideos)
  const containerRef = useRef<HTMLDivElement>(null)
  const pageSize = 12

  const filteredVideos = currentCategory === '全部'
    ? videos
    : videos.filter(video => video.category === currentCategory)

  const displayedVideos = filteredVideos.slice(0, currentPage * pageSize)

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category)
    setCurrentPage(1)
  }

  const handleLike = (videoId: string) => {
    setVideos(prev => prev.map(video => 
      video.id === videoId 
        ? { ...video, isLiked: !video.isLiked, likes: video.isLiked ? video.likes - 1 : video.likes + 1 }
        : video
    ))
  }

  const handleFollow = (videoId: string) => {
    setVideos(prev => prev.map(video => 
      video.id === videoId 
        ? { ...video, isFollowed: !video.isFollowed }
        : video
    ))
  }

  const handleScroll = () => {
    if (!containerRef.current || loading) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      if (currentPage * pageSize < filteredVideos.length) {
        setLoading(true)
        setTimeout(() => {
          setCurrentPage(prev => prev + 1)
          setLoading(false)
        }, 500)
      }
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [loading, currentCategory])

  return (
    <Layout style={{ backgroundColor: '#000000', height: '100%', overflow: 'hidden' }}>
      <div
        ref={containerRef}
        style={{ padding: '24px', height: '100%', overflowY: 'auto', position: 'relative' }}
      >
        {/* 分类标签 */}
        <div style={{ marginBottom: '32px' }}>
          <Tabs
            activeKey={currentCategory}
            onChange={handleCategoryChange}
            items={categories.map(category => ({
              key: category,
              label: (
                <span style={{ 
                  color: currentCategory === category ? '#fff' : '#888',
                  fontSize: '16px',
                  fontWeight: currentCategory === category ? 600 : 400
                }}>
                  {category}
                </span>
              ),
            }))}
            style={{ 
              marginBottom: '24px',
              '& .ant-tabs-tab': {
                backgroundColor: 'transparent',
                border: 'none'
              }
            }}
            tabBarStyle={{
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: 0
            }}
            tabBarGutter={32}
          />
        </div>

        {/* 视频网格 */}
        <Row gutter={[24, 24]}>
          {displayedVideos.map(video => (
            <Col key={video.id} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                hoverable
                onClick={() => navigate(`/video/${video.id}`)}
                cover={
                  <div style={{ position: 'relative', paddingTop: '133%', overflow: 'hidden' }}>
                    <img
                      alt={video.title}
                      src={video.poster}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    />
                    <PlayCircleOutlined
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '48px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>
                      {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                }
                bodyStyle={{ 
                  padding: '16px', 
                  backgroundColor: '#000000',
                  border: 'none'
                }}
                style={{ 
                  backgroundColor: '#000000', 
                  border: 'none',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              >
                {/* 视频信息 */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ 
                    color: '#fff', 
                    fontSize: '14px', 
                    fontWeight: 500,
                    lineHeight: '1.4',
                    marginBottom: '8px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {video.title}
                  </div>
                  
                  {/* 标签 */}
                  <Space size={[0, 8]} wrap style={{ marginBottom: '12px' }}>
                    {video.tags?.slice(0, 2).map((tag, index) => (
                      <Tag 
                        key={index}
                        style={{
                          backgroundColor: 'rgba(255, 0, 80, 0.2)',
                          border: '1px solid rgba(255, 0, 80, 0.3)',
                          color: '#ff0050',
                          borderRadius: '12px',
                          fontSize: '11px',
                          padding: '2px 8px'
                        }}
                      >
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                </div>

                {/* 作者信息 */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Avatar 
                      src={video.author.avatar} 
                      size={28}
                      style={{ border: '2px solid rgba(255, 255, 255, 0.2)' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: '#fff', fontSize: '12px', fontWeight: 500 }}>
                          {video.author.name}
                        </span>
                        {video.author.verified && (
                          <Badge 
                            count={<CheckOutlined style={{ fontSize: '8px', color: '#fff' }} />}
                            style={{ backgroundColor: '#ff0050' }}
                          />
                        )}
                      </div>
                      <div style={{ color: '#888', fontSize: '11px' }}>
                        {(video.author.followers / 10000).toFixed(1)}万粉丝
                      </div>
                    </div>
                  </div>
                  <Button
                    type="text"
                    icon={video.isFollowed ? <CheckOutlined /> : <UserAddOutlined />}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFollow(video.id)
                    }}
                    style={{
                      width: '28px',
                      height: '28px',
                      backgroundColor: video.isFollowed ? '#ff0050' : 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: '14px',
                      color: '#fff',
                      padding: 0
                    }}
                  />
                </div>

                {/* 互动按钮 */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <Button
                      type="text"
                      icon={
                        video.isLiked ? 
                        <HeartFilled style={{ color: '#ff0050' }} /> : 
                        <HeartOutlined style={{ color: '#fff' }} />
                      }
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLike(video.id)
                      }}
                      style={{ 
                        color: '#fff',
                        padding: '4px 8px',
                        height: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>
                        {(video.likes / 1000).toFixed(1)}k
                      </span>
                    </Button>
                    <Button
                      type="text"
                      icon={<MessageOutlined style={{ color: '#fff' }} />}
                      style={{ 
                        color: '#fff',
                        padding: '4px 8px',
                        height: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>
                        {(video.comments / 1000).toFixed(1)}k
                      </span>
                    </Button>
                    <Button
                      type="text"
                      icon={<ShareAltOutlined style={{ color: '#fff' }} />}
                      style={{ 
                        color: '#fff',
                        padding: '4px 8px',
                        height: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>
                        {(video.shares / 1000).toFixed(1)}k
                      </span>
                    </Button>
                  </div>
                  <Button
                    type="text"
                    icon={<MoreOutlined style={{ color: '#888' }} />}
                    style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#888',
                      padding: 0
                    }}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 加载状态 */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              border: '3px solid rgba(255, 0, 80, 0.3)',
              borderTop: '3px solid #ff0050',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            <span style={{ color: '#888', fontSize: '14px' }}>加载中...</span>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  )
}

export default Home