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

interface VideoPlayerProps {
  videoUrl: string
  poster?: string
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  poster,
  onPlay,
  onPause,
  onEnded
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

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
      console.log('Video time update:', video.currentTime)
      setCurrentTime(video.currentTime)
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
  }, [onEnded])

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
      src: video.src
    })

    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
      onPause?.()
    } else {
      // 模拟视频播放，用于演示进度条功能
      if (video.readyState === 0) {
        console.log('Video not ready, simulating playback for demo')
        setIsPlaying(true)
        onPlay?.()
        
        // 模拟进度条移动 - 每100ms更新一次
        let shouldContinue = true
        const simulateProgress = () => {
          if (shouldContinue && currentTime < duration) {
            setCurrentTime(prev => {
              const newTime = Math.min(prev + 0.1, duration)
              console.log('Simulated progress:', newTime)
              return newTime
            })
            setTimeout(simulateProgress, 100)
          }
        }
        simulateProgress()
        
        // 当停止播放时，停止模拟
        const cleanup = () => {
          shouldContinue = false
        }
        
        // 返回清理函数
        return cleanup
      } else {
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
              setIsPlaying(false)
            })
        }
      }
    }
  }

  const handleSeek = (value: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = value
    setCurrentTime(value)
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
    </div>
  )
}

export default VideoPlayer