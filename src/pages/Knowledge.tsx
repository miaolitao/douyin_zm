import React, { useState, useRef, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, Button, Card, Avatar, Badge, Tag } from 'antd'
import { 
  HeartOutlined, 
  MessageOutlined, 
  ShareAltOutlined, 
  PlayCircleOutlined,
  ReadOutlined,
  BookOutlined,
  BulbOutlined,
  ExperimentOutlined
} from '@ant-design/icons'
import { useVideoData } from '../hooks/useVideoData'
import LoadingState from '../components/LoadingState'

const { Content } = Layout

const Knowledge: React.FC = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const pageSize = 12

  // 使用统一的视频数据Hook
  const { videos, loading, error, refetch, updateVideo } = useVideoData()

  // 筛选知识类别的视频
  const knowledgeVideos = useMemo(() => {
    return videos.filter(video => video.category === '知识')
  }, [videos])

  const displayedVideos = useMemo(() => {
    return knowledgeVideos.slice(0, currentPage * pageSize)
  }, [knowledgeVideos, currentPage, pageSize])

  const handleLike = (videoId: string) => {
    const video = videos.find(v => v.id === videoId)
    if (video) {
      updateVideo(videoId, {
        isLiked: !video.isLiked,
        likes: video.isLiked ? video.likes - 1 : video.likes + 1
      })
    }
  }

  const handleScroll = () => {
    if (!containerRef.current || loading || loadingMore) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      const hasMore = currentPage * pageSize < knowledgeVideos.length
      if (hasMore) {
        setLoadingMore(true)
        setTimeout(() => {
          setCurrentPage(prev => prev + 1)
          setLoadingMore(false)
        }, 800)
      }
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [loading, loadingMore, currentPage, knowledgeVideos.length])

  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  return (
    <Layout style={{ height: '100%', backgroundColor: '#000000' }}>
      <Content style={{ height: '100%', overflow: 'hidden' }}>
        {/* 页面标题 */}
        <div style={{ 
          padding: '24px 24px 16px', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: '#000000'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #1890ff, #722ed1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
            }}>
              <ReadOutlined style={{ fontSize: '20px', color: '#fff' }} />
            </div>
            <div>
              <h1 style={{ 
                color: '#fff', 
                margin: 0, 
                fontSize: '28px', 
                fontWeight: 'bold' 
              }}>
                知识殿堂
              </h1>
              <p style={{ 
                color: '#888', 
                margin: '4px 0 0', 
                fontSize: '14px' 
              }}>
                探索知识海洋，启发无限可能
              </p>
            </div>
          </div>
          
          {/* 知识分类标签 */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['全部知识', '科学', '历史', '文学', '艺术', '技术', '哲学', '心理学'].map(tag => (
              <Tag 
                key={tag}
                style={{
                  backgroundColor: tag === '全部知识' ? '#1890ff' : 'rgba(255, 255, 255, 0.1)',
                  color: tag === '全部知识' ? '#fff' : '#888',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '4px 12px',
                  cursor: 'pointer'
                }}
              >
                {tag}
              </Tag>
            ))}
          </div>
        </div>

        <LoadingState
          loading={loading}
          error={error}
          onRetry={refetch}
          showEmpty={displayedVideos.length === 0}
          emptyMessage="暂无知识视频"
        >
          <div 
            className="parent-route-container route-scroll-container" 
            ref={containerRef}
            style={{ height: 'calc(100% - 140px)', overflowY: 'auto', padding: '24px' }}
          >
            {/* 知识视频瀑布流 */}
            <div className="waterfall-container">
              {displayedVideos.map(video => (
                <div key={video.id} className="discover-video-card-item" data-aweme-id={video.id}>
                  <div className="waterfall-videoCardContainer" onClick={() => navigate(`/video/${video.id}`)}>
                    {/* 视频封面区域 */}
                    <div className="videoImage">
                      <div className="videoImageInner">
                        <div className="videoImageContent">
                          <img 
                            src={video.poster} 
                            alt={video.title} 
                            className="discover-video-card-img"
                            loading="lazy"
                          />
                          
                          {/* 知识标识 */}
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            left: '8px',
                            background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backdropFilter: 'blur(4px)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                          }}>
                            <BookOutlined style={{ fontSize: '12px' }} />
                            知识
                          </div>
                          
                          {/* 启发标识 */}
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: 'rgba(255, 193, 7, 0.9)',
                            color: '#000',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 'bold'
                          }}>
                            <BulbOutlined style={{ fontSize: '10px' }} />
                            启发
                          </div>
                          
                          {/* 播放按钮 */}
                          <div className="playButton">
                            <svg width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 23">
                              <path d="M8 6.5l8 5.5-8 5.5V6.5z" fill="#fff"/>
                            </svg>
                          </div>
                          
                          {/* 视频时长 */}
                          <div className="videoDuration">
                            {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                          </div>
                          
                          {/* 点赞数 */}
                          <div className="likeCount">
                            <span className="likeIcon">❤</span>
                            <span>{formatNumber(video.likes)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 视频信息区域 */}
                    <div className="videoInfo">
                      <div className="videoTitle">
                        {video.title}
                      </div>
                      <div className="videoMeta">
                        <div className="authorInfo">
                          <span className="authorPrefix">@</span>
                          <span className="authorName">{video.author.name}</span>
                          <span className="publishTime"> · {video.createdAt}</span>
                        </div>
                        <div className="videoStats">
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <Button 
                              type="text" 
                              size="small"
                              icon={<HeartOutlined style={{ color: video.isLiked ? '#ff0050' : '#888' }} />}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleLike(video.id)
                              }}
                              style={{ 
                                color: video.isLiked ? '#ff0050' : '#888',
                                padding: '0 4px',
                                height: 'auto'
                              }}
                            >
                              {formatNumber(video.likes)}
                            </Button>
                            <Button 
                              type="text" 
                              size="small"
                              icon={<MessageOutlined style={{ color: '#888' }} />}
                              style={{ 
                                color: '#888',
                                padding: '0 4px',
                                height: 'auto'
                              }}
                            >
                              {formatNumber(video.comments)}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 加载更多提示 */}
            {loadingMore && (
              <div className="load-more-container">
                <div className="load-more-spinner">
                  <div className="spinner"></div>
                  <span>加载更多知识视频...</span>
                </div>
              </div>
            )}

            {/* 没有更多数据提示 */}
            {!loadingMore && displayedVideos.length >= knowledgeVideos.length && knowledgeVideos.length > 0 && (
              <div className="no-more-container">
                <span>已显示全部 {knowledgeVideos.length} 个知识视频</span>
              </div>
            )}
          </div>
        </LoadingState>
      </Content>
    </Layout>
  )
}

export default Knowledge