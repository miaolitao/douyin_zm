import React, { useState } from 'react'
import { Layout, Avatar, Button, Row, Col, Card, Tabs, Tag, Statistic, Divider } from 'antd'
import { 
  EditOutlined, 
  SettingOutlined, 
  HeartOutlined,
  MessageOutlined,
  ShareAltOutlined,
  PlayCircleOutlined,
  UserAddOutlined,
  CheckOutlined
} from '@ant-design/icons'
import { currentUser } from '../data/videos'
import { useVideoData } from '../hooks/useVideoData'
import LoadingState from '../components/LoadingState'

const { Content } = Layout

const Profile: React.FC = () => {
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState('videos')

  // 使用统一的视频数据Hook
  const { videos, loading, error, refetch } = useVideoData()

  const userVideos = videos.filter(video => video.author.id === 'current_user')
  const likedVideos = videos.filter(video => video.isLiked)

  return (
    <Layout style={{ backgroundColor: '#000000', height: '100%', overflow: 'auto' }}>
      <Content style={{ padding: '24px' }}>
        {/* 用户信息头部 */}
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.05)', 
          borderRadius: '16px', 
          padding: '32px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Row gutter={24}>
            <Col>
              <Avatar
                size={120}
                src={currentUser.avatar}
                style={{ border: '4px solid rgba(255, 0, 80, 0.3)' }}
              />
            </Col>
            <Col flex={1}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <h1 style={{ color: '#fff', margin: 0, fontSize: '28px' }}>
                  {currentUser.name}
                </h1>
                {currentUser.verified && (
                  <Badge 
                    count={<CheckOutlined style={{ fontSize: '12px', color: '#fff' }} />}
                    style={{ backgroundColor: '#ff0050' }}
                  />
                )}
              </div>
              
              <p style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>
                {currentUser.description}
              </p>

              <Row gutter={24} style={{ marginBottom: '24px' }}>
                <Col>
                  <Statistic
                    title="关注"
                    value={currentUser.following}
                    valueStyle={{ color: '#fff', fontSize: '20px' }}
                    suffix={<span style={{ color: '#888', fontSize: '14px' }}>人</span>}
                  />
                </Col>
                <Col>
                  <Statistic
                    title="粉丝"
                    value={currentUser.followers}
                    valueStyle={{ color: '#fff', fontSize: '20px' }}
                    suffix={<span style={{ color: '#888', fontSize: '14px' }}>人</span>}
                  />
                </Col>
                <Col>
                  <Statistic
                    title="获赞"
                    value={currentUser.likes}
                    valueStyle={{ color: '#fff', fontSize: '20px' }}
                    suffix={<span style={{ color: '#888', fontSize: '14px' }}>个</span>}
                  />
                </Col>
              </Row>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  style={{
                    backgroundColor: '#ff0050',
                    border: 'none',
                    borderRadius: '20px',
                    height: '40px',
                    padding: '0 24px'
                  }}
                >
                  编辑资料
                </Button>
                <Button
                  icon={<SettingOutlined />}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '20px',
                    height: '40px',
                    padding: '0 24px',
                    color: '#fff'
                  }}
                >
                  设置
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        {/* 内容标签页 */}
        <Card
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px'
          }}
          bodyStyle={{ padding: 0 }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'videos',
                label: (
                  <span style={{ color: '#fff', fontSize: '16px' }}>
                    作品 ({userVideos.length})
                  </span>
                )
              },
              {
                key: 'liked',
                label: (
                  <span style={{ color: '#fff', fontSize: '16px' }}>
                    喜欢 ({likedVideos.length})
                  </span>
                )
              }
            ]}
            tabBarStyle={{
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              margin: 0,
              padding: '0 24px'
            }}
            style={{
              '& .ant-tabs-tab': {
                backgroundColor: 'transparent',
                border: 'none'
              }
            }}
          />

          <div style={{ padding: '24px' }}>
            {activeTab === 'videos' && (
              <Row gutter={[16, 16]}>
                {userVideos.map(video => (
                  <Col key={video.id} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      cover={
                        <div style={{ position: 'relative', paddingTop: '133%' }}>
                          <img
                            src={video.poster}
                            alt={video.title}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                          />
                          <PlayCircleOutlined
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              fontSize: '32px',
                              color: 'rgba(255, 255, 255, 0.9)'
                            }}
                          />
                        </div>
                      }
                      bodyStyle={{ 
                        padding: '12px', 
                        backgroundColor: 'transparent',
                        border: 'none'
                      }}
                      style={{ 
                        backgroundColor: 'transparent', 
                        border: 'none',
                        borderRadius: '12px'
                      }}
                    >
                      <div style={{ color: '#fff', fontSize: '14px', lineHeight: '1.4' }}>
                        {video.title}
                      </div>
                      <div style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>
                        {video.views}次观看
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}

            {activeTab === 'liked' && (
              <Row gutter={[16, 16]}>
                {likedVideos.map(video => (
                  <Col key={video.id} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      cover={
                        <div style={{ position: 'relative', paddingTop: '133%' }}>
                          <img
                            src={video.poster}
                            alt={video.title}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                          />
                          <PlayCircleOutlined
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              fontSize: '32px',
                              color: 'rgba(255, 255, 255, 0.9)'
                            }}
                          />
                        </div>
                      }
                      bodyStyle={{ 
                        padding: '12px', 
                        backgroundColor: 'transparent',
                        border: 'none'
                      }}
                      style={{ 
                        backgroundColor: 'transparent', 
                        border: 'none',
                        borderRadius: '12px'
                      }}
                    >
                      <div style={{ color: '#fff', fontSize: '14px', lineHeight: '1.4' }}>
                        {video.title}
                      </div>
                      <div style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>
                        @{video.author.name}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </Card>
      </Content>
    </Layout>
  )
}

export default Profile
