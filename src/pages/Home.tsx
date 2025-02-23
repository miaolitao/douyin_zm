import React, { useState } from 'react'
import { Layout, Card, Avatar, Button, Row, Col, Tabs, Pagination } from 'antd'
import { HeartOutlined, MessageOutlined, ShareAltOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { categories, sampleVideos } from '../data/videos'
import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [currentCategory, setCurrentCategory] = useState('全部')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  const filteredVideos = currentCategory === '全部'
    ? sampleVideos
    : sampleVideos.filter(video => video.category === currentCategory)

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <Layout style={{ backgroundColor: '#121212', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '24px', height: '100%', overflowY: 'auto', position: 'relative' }}>
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
          {filteredVideos.slice((currentPage - 1) * pageSize, currentPage * pageSize).map(video => (
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
        <div style={{ textAlign: 'center', marginTop: '24px', marginBottom: '24px' }}>
          <Pagination
            current={currentPage}
            total={filteredVideos.length}
            pageSize={pageSize}
            onChange={handlePageChange}
            style={{ color: '#fff' }}
          />
        </div>
      </div>
    </Layout>
  )
}

export default Home