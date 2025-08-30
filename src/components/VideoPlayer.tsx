import React, { useState, useRef, useEffect } from 'react'
import { Button, Slider, Tooltip } from 'antd'
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined,
  SoundOutlined,
  AudioOutlined,
  FullscreenOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { Video } from '../types/video'
import { useVideoInteraction } from '../hooks/useVideoInteraction'
import VideoInteractionBar from './VideoInteractionBar'
import CommentModal from './CommentModal'

interface VideoPlayerProps {
  videoUrl: string
  poster?: string
  isLocal?: boolean // 标记是否为本地视频
  video?: Video // 完整的视频数据，用于交互功能
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  showInteractions?: boolean // 是否显示交互按钮
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  poster,
  isLocal = false,
  video,
  onPlay,
  onPause,
  onEnded,
  showInteractions = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSimulationMode, setIsSimulationMode] = useState(false)
  const [showSimulationButton, setShowSimulationButton] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()
  const simulationStopRef = useRef<(() => void) | null>(null)

  // 交互功能Hook（仅在有视频数据时使用）
  const videoInteraction = video ? useVideoInteraction(video) : null

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      console.log('Video metadata loaded:', {
        duration: video.duration,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight
      })
      setDuration(video.duration)
    }

    const handleTimeUpdate = () => {
      // 只在非模拟模式下更新时间
      if (!isSimulationMode) {
        console.log('Video time update:', video.currentTime)
        setCurrentTime(video.currentTime)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [onEnded, isSimulationMode])

  useEffect(() => {
    if (showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
  }, [showControls])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    console.log('Video state:', {
      readyState: video.readyState,
      networkState: video.networkState,
      error: video.error,
      src: video.src,
      isLocal
    })

    if (isPlaying) {
      if (isSimulationMode) {
        // 如果是模拟模式，停止模拟播放
        stopSimulation()
      } else {
        video.pause()
        setIsPlaying(false)
        onPause?.()
      }
    } else {
      // 本地视频直接播放
      if (isLocal) {
        console.log('Playing local video:', videoUrl)
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Local video started playing successfully')
              setIsPlaying(true)
              onPlay?.()
            })
            .catch((error) => {
              console.error('Error playing local video:', error)
              setIsPlaying(false)
              setShowSimulationButton(true) // 本地视频播放失败时也显示模拟播放按钮
            })
        }
      } else {
        // 对于在线视频，先尝试直接播放
        console.log('Attempting to play online video:', videoUrl)
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Video started playing successfully')
              setIsPlaying(true)
              onPlay?.()
            })
            .catch((error) => {
              console.error('Error playing video:', error)
              console.log('Video playback failed, user can try simulation mode if needed')
              setIsPlaying(false)
              setShowSimulationButton(true) // 显示模拟播放按钮
            })
        } else {
          // 如果video.play()返回undefined（旧浏览器），也尝试播放
          try {
            video.play()
            setIsPlaying(true)
            onPlay?.()
          } catch (error) {
            console.error('Error playing video (synchronous):', error)
            setIsPlaying(false)
            setShowSimulationButton(true) // 显示模拟播放按钮
          }
        }
      }
    }
  }

  const handleSeek = (value: number) => {
    const video = videoRef.current
    if (!video) return
    
    if (isSimulationMode) {
      // 在模拟模式下，直接设置时间
      setCurrentTime(value)
    } else {
      // 真实播放模式下，设置视频时间
      video.currentTime = value
      setCurrentTime(value)
    }
  }

  const handleVolumeChange = (value: number) => {
    const video = videoRef.current
    if (!video) return
    video.volume = value
    setVolume(value)
    setIsMuted(value === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    if (isMuted) {
      video.volume = volume || 1
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
  }

  const handleMouseLeave = () => {
    setShowControls(false)
  }

  // 手动启动模拟播放
  const startSimulation = () => {
    console.log('Starting simulation mode')
    setIsSimulationMode(true)
    setIsPlaying(true)
    setShowSimulationButton(false)
    onPlay?.()
    
    // 设置一个默认的模拟时长（45秒，对应抖音视频）
    const simDuration = duration > 0 ? duration : 45
    setDuration(simDuration)
    let currentSimTime = 0
    let shouldContinue = true
    
    const simulateProgress = () => {
      if (shouldContinue && currentSimTime < simDuration) {
        currentSimTime = Math.min(currentSimTime + 0.5, simDuration)
        setCurrentTime(currentSimTime)
        
        if (currentSimTime < simDuration) {
          setTimeout(simulateProgress, 500) // 每500ms更新一次，更平滑
        } else {
          console.log('Simulation completed')
          setIsPlaying(false)
          setIsSimulationMode(false)
          onEnded?.()
        }
      }
    }
    
    simulateProgress()
    
    // 保存停止函数到ref，供外部调用
    simulationStopRef.current = () => {
      shouldContinue = false
    }
  }

  // 停止模拟播放
  const stopSimulation = () => {
    // 停止模拟进度更新
    if (simulationStopRef.current) {
      simulationStopRef.current()
      simulationStopRef.current = null
    }
    setIsSimulationMode(false)
    setIsPlaying(false)
    setCurrentTime(0)
    onPause?.()
  }

  // 截图功能示例（可选）
  const takeScreenshot = async () => {
    // 使用 Playwright 截图时，可以这样设置路径：
    // import { getUserPaths } from '../config/paths'
    // const userPaths = getUserPaths()
    // await page.screenshot({ 
    //   path: `${userPaths.screenshots}/video-player.png`,
    //   fullPage: true 
    // })
    console.log('Screenshot functionality ready')
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        onClick={togglePlay}
      />

      {/* 播放按钮覆盖层 */}
      {!isPlaying && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            cursor: 'pointer'
          }}
          onClick={togglePlay}
        >
          <PlayCircleOutlined
            style={{
              fontSize: '80px',
              color: 'rgba(255, 255, 255, 0.9)',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
            }}
          />
        </div>
      )}

      {/* 模拟播放按钮 */}
      {showSimulationButton && !isPlaying && (
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            right: '20px',
            backgroundColor: 'rgba(255, 165, 0, 0.9)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}
          onClick={startSimulation}
        >
          🎬 演示播放
        </div>
      )}

      {/* 模拟播放状态提示 */}
      {isSimulationMode && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: 'rgba(255, 165, 0, 0.9)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          演示模式
        </div>
      )}

      {/* 视频交互按钮 */}
      {showInteractions && videoInteraction && (
        <VideoInteractionBar
          isLiked={videoInteraction.state.isLiked}
          isFollowed={videoInteraction.state.isFollowed}
          likes={videoInteraction.state.likes}
          commentsCount={videoInteraction.state.commentsCount}
          onToggleLike={videoInteraction.actions.toggleLike}
          onToggleFollow={videoInteraction.actions.toggleFollow}
          onToggleComments={videoInteraction.actions.toggleComments}
          onShare={() => console.log('分享视频')}
          formatNumber={videoInteraction.formatNumber}
          likeAnimation={videoInteraction.state.likeAnimation}
          followAnimation={videoInteraction.state.followAnimation}
        />
      )}

      {/* 控制栏 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
          padding: '20px',
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: showControls ? 'auto' : 'none'
        }}
      >
        {/* 进度条 */}
        <Slider
          value={currentTime}
          max={duration}
          onChange={handleSeek}
          tooltip={{
            formatter: (value) => formatTime(value || 0)
          }}
          style={{
            marginBottom: '16px'
          }}
          trackStyle={{ backgroundColor: '#ff0050' }}
          handleStyle={{ borderColor: '#ff0050' }}
          railStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
        />

        {/* 控制按钮 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* 播放/暂停 */}
            <Button
              type="text"
              icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={togglePlay}
              style={{
                color: '#fff',
                fontSize: '24px',
                padding: 0,
                width: 'auto',
                height: 'auto'
              }}
            />

            {/* 音量控制 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Button
                type="text"
                icon={isMuted ? <AudioOutlined /> : <SoundOutlined />}
                onClick={toggleMute}
                style={{
                  color: '#fff',
                  fontSize: '20px',
                  padding: 0,
                  width: 'auto',
                  height: 'auto'
                }}
              />
              <Slider
                value={isMuted ? 0 : volume}
                min={0}
                max={1}
                step={0.1}
                onChange={handleVolumeChange}
                style={{
                  width: '80px',
                  margin: 0
                }}
                trackStyle={{ backgroundColor: '#ff0050' }}
                handleStyle={{ borderColor: '#ff0050' }}
                railStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
              />
            </div>

            {/* 时间显示 */}
            <span style={{ color: '#fff', fontSize: '14px' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* 设置 */}
            <Tooltip title="设置">
              <Button
                type="text"
                icon={<SettingOutlined />}
                style={{
                  color: '#fff',
                  fontSize: '18px',
                  padding: 0,
                  width: 'auto',
                  height: 'auto'
                }}
              />
            </Tooltip>

            {/* 全屏 */}
            <Tooltip title={isFullscreen ? '退出全屏' : '全屏'}>
              <Button
                type="text"
                icon={<FullscreenOutlined />}
                onClick={toggleFullscreen}
                style={{
                  color: '#fff',
                  fontSize: '18px',
                  padding: 0,
                  width: 'auto',
                  height: 'auto'
                }}
              />
            </Tooltip>
          </div>
        </div>
      </div>

      {/* 评论模态框 */}
      {videoInteraction && (
        <CommentModal
          visible={videoInteraction.state.isCommentsVisible}
          onClose={() => videoInteraction.actions.toggleComments()}
          comments={videoInteraction.state.comments}
          onAddComment={videoInteraction.actions.addComment}
          onAddReply={videoInteraction.actions.addReply}
          onToggleCommentLike={videoInteraction.actions.toggleCommentLike}
          onDeleteComment={videoInteraction.actions.deleteComment}
          onDeleteReply={videoInteraction.actions.deleteReply}
          formatTime={videoInteraction.formatTime}
          formatNumber={videoInteraction.formatNumber}
        />
      )}
    </div>
  )
}

export default VideoPlayer