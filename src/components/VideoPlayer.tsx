import React, { useRef, useState, useEffect } from 'react';
import { Button, Slider } from 'antd';
import './VideoPlayer.css';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
  HeartOutlined,
  MessageOutlined,
  ShareAltOutlined
} from '@ant-design/icons';

interface VideoPlayerProps {
  videoUrl: string;
  poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // 自动播放可能被浏览器阻止，这里不需要处理错误
        setIsPlaying(false);
      });
    }
  }, [videoUrl]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.volume = value;
      setVolume(value);
    }
  };

  const handleVideoEnd = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="video-player" style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%', 
      backgroundColor: '#000',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          borderRadius: '8px'
        }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleVideoEnd}
        onClick={togglePlay}
        loop
      />
      
      <div className="controls" style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px 20px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        ':hover': { opacity: 1 }
      }}>
        <Button
          type="text"
          icon={isPlaying ? <PauseCircleOutlined style={{ fontSize: '28px', color: '#fff' }} /> : <PlayCircleOutlined style={{ fontSize: '28px', color: '#fff' }} />}
          onClick={togglePlay}
          style={{ padding: '4px' }}
        />
        
        <div style={{ flex: 1, padding: '0 8px' }}>
          <Slider
            value={currentTime}
            max={duration}
            onChange={(value) => {
              if (videoRef.current) {
                videoRef.current.currentTime = value;
              }
            }}
            tooltip={{ formatter: formatTime }}
            style={{ margin: 0 }}
          />
        </div>
        
        <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'system-ui' }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        
        <div style={{ position: 'relative' }}>
          <Button
            type="text"
            icon={<SoundOutlined style={{ fontSize: '24px', color: '#fff' }} />}
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
            style={{ padding: '4px' }}
          />
          {showVolumeSlider && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '36px',
              height: '120px',
              padding: '16px 0',
              background: 'rgba(0,0,0,0.85)',
              borderRadius: '8px',
              marginBottom: '8px'
            }}>
              <Slider
                vertical
                value={volume}
                min={0}
                max={1}
                step={0.1}
                onChange={handleVolumeChange}
                style={{ margin: 0 }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="interaction-buttons" style={{
        position: 'absolute',
        right: '20px',
        bottom: '100px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Button
            type="text"
            icon={<HeartOutlined style={{ fontSize: '28px', color: isLiked ? '#fe2c55' : '#fff' }} />}
            onClick={() => setIsLiked(!isLiked)}
            style={{ color: '#fff' }}
          />
          <div style={{ color: '#fff', fontSize: '14px', marginTop: '4px', fontWeight: 600 }}>123.4k</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button type="text" icon={<MessageOutlined style={{ fontSize: '28px', color: '#fff' }} />} style={{ color: '#fff' }} />
          <div style={{ color: '#fff', fontSize: '14px', marginTop: '4px', fontWeight: 600 }}>2.1k</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button type="text" icon={<ShareAltOutlined style={{ fontSize: '28px', color: '#fff' }} />} style={{ color: '#fff' }} />
          <div style={{ color: '#fff', fontSize: '14px', marginTop: '4px', fontWeight: 600 }}>分享</div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;