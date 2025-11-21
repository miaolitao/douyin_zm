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
  const [isBuffering, setIsBuffering] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  
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
      setDuration(video.duration)
    }

    const handleTimeUpdate = () => {
      // 只在非模拟模式下更新时间
      if (!isSimulationMode) {
        setCurrentTime(video.currentTime)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }

    const handleWaiting = () => {
      setIsBuffering(true)
    }

    const handleCanPlay = () => {
      setIsBuffering(false)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('playing', handleCanPlay)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('playing', handleCanPlay)
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

    if (isPlaying) {
      if (isSimulationMode) {
        stopSimulation()
      } else {
        video.pause()
        setIsPlaying(false)
        onPause?.()
      }
    } else {
      if (isLocal) {
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
              onPlay?.()
            })
            .catch((error) => {
              console.error('Error playing local video:', error)
              setIsPlaying(false)
              setShowSimulationButton(true)
            })
        }
      } else {
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
              onPlay?.()
            })
            .catch((error) => {
              console.error('Error playing video:', error)
              setIsPlaying(false)
              setShowSimulationButton(true)
            })
        } else {
          try {
            video.play()
            setIsPlaying(true)
            onPlay?.()
          } catch (error) {
            console.error('Error playing video (synchronous):', error)
            setIsPlaying(false)
            setShowSimulationButton(true)
          }
        }
      }
    }
  }

  const handleSeek = (value: number) => {
    const video = videoRef.current
    if (!video) return
    
    if (isSimulationMode) {
      setCurrentTime(value)
    } else {
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
    setIsSimulationMode(true)
    setIsPlaying(true)
    setShowSimulationButton(false)
    onPlay?.()
    
    const simDuration = duration > 0 ? duration : 45
    setDuration(simDuration)
    let currentSimTime = 0
    let shouldContinue = true
    
    const simulateProgress = () => {
      if (shouldContinue && currentSimTime < simDuration) {
        currentSimTime = Math.min(currentSimTime + 0.5, simDuration)
        setCurrentTime(currentSimTime)
        
        if (currentSimTime < simDuration) {
          setTimeout(simulateProgress, 500)
        } else {
          setIsPlaying(false)
          setIsSimulationMode(false)
          onEnded?.()
        }
      }
    }
    
    simulateProgress()
    
    simulationStopRef.current = () => {
      shouldContinue = false
    }
  }

  // 停止模拟播放
  const stopSimulation = () => {
    if (simulationStopRef.current) {
      simulationStopRef.current()
      simulationStopRef.current = null
    }
    setIsSimulationMode(false)
    setIsPlaying(false)
    setCurrentTime(0)
    onPause?.()
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
      <style>
        {`
          .custom-slider .ant-slider-track {
            background-color: rgba(255, 255, 255, 0.3) !important;
            transition: height 0.2s;
          }
          .custom-slider:hover .ant-slider-track {
            background-color: #fe2c55 !important;
            height: 6px !important;
          }
          .custom-slider .ant-slider-rail {
            background-color: rgba(255, 255, 255, 0.2) !important;
            height: 4px !important;
            transition: height 0.2s;
          }
          .custom-slider:hover .ant-slider-rail {
            height: 6px !important;
          }
          .custom-slider .ant-slider-handle {
            display: none;
          }
          .custom-slider:hover .ant-slider-handle {
            display: block;
            border-color: #fff !important;
            background-color: #fff !important;
            width: 12px;
            height: 12px;
            margin-top: -3px;
          }
          
          .volume-slider-container {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            width: 32px;
            height: 100px;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 16px;
            display: flex;
            justify-content: center;
            padding: 12px 0;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s;
          }
          
          .volume-control:hover .volume-slider-container {
            opacity: 1;
            visibility: visible;
          }
        `}
      </style>

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

      {/* 缓冲加载动画 */}
      {isBuffering && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderTop: '3px solid #fe2c55',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      )}

      {/* 播放按钮覆盖层 */}
      {!isPlaying && !isBuffering && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            cursor: 'pointer',
            zIndex: 10
          }}
          onClick={togglePlay}
        >
          <PlayCircleOutlined
            style={{
              fontSize: '64px',
              color: 'rgba(255, 255, 255, 0.8)',
              filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))'
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
            border: '2px solid rgba(255, 255, 255, 0.3)',
            zIndex: 20
          }}
          onClick={startSimulation}
        >
          🎬 演示播放
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
          background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.6))',
          padding: '0 12px 12px',
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: showControls ? 'auto' : 'none',
          zIndex: 20
        }}
      >
        {/* 进度条 */}
        <div style={{ marginBottom: '10px', padding: '0 4px' }}>
          <Slider
            className="custom-slider"
            value={currentTime}
            max={duration}
            onChange={handleSeek}
            tooltip={{
              formatter: (value) => formatTime(value || 0),
              open: false // 禁用默认tooltip，因为我们有自定义样式
            }}
            style={{ margin: 0, padding: '4px 0' }}
          />
        </div>

        {/* 控制按钮 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* 播放/暂停 */}
            <Button
              type="text"
              icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={togglePlay}
              style={{
                color: '#fff',
                fontSize: '28px',
                padding: 0,
                width: 'auto',
                height: 'auto',
                display: 'flex',
                alignItems: 'center'
              }}
            />

            {/* 时间显示 */}
            <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '13px', fontWeight: 500, letterSpacing: '0.5px' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* 音量控制 */}
            <div className="volume-control" style={{ position: 'relative' }}>
              <Button
                type="text"
                icon={isMuted ? <AudioOutlined /> : <SoundOutlined />}
                onClick={toggleMute}
                style={{
                  color: '#fff',
                  fontSize: '22px',
                  padding: 0,
                  width: 'auto',
                  height: 'auto',
                  display: 'flex',
                  alignItems: 'center'
                }}
              />
              <div className="volume-slider-container">
                <Slider
                  vertical
                  value={isMuted ? 0 : volume}
                  min={0}
                  max={1}
                  step={0.1}
                  onChange={handleVolumeChange}
                  style={{ height: '80px', margin: 0 }}
                  trackStyle={{ backgroundColor: '#fe2c55' }}
                  handleStyle={{ borderColor: '#fff', backgroundColor: '#fff' }}
                  railStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                />
              </div>
            </div>

            {/* 设置 */}
            <Tooltip title="倍速" color="rgba(0,0,0,0.8)">
              <Button
                type="text"
                style={{
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  padding: 0,
                  width: 'auto',
                  height: 'auto'
                }}
              >
                倍速
              </Button>
            </Tooltip>

            {/* 全屏 */}
            <Tooltip title={isFullscreen ? '退出全屏' : '全屏'} color="rgba(0,0,0,0.8)">
              <Button
                type="text"
                icon={<FullscreenOutlined />}
                onClick={toggleFullscreen}
                style={{
                  color: '#fff',
                  fontSize: '22px',
                  padding: 0,
                  width: 'auto',
                  height: 'auto',
                  display: 'flex',
                  alignItems: 'center'
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