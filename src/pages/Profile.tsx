import React, { useState } from 'react'
import { Layout, Avatar, Button, Row, Col, Card, Tabs, Tag, Statistic, Divider, Badge, Modal, Form, Input, Upload, message, Tooltip } from 'antd'
import { 
  EditOutlined, 
  SettingOutlined, 
  HeartOutlined,
  MessageOutlined,
  ShareAltOutlined,
  PlayCircleOutlined,
  UserAddOutlined,
  CheckOutlined,
  CameraOutlined,
  LinkOutlined,
  QrcodeOutlined,
  MoreOutlined,
  GiftOutlined,
  CrownOutlined
} from '@ant-design/icons'
import { currentUser } from '../data/videos'
import { useVideoData } from '../hooks/useVideoData'
import LoadingState from '../components/LoadingState'

const { Content } = Layout

const Profile: React.FC = () => {
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState('videos')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [shareModalVisible, setShareModalVisible] = useState(false)
  const [userInfo, setUserInfo] = useState(currentUser)
  const [form] = Form.useForm()

  // 使用统一的视频数据Hook
  const { videos, loading, error, refetch } = useVideoData()

  const userVideos = videos.filter(video => video.author.id === 'current_user')
  const likedVideos = videos.filter(video => video.isLiked)

  // 处理编辑资料
  const handleEditProfile = (values: any) => {
    setUserInfo({ ...userInfo, ...values })
    setEditModalVisible(false)
    message.success('资料更新成功！')
  }

  // 处理分享
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
    message.success('链接已复制到剪贴板')
    setShareModalVisible(false)
  }

  // 处理关注
  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    message.success(isFollowing ? '已取消关注' : '关注成功')
  }

  return (
    <Layout style={{ backgroundColor: '#000000', height: '100%', overflow: 'auto' }}>
      <Content style={{ padding: '24px' }}>
        {/* 用户信息头部 */}
        <div className="profile-header" style={{ 
          background: 'linear-gradient(135deg, rgba(255, 0, 80, 0.1), rgba(0, 0, 0, 0.3))', 
          borderRadius: '20px', 
          padding: '40px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <Row gutter={32}>
            <Col>
              <div style={{ position: 'relative' }}>
                <Avatar
                  size={140}
                  src={userInfo.avatar}
                  style={{ 
                    border: userInfo.verified ? '4px solid #ff0050' : '4px solid rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                />
                {userInfo.verified && (
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    backgroundColor: '#ff0050',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid #000'
                  }}>
                    <CrownOutlined style={{ color: '#fff', fontSize: '14px' }} />
                  </div>
                )}
              </div>
            </Col>
            <Col flex={1}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <h1 style={{ color: '#fff', margin: 0, fontSize: '32px', fontWeight: 'bold' }}>
                    {userInfo.name}
                  </h1>
                  {userInfo.verified && (
                    <Badge 
                      count={<CheckOutlined style={{ fontSize: '14px', color: '#fff' }} />}
                      style={{ 
                        backgroundColor: '#ff0050',
                        borderRadius: '50%',
                        border: '2px solid rgba(255, 255, 255, 0.2)'
                      }}
                    />
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Tooltip title="分享个人资料">
                    <Button
                      icon={<ShareAltOutlined />}
                      shape="circle"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        color: '#fff'
                      }}
                      onClick={() => setShareModalVisible(true)}
                    />
                  </Tooltip>
                  <Tooltip title="更多选项">
                    <Button
                      icon={<MoreOutlined />}
                      shape="circle"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        color: '#fff'
                      }}
                    />
                  </Tooltip>
                </div>
              </div>
              
              <p style={{ color: '#fff', fontSize: '16px', marginBottom: '24px', lineHeight: '1.6' }}>
                {userInfo.description}
              </p>

              <div className="profile-stats">
                <Row gutter={32} style={{ marginBottom: '32px' }}>
                  <Col>
                    <Statistic
                      title={<span style={{ color: '#888', fontSize: '14px' }}>关注</span>}
                      value={userInfo.following}
                      valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}
                    />
                  </Col>
                  <Col>
                    <Statistic
                      title={<span style={{ color: '#888', fontSize: '14px' }}>粉丝</span>}
                      value={userInfo.followers}
                      valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}
                    />
                  </Col>
                  <Col>
                    <Statistic
                      title={<span style={{ color: '#888', fontSize: '14px' }}>获赞</span>}
                      value={userInfo.likes}
                      valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}
                    />
                  </Col>
                  <Col>
                    <Statistic
                      title={<span style={{ color: '#888', fontSize: '14px' }}>作品</span>}
                      value={userVideos.length}
                      valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}
                    />
                  </Col>
                </Row>
              </div>

              <div className="profile-buttons" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, #ff0050, #ff3366)',
                    border: 'none',
                    borderRadius: '25px',
                    height: '45px',
                    padding: '0 30px',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    boxShadow: '0 4px 15px rgba(255, 0, 80, 0.3)'
                  }}
                  onClick={() => setEditModalVisible(true)}
                >
                  编辑资料
                </Button>
                <Button
                  icon={<SettingOutlined />}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '25px',
                    height: '45px',
                    padding: '0 24px',
                    color: '#fff',
                    fontWeight: '500',
                    backdropFilter: 'blur(5px)'
                  }}
                >
                  设置
                </Button>
                <Button
                  icon={<GiftOutlined />}
                  style={{
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '25px',
                    height: '45px',
                    padding: '0 24px',
                    color: '#FFD700',
                    fontWeight: '500'
                  }}
                >
                  礼物中心
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
              <div className="video-grid">
                <Row gutter={[16, 16]}>
                  {userVideos.map(video => (
                    <Col key={video.id} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        className="video-card"
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
                        <div className="video-title" style={{ color: '#fff', fontSize: '14px', lineHeight: '1.4' }}>
                          {video.title}
                        </div>
                        <div className="video-stats" style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>
                          {video.views}次观看
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {activeTab === 'liked' && (
              <div className="video-grid">
                <Row gutter={[16, 16]}>
                  {likedVideos.map(video => (
                    <Col key={video.id} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        className="video-card"
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
                        <div className="video-title" style={{ color: '#fff', fontSize: '14px', lineHeight: '1.4' }}>
                          {video.title}
                        </div>
                        <div className="video-stats" style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>
                          @{video.author.name}
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </div>
        </Card>

        {/* 编辑资料模态框 */}
        <Modal
          title={
            <span style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
              编辑个人资料
            </span>
          }
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={null}
          centered
          style={{
            backgroundColor: '#000',
            borderRadius: '16px'
          }}
          bodyStyle={{
            backgroundColor: '#1a1a1a',
            borderRadius: '16px',
            padding: '24px'
          }}
          maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        >
          <Form
            form={form}
            onFinish={handleEditProfile}
            initialValues={{
              name: userInfo.name,
              description: userInfo.description
            }}
            layout="vertical"
          >
            {/* 头像上传 */}
            <Form.Item label={<span style={{ color: '#fff' }}>头像</span>}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Avatar size={80} src={userInfo.avatar} />
                <Upload
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={(info) => {
                    if (info.file) {
                      const reader = new FileReader()
                      reader.onload = (e) => {
                        setUserInfo({ ...userInfo, avatar: e.target?.result as string })
                      }
                      reader.readAsDataURL(info.file as any)
                    }
                  }}
                >
                  <Button
                    icon={<CameraOutlined />}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      color: '#fff',
                      borderRadius: '8px'
                    }}
                  >
                    更换头像
                  </Button>
                </Upload>
              </div>
            </Form.Item>

            {/* 昵称 */}
            <Form.Item
              name="name"
              label={<span style={{ color: '#fff' }}>昵称</span>}
              rules={[{ required: true, message: '请输入昵称' }]}
            >
              <Input
                placeholder="输入昵称"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  borderRadius: '8px',
                  height: '40px'
                }}
              />
            </Form.Item>

            {/* 简介 */}
            <Form.Item
              name="description"
              label={<span style={{ color: '#fff' }}>个人简介</span>}
            >
              <Input.TextArea
                placeholder="介绍一下自己..."
                rows={4}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  borderRadius: '8px'
                }}
              />
            </Form.Item>

            {/* 提交按钮 */}
            <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button
                  onClick={() => setEditModalVisible(false)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '8px'
                  }}
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    backgroundColor: '#ff0050',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                >
                  保存
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* 分享模态框 */}
        <Modal
          title={
            <span style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
              分享个人资料
            </span>
          }
          open={shareModalVisible}
          onCancel={() => setShareModalVisible(false)}
          footer={null}
          centered
          style={{
            backgroundColor: '#000',
            borderRadius: '16px'
          }}
          bodyStyle={{
            backgroundColor: '#1a1a1a',
            borderRadius: '16px',
            padding: '24px'
          }}
          maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        >
          <div style={{ textAlign: 'center' }}>
            {/* 二维码区域 */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              display: 'inline-block'
            }}>
              <QrcodeOutlined style={{ fontSize: '80px', color: '#000' }} />
              <div style={{ color: '#000', fontSize: '12px', marginTop: '8px' }}>
                扫描二维码访问
              </div>
            </div>

            {/* 分享选项 */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: '#888', marginBottom: '16px' }}>或选择其他方式分享</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Button
                  icon={<LinkOutlined />}
                  onClick={handleShare}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '8px',
                    height: '40px',
                    padding: '0 20px'
                  }}
                >
                  复制链接
                </Button>
                <Button
                  icon={<MessageOutlined />}
                  style={{
                    backgroundColor: 'rgba(0, 200, 0, 0.2)',
                    border: '1px solid rgba(0, 200, 0, 0.3)',
                    color: '#00C800',
                    borderRadius: '8px',
                    height: '40px',
                    padding: '0 20px'
                  }}
                >
                  微信分享
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </Content>
    </Layout>
  )
}

export default Profile
