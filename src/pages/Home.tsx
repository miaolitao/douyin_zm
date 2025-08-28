import React, { useState, useRef, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { categories } from '../data/videos'
import { useVideoData } from '../hooks/useVideoData'
import LoadingState from '../components/LoadingState'
import './Home.css'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [currentCategory, setCurrentCategory] = useState('全部')
  const [currentPage, setCurrentPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const pageSize = 12

  // 使用统一的视频数据Hook
  const { videos, loading, error, refetch, updateVideo } = useVideoData()

  // 使用useMemo优化过滤和分页逻辑
  const filteredVideos = useMemo(() => {
    return currentCategory === '全部'
      ? videos
      : videos.filter(video => video.category === currentCategory)
  }, [videos, currentCategory])

  const displayedVideos = useMemo(() => {
    return filteredVideos.slice(0, currentPage * pageSize)
  }, [filteredVideos, currentPage, pageSize])

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category)
    setCurrentPage(1)
  }

  const handleLike = (videoId: string) => {
    const video = videos.find(v => v.id === videoId)
    if (video) {
      updateVideo(videoId, {
        isLiked: !video.isLiked,
        likes: video.isLiked ? video.likes - 1 : video.likes + 1
      })
    }
  }

  const handleFollow = (videoId: string) => {
    const video = videos.find(v => v.id === videoId)
    if (video) {
      updateVideo(videoId, {
        isFollowed: !video.isFollowed
      })
    }
  }

  const handleScroll = () => {
    if (!containerRef.current || loading || loadingMore) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    // 当滚动到距离底部100px时开始加载
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      const hasMore = currentPage * pageSize < filteredVideos.length
      if (hasMore) {
        setLoadingMore(true)
        // 模拟网络延迟
        setTimeout(() => {
          setCurrentPage(prev => prev + 1)
          setLoadingMore(false)
          console.log(`加载更多视频，当前页: ${currentPage + 1}，总视频数: ${filteredVideos.length}`)
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
  }, [loading, loadingMore, currentCategory, currentPage, filteredVideos.length])

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
      {/* 抖音官网风格的分类标签栏 */}
      <div className="discover-tab-container">
        <div className="discover-tab-bar" role="tablist">
          {categories.map(category => (
            <div
              key={category}
              role="tab"
              className={`discover-tab ${currentCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      {/* 使用统一的加载状态组件 */}
      <LoadingState
        loading={loading}
        error={error}
        onRetry={refetch}
        showEmpty={displayedVideos.length === 0}
        emptyMessage="暂无视频数据"
      >
        {/* 主内容区域 */}
      <div className="parent-route-container route-scroll-container" ref={containerRef}>
        {/* 视频瀑布流 */}
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

        {/* 加载更多提示 */}
        {loadingMore && (
          <div className="load-more-container">
            <div className="load-more-spinner">
              <div className="spinner"></div>
              <span>加载更多视频...</span>
            </div>
          </div>
        )}

        {/* 没有更多数据提示 */}
        {!loadingMore && displayedVideos.length >= filteredVideos.length && filteredVideos.length > 0 && (
          <div className="no-more-container">
            <span>已显示全部 {filteredVideos.length} 个视频</span>
          </div>
        )}

      </div>
      </LoadingState>
    </div>
  )
}

export default Home