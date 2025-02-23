import React, { useState, useEffect, useRef } from 'react'
import { Layout, Card, Avatar, Button, Row, Col, Tabs } from 'antd'
import { HeartOutlined, MessageOutlined, ShareAltOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { categories, sampleVideos } from '../data/videos'
import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [currentCategory, setCurrentCategory] = useState('全部')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const pageSize = 12

  const filteredVideos = currentCategory === '全部'
    ? sampleVideos
    : sampleVideos.filter(video => video.category === currentCategory)

  const displayedVideos = filteredVideos.slice(0, currentPage * pageSize)

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category)
    setCurrentPage(1)
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
    <Layout style={{ backgroundColor: '#121212', height: '100%', overflow: 'hidden' }}>
      <div
        ref={containerRef}
        style={{ padding: '24px', height: '100%', overflowY: 'auto', position: 'relative' }}
      >
        <Tabs
          activeKey={currentCategory}
          onChange={handleCategoryChange}
          items={categories.map(category => ({
            key: category,
            label: category,
          }))}
          style={{ marginBottom: '24px' }}
        />
        <Row gutter={[16, 16]}>
          {displayedVideos.map(video => (
            <Col key={video.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                onClick={() => navigate(`/video/${video.id}`)}
                cover={
                  <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                    <img
                      alt={video.title}
                      src={video.poster}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <PlayCircleOutlined
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '48px',
                        color: 'rgba(255, 255, 255, 0.8)'
                      }}
                    />
                  </div>
                }
                bodyStyle={{ padding: '16px', backgroundColor: '#1d1d1d' }}
                style={{ backgroundColor: '#1d1d1d', border: 'none' }}
              >
                <Card.Meta
                  avatar={<Avatar src={video.author.avatar} />}
                  title={<span style={{ color: '#fff' }}>{video.title}</span>}
                  description={<span style={{ color: '#999' }}>{video.author.name}</span>}
                />
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-around' }}>
                  <Button type="text" icon={<HeartOutlined style={{ color: '#fff' }} />} style={{ color: '#fff' }}>{video.likes}</Button>
                  <Button type="text" icon={<MessageOutlined style={{ color: '#fff' }} />} style={{ color: '#fff' }}>{video.comments}</Button>
                  <Button type="text" icon={<ShareAltOutlined style={{ color: '#fff' }} />} style={{ color: '#fff' }}>{video.shares}</Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        {loading && (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <span style={{ color: '#fff' }}>加载中...</span>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Home