import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Layout, 
  Tabs, 
  Card, 
  Avatar, 
  Button, 
  Row, 
  Col, 
  Space, 
  Tag, 
  Badge,
  message
} from 'antd'
import {
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  ShareAltOutlined,
  PlayCircleOutlined,
  UserOutlined,
  VerifiedOutlined,
  UserAddOutlined,
  MoreOutlined
} from '@ant-design/icons'
import { sampleVideos, categories } from '../data/videos'
import './Home.css'

const { Content } = Layout

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [currentCategory, setCurrentCategory] = useState('全部')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [videoList, setVideoList] = useState(sampleVideos)
  const containerRef = useRef<HTMLDivElement>(null)
  const pageSize = 12

  const filteredVideos = currentCategory === '全部'
    ? videoList
    : videoList.filter(video => video.category === currentCategory)

  const displayedVideos = filteredVideos.slice(0, currentPage * pageSize)

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category)
    setCurrentPage(1)
  }

  const handleLike = (videoId: string) => {
    setVideoList(prev => prev.map(video => 
      video.id === videoId 
        ? { ...video, isLiked: !video.isLiked, likes: video.isLiked ? video.likes - 1 : video.likes + 1 }
        : video
    ))
  }

  const handleFollow = (videoId: string) => {
    setVideoList(prev => prev.map(video => 
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
    <Layout className="douyin-home-layout">
      <Content className="douyin-content">
        <div
          ref={containerRef}
          className="video-container"
        >
          {/* 分类标签 */}
          <div className="category-tabs">
            <Tabs
              activeKey={currentCategory}
              onChange={handleCategoryChange}
              items={categories.map(category => ({
                key: category,
                label: (
                  <span className="category-tab-label">
                    {category}
                  </span>
                ),
              }))}
              className="category-tabs-component"
            />
          </div>

          {/* 视频网格 */}
          <Row gutter={[24, 24]} className="video-grid">
            {displayedVideos.map(video => (
              <Col key={video.id} xs={24} sm={12} md={8} lg={6} xl={4}>
                <Card
                  hoverable
                  onClick={() => navigate(`/video/${video.id}`)}
                  cover={
                    <div className="video-cover">
                      <img
                        alt={video.title}
                        src={video.poster}
                        className="video-poster"
                      />
                      <PlayCircleOutlined className="play-icon" />
                      <div className="video-duration">
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                  }
                  className="video-card"
                >
                  {/* 视频信息 */}
                  <div className="video-info">
                    <div className="video-title">
                      {video.title}
                    </div>
                    
                    {/* 标签 */}
                    {video.hashtags && video.hashtags.length > 0 && (
                      <Space size={[0, 8]} wrap className="video-tags">
                        {video.hashtags.slice(0, 2).map((tag, index) => (
                          <Tag 
                            key={index}
                            className="video-tag"
                          >
                            #{tag}
                          </Tag>
                        ))}
                      </Space>
                    )}
                  </div>

                  {/* 作者信息 */}
                  <div className="author-info">
                    <div className="author-details">
                      <Avatar 
                        src={video.author.avatar} 
                        size={28}
                        className="author-avatar"
                      />
                      <div className="author-text">
                        <div className="author-name">
                          <span>{video.author.name}</span>
                          {video.author.verified && (
                            <Badge 
                              count={<VerifiedOutlined style={{ fontSize: '8px', color: '#fff' }} />}
                              className="verified-badge"
                            />
                          )}
                        </div>
                        <div className="author-followers">
                          {(video.author.followers / 10000).toFixed(1)}万粉丝
                        </div>
                      </div>
                    </div>
                    <Button
                      type="text"
                      icon={video.isFollowed ? <VerifiedOutlined /> : <UserAddOutlined />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFollow(video.id)
                      }}
                      className={`follow-button ${video.isFollowed ? 'followed' : ''}`}
                    />
                  </div>

                  {/* 互动按钮 */}
                  <div className="interaction-buttons">
                    <div className="left-buttons">
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
                        className="interaction-button like-button"
                      >
                        <span>{(video.likes / 1000).toFixed(1)}k</span>
                      </Button>
                      <Button
                        type="text"
                        icon={<MessageOutlined style={{ color: '#fff' }} />}
                        className="interaction-button comment-button"
                      >
                        <span>{(video.comments / 1000).toFixed(1)}k</span>
                      </Button>
                      <Button
                        type="text"
                        icon={<ShareAltOutlined style={{ color: '#fff' }} />}
                        className="interaction-button share-button"
                      >
                        <span>{(video.shares / 1000).toFixed(1)}k</span>
                      </Button>
                    </div>
                    <Button
                      type="text"
                      icon={<MoreOutlined style={{ color: '#888' }} />}
                      className="more-button"
                    />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* 加载状态 */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner" />
              <span className="loading-text">加载中...</span>
            </div>
          )}
        </div>
      </Content>
    </Layout>
  )
}

export default Home