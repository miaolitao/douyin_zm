import React from 'react'
import { Button, Tooltip } from 'antd'
import { 
  HeartFilled, 
  MessageFilled,
  ShareAltOutlined,
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
    gap: vertical ? '20px' : '12px',
    alignItems: 'center',
    position: 'absolute',
    right: vertical ? '16px' : 'auto',
    bottom: vertical ? '100px' : '16px',
    left: vertical ? 'auto' : '16px',
    zIndex: 10
  }

  const buttonStyle: React.CSSProperties = {
    width: vertical ? '48px' : '40px',
    height: vertical ? '48px' : '40px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: vertical ? '32px' : '24px',
    padding: 0,
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
  }

  const animatedButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    animation: likeAnimation ? 'likeAnimation 0.8s ease' : undefined,
    transform: likeAnimation ? 'scale(1.2)' : 'scale(1)',
    color: isLiked ? '#fe2c55' : '#fff'
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#fff',
    textAlign: 'center',
    marginTop: '2px',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
    minWidth: '32px',
    fontWeight: 500
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
          
          .interaction-icon:hover {
            transform: scale(1.1);
            opacity: 0.9;
          }
          
          .interaction-icon:active {
            transform: scale(0.9);
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
        {/* 关注按钮 (头像下方的加号，通常集成在头像组件中，这里简化处理) */}
        
        {/* 点赞按钮 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Tooltip title={isLiked ? '取消点赞' : '点赞'} placement="left">
            <Button
              style={animatedButtonStyle}
              className="interaction-icon"
              onClick={onToggleLike}
              icon={<HeartFilled />}
            />
          </Tooltip>
          {showLabels && (
            <div style={labelStyle}>
              {formatNumber(likes)}
            </div>
          )}
        </div>

        {/* 评论按钮 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Tooltip title="评论" placement="left">
            <Button
              style={buttonStyle}
              className="interaction-icon"
              onClick={onToggleComments}
              icon={<MessageFilled />}
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
              className="interaction-icon"
              onClick={() => console.log('收藏功能待实现')}
              icon={<StarFilled />}
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
              className="interaction-icon"
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
                color: '#fe2c55',
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

















