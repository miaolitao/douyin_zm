import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { sampleVideos, categories } from '../data/videos'
import './Home.css'

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

  // 格式化数字
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
    <div className="douyin-home-container">
      {/* 顶部导航栏 */}
      <div className="douyin-top-nav">
        <div className="nav-tabs">
          {['精选', '推荐', 'AI抖音', '关注', '朋友', '我的'].map(tab => (
            <div
              key={tab}
              className={`nav-tab ${currentCategory === tab ? 'active' : ''}`}
              onClick={() => handleCategoryChange(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="douyin-main-content">
        {/* 左侧视频流 */}
        <div className="video-stream-container" ref={containerRef}>
          {/* 分类标签 */}
          <div className="category-tabs">
            {categories.map(category => (
              <div
                key={category}
                className={`category-tab ${currentCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </div>
            ))}
          </div>

          {/* 视频网格 */}
          <div className="video-grid">
            {displayedVideos.map(video => (
              <div key={video.id} className="discover-video-card-item" data-aweme-id={video.id}>
                <div className="waterfall-videoCardContainer jingxuanVideoCard" onClick={() => navigate(`/video/${video.id}`)}>
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
                        
                        {/* 播放按钮 */}
                        <div className="playButton">
                          <svg width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 23">
                            <path d="M15.583 11.5a1.833 1.833 0 1 1 3.667 0 1.833 1.833 0 0 1-3.667 0zM9.167 11.5a1.833 1.833 0 1 1 3.666 0 1.833 1.833 0 0 1-3.666 0zM4.583 9.667a1.833 1.833 0 1 0 0 3.666 1.833 1.833 0 0 0 0-3.666z" fill="#fff"/>
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
                        <svg width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 23">
                          <path d="M15.583 11.5a1.833 1.833 0 1 1 3.667 0 1.833 1.833 0 0 1-3.667 0zM9.167 11.5a1.833 1.833 0 1 1 3.666 0 1.833 1.833 0 0 1-3.666 0zM4.583 9.667a1.833 1.833 0 1 0 0 3.666 1.833 1.833 0 0 0 0-3.666z" fill="#fff"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 加载状态 */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner" />
              <span className="loading-text">加载中...</span>
            </div>
          )}
        </div>

        {/* 右侧分类导航 */}
        <div className="category-sidebar">
          <div className="category-title">分类</div>
          {categories.slice(5).map(category => (
            <div key={category} className="category-item">
              <span className="category-icon">🎯</span>
              <span className="category-name">{category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home