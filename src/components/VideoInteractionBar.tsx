import React from 'react'
import { Button, Tooltip } from 'antd'
import { 
  HeartOutlined, 
  HeartFilled, 
  UserAddOutlined, 
  UserDeleteOutlined,
  MessageOutlined,
  ShareAltOutlined,
  StarOutlined,
  StarFilled
} from '@ant-design/icons'

interface VideoInteractionBarProps {
  isLiked: boolean
  isFollowed: boolean
  likes: number
  commentsCount: number
  onToggleLike: () => void
  onToggleFollow: () => void
  onToggleComments: () => void
  onShare: () => void
  formatNumber: (num: number) => string
  likeAnimation: boolean
  followAnimation: boolean
  vertical?: boolean // 是否垂直布局
  showLabels?: boolean // 是否显示文字标签
}

const VideoInteractionBar: React.FC<VideoInteractionBarProps> = ({
  isLiked,
  isFollowed,
  likes,
  commentsCount,
  onToggleLike,
  onToggleFollow,
  onToggleComments,
  onShare,
  formatNumber,
  likeAnimation,
  followAnimation,
  vertical = true,
  showLabels = true
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: vertical ? 'column' : 'row',
    gap: vertical ? '16px' : '12px',
    alignItems: 'center',
    position: 'absolute',
    right: vertical ? '16px' : 'auto',
    bottom: vertical ? '80px' : '16px',
    left: vertical ? 'auto' : '16px',
    zIndex: 10
  }

  const buttonStyle: React.CSSProperties = {
    width: vertical ? '48px' : '40px',
    height: vertical ? '48px' : '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    border: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(8px)',
    fontSize: vertical ? '20px' : '16px'
  }

  const animatedButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    animation: likeAnimation ? 'likeAnimation 0.8s ease' : undefined,
    transform: likeAnimation ? 'scale(1.2)' : 'scale(1)',
    backgroundColor: isLiked ? 'rgba(255, 0, 80, 0.8)' : 'rgba(0, 0, 0, 0.6)'
  }

  const followButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    animation: followAnimation ? 'followAnimation 0.6s ease' : undefined,
    backgroundColor: isFollowed ? 'rgba(255, 0, 80, 0.8)' : 'rgba(0, 0, 0, 0.6)',
    transform: followAnimation ? 'scale(1.1)' : 'scale(1)'
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#fff',
    textAlign: 'center',
    marginTop: '4px',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
    minWidth: '32px'
  }

  const handleShare = () => {
    // 模拟分享功能
    if (navigator.share) {
      navigator.share({
        title: '抖音视频分享',
        text: '看看这个精彩的视频！',
        url: window.location.href,
      }).catch(console.error)
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href).then(() => {
        // 可以显示一个提示
        console.log('链接已复制到剪贴板')
      }).catch(console.error)
    }
    onShare()
  }

  return (
    <>
      {/* CSS 动画样式 */}
      <style>
        {`
          @keyframes likeAnimation {
            0% { transform: scale(1); }
            15% { transform: scale(1.3); }
            30% { transform: scale(1.1); }
            45% { transform: scale(1.25); }
            60% { transform: scale(1.1); }
            75% { transform: scale(1.15); }
            100% { transform: scale(1); }
          }
          
          @keyframes followAnimation {
            0% { transform: scale(1); }
            25% { transform: scale(1.15); }
            50% { transform: scale(1.05); }
            75% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          
          .interaction-button:hover {
            transform: scale(1.1);
            backgroundColor: rgba(255, 255, 255, 0.2);
          }
          
          .interaction-button.liked {
            backgroundColor: rgba(255, 0, 80, 0.8) !important;
          }
          
          .interaction-button.followed {
            backgroundColor: rgba(255, 0, 80, 0.8) !important;
          }

          .heart-particles {
            position: absolute;
            pointer-events: none;
            z-index: 1000;
          }
          
          @keyframes heartParticle {
            0% {
              transform: translateY(0) scale(0);
              opacity: 1;
            }
            15% {
              transform: translateY(-10px) scale(1);
            }
            100% {
              transform: translateY(-50px) scale(0);
              opacity: 0;
            }
          }
        `}
      </style>

      <div style={containerStyle}>
        {/* 点赞按钮 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Tooltip title={isLiked ? '取消点赞' : '点赞'} placement="left">
            <Button
              style={animatedButtonStyle}
              className={`interaction-button ${isLiked ? 'liked' : ''}`}
              onClick={onToggleLike}
              icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
            />
          </Tooltip>
          {showLabels && (
            <div style={labelStyle}>
              {formatNumber(likes)}
            </div>
          )}
        </div>

        {/* 关注按钮 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Tooltip title={isFollowed ? '取消关注' : '关注'} placement="left">
            <Button
              style={followButtonStyle}
              className={`interaction-button ${isFollowed ? 'followed' : ''}`}
              onClick={onToggleFollow}
              icon={isFollowed ? <UserDeleteOutlined /> : <UserAddOutlined />}
            />
          </Tooltip>
          {showLabels && (
            <div style={labelStyle}>
              {isFollowed ? '已关注' : '关注'}
            </div>
          )}
        </div>

        {/* 评论按钮 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Tooltip title="评论" placement="left">
            <Button
              style={buttonStyle}
              className="interaction-button"
              onClick={onToggleComments}
              icon={<MessageOutlined />}
            />
          </Tooltip>
          {showLabels && (
            <div style={labelStyle}>
              {formatNumber(commentsCount)}
            </div>
          )}
        </div>

        {/* 收藏按钮 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Tooltip title="收藏" placement="left">
            <Button
              style={buttonStyle}
              className="interaction-button"
              onClick={() => console.log('收藏功能待实现')}
              icon={<StarOutlined />}
            />
          </Tooltip>
          {showLabels && (
            <div style={labelStyle}>
              收藏
            </div>
          )}
        </div>

        {/* 分享按钮 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Tooltip title="分享" placement="left">
            <Button
              style={buttonStyle}
              className="interaction-button"
              onClick={handleShare}
              icon={<ShareAltOutlined />}
            />
          </Tooltip>
          {showLabels && (
            <div style={labelStyle}>
              分享
            </div>
          )}
        </div>
      </div>

      {/* 点赞粒子效果 */}
      {likeAnimation && (
        <div 
          style={{
            position: 'absolute',
            right: '40px',
            bottom: '150px',
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: Math.random() * 40 - 20,
                top: Math.random() * 20 - 10,
                color: '#ff0050',
                fontSize: '16px',
                animation: `heartParticle 1s ease-out ${i * 0.1}s`,
                animationFillMode: 'both'
              }}
            >
              ❤️
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default VideoInteractionBar



