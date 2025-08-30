import React from 'react'
import { Card, Space } from 'antd'
import VideoPlayer from './VideoPlayer'
import { Video } from '../types/video'

// 创建一个测试视频数据
const testVideo: Video = {
  id: 'test_video_001',
  title: '测试视频 - 交互功能演示',
  description: '这是一个用来测试点赞、关注、评论功能的演示视频。您可以尝试点击右侧的交互按钮来体验完整的功能。',
  poster: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  duration: 45,
  views: 12800,
  likes: 856,
  comments: 42,
  shares: 128,
  category: '测试',
  tags: ['测试', '交互', '演示'],
  author: {
    id: 'test_author',
    name: '测试用户',
    avatar: '/placeholder-avatar.svg',
    followers: 10500,
    verified: true,
    description: '这是一个测试用户账号'
  },
  createdAt: '2024-01-15',
  isLiked: false,
  isFollowed: false,
  hashtags: ['#测试', '#交互功能', '#抖音'],
  isLocal: false
}

const InteractionTestDemo: React.FC = () => {
  return (
    <div style={{ 
      padding: '24px',
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff'
    }}>
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          color: '#fff',
          textAlign: 'center',
          marginBottom: '32px',
          fontSize: '28px'
        }}>
          🎥 视频交互功能测试演示
        </h1>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* 视频播放区域 */}
          <Card 
            style={{ 
              backgroundColor: '#1a1a1a',
              border: '1px solid #333'
            }}
            bodyStyle={{ padding: 0 }}
          >
            <div style={{ 
              height: '500px',
              position: 'relative'
            }}>
              <VideoPlayer
                videoUrl={testVideo.videoUrl}
                poster={testVideo.poster}
                video={testVideo}
                isLocal={false}
                showInteractions={true}
              />
            </div>
          </Card>

          {/* 功能说明区域 */}
          <div>
            <Card
              title="✨ 新增交互功能"
              style={{ 
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                marginBottom: '16px'
              }}
              headStyle={{ color: '#fff', borderBottom: '1px solid #333' }}
              bodyStyle={{ color: '#fff' }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <h4 style={{ color: '#ff0050', margin: 0 }}>❤️ 点赞功能</h4>
                  <p style={{ margin: '4px 0', fontSize: '13px', color: '#ccc' }}>
                    点击右侧心形按钮进行点赞，支持点赞动画和粒子效果
                  </p>
                </div>
                
                <div>
                  <h4 style={{ color: '#ff0050', margin: 0 }}>👤 关注功能</h4>
                  <p style={{ margin: '4px 0', fontSize: '13px', color: '#ccc' }}>
                    点击关注按钮关注/取消关注用户，带有状态动画
                  </p>
                </div>
                
                <div>
                  <h4 style={{ color: '#ff0050', margin: 0 }}>💬 评论系统</h4>
                  <p style={{ margin: '4px 0', fontSize: '13px', color: '#ccc' }}>
                    点击评论按钮打开评论模态框，支持添加评论、回复、点赞评论
                  </p>
                </div>
                
                <div>
                  <h4 style={{ color: '#ff0050', margin: 0 }}>📤 分享功能</h4>
                  <p style={{ margin: '4px 0', fontSize: '13px', color: '#ccc' }}>
                    支持原生分享或复制链接到剪贴板
                  </p>
                </div>
              </Space>
            </Card>

            <Card
              title="🎮 使用说明"
              style={{ 
                backgroundColor: '#1a1a1a',
                border: '1px solid #333'
              }}
              headStyle={{ color: '#fff', borderBottom: '1px solid #333' }}
              bodyStyle={{ color: '#fff' }}
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <p style={{ margin: 0, fontSize: '13px' }}>
                  1. 播放视频后，右侧会显示交互按钮
                </p>
                <p style={{ margin: 0, fontSize: '13px' }}>
                  2. 点击❤️按钮体验点赞动画
                </p>
                <p style={{ margin: 0, fontSize: '13px' }}>
                  3. 点击👤按钮测试关注功能
                </p>
                <p style={{ margin: 0, fontSize: '13px' }}>
                  4. 点击💬按钮打开评论面板
                </p>
                <p style={{ margin: 0, fontSize: '13px' }}>
                  5. 在评论面板中可以发表评论和回复
                </p>
              </Space>
            </Card>
          </div>
        </div>

        {/* 功能特点说明 */}
        <Card
          title="🚀 功能特点"
          style={{ 
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            marginTop: '24px'
          }}
          headStyle={{ color: '#fff', borderBottom: '1px solid #333' }}
          bodyStyle={{ color: '#fff' }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <h4 style={{ color: '#ff0050', margin: '0 0 8px 0' }}>🎨 精美动画</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#ccc' }}>
                点赞时有缩放动画和爱心粒子效果，关注时有按钮状态动画
              </p>
            </div>
            
            <div>
              <h4 style={{ color: '#ff0050', margin: '0 0 8px 0' }}>💾 状态管理</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#ccc' }}>
                使用自定义Hook管理所有交互状态，支持本地状态持久化
              </p>
            </div>
            
            <div>
              <h4 style={{ color: '#ff0050', margin: '0 0 8px 0' }}>📱 响应式设计</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#ccc' }}>
                界面适配不同屏幕尺寸，交互按钮位置自动调整
              </p>
            </div>
            
            <div>
              <h4 style={{ color: '#ff0050', margin: '0 0 8px 0' }}>🔄 实时更新</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#ccc' }}>
                点赞数、评论数等数据实时更新，提供流畅的用户体验
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default InteractionTestDemo
