import React, { useState } from 'react'
import { Drawer, Input, Button, Avatar, Divider, Tooltip } from 'antd'
import { SendOutlined, HeartOutlined, HeartFilled, CloseOutlined } from '@ant-design/icons'
import { Comment, Reply } from '../hooks/useVideoInteraction'

const { TextArea } = Input

interface CommentModalProps {
  visible: boolean
  onClose: () => void
  comments: Comment[]
  onAddComment: (content: string) => void
  onAddReply: (commentId: string, content: string, replyTo?: string) => void
  onToggleCommentLike: (commentId: string, replyId?: string) => void
  onDeleteComment: (commentId: string) => void
  onDeleteReply: (commentId: string, replyId: string) => void
  formatTime: (dateString: string) => string
  formatNumber: (num: number) => string
}

const CommentModal: React.FC<CommentModalProps> = ({
  visible,
  onClose,
  comments,
  onAddComment,
  onAddReply,
  onToggleCommentLike,
  onDeleteComment,
  onDeleteReply,
  formatTime,
  formatNumber
}) => {
  const [newComment, setNewComment] = useState('')
  const [replyStates, setReplyStates] = useState<{[key: string]: { content: string; replyTo?: string; show: boolean }}>({})

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim())
      setNewComment('')
    }
  }

  const handleShowReply = (commentId: string, replyTo?: string) => {
    setReplyStates(prev => ({
      ...prev,
      [commentId]: {
        content: '',
        replyTo,
        show: true
      }
    }))
  }

  const handleHideReply = (commentId: string) => {
    setReplyStates(prev => ({
      ...prev,
      [commentId]: { ...prev[commentId], show: false, content: '' }
    }))
  }

  const handleAddReply = (commentId: string) => {
    const replyState = replyStates[commentId]
    if (replyState && replyState.content.trim()) {
      onAddReply(commentId, replyState.content.trim(), replyState.replyTo)
      handleHideReply(commentId)
    }
  }

  const handleReplyContentChange = (commentId: string, content: string) => {
    setReplyStates(prev => ({
      ...prev,
      [commentId]: { ...prev[commentId], content }
    }))
  }

  return (
    <Drawer
      open={visible}
      onClose={onClose}
      width={360}
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
          <span style={{ fontSize: '16px', fontWeight: 600 }}>评论 ({comments.length})</span>
        </div>
      }
      closeIcon={<CloseOutlined style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '16px' }} />}
      styles={{
        header: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '16px 20px',
          backgroundColor: 'rgba(22, 24, 35, 0.95)'
        },
        body: {
          padding: '0',
          backgroundColor: 'rgba(22, 24, 35, 0.95)',
          overflowY: 'auto'
        },
        wrapper: {
          boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.2)'
        }
      }}
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
      maskStyle={{ backgroundColor: 'transparent' }} // Allow interaction with video
    >
      {/* 评论列表 */}
      <div style={{ padding: '20px 20px 100px' }}>
        {comments.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: 'rgba(255, 255, 255, 0.5)', 
            padding: '60px 0',
            fontSize: '14px'
          }}>
            暂无评论，快来发表第一条评论吧~
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} style={{ marginBottom: '24px' }}>
              {/* 主评论 */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Avatar 
                  src={comment.userAvatar} 
                  size={32} 
                  style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ 
                      fontSize: '13px', 
                      fontWeight: 500, 
                      color: 'rgba(255, 255, 255, 0.5)' 
                    }}>
                      {comment.userName}
                    </span>
                    <span style={{ 
                      fontSize: '12px', 
                      color: 'rgba(255, 255, 255, 0.3)', 
                      marginLeft: '8px' 
                    }}>
                      {formatTime(comment.createdAt)}
                    </span>
                  </div>
                  
                  <div style={{ 
                    fontSize: '14px', 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    lineHeight: '1.5',
                    marginBottom: '8px',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {comment.content}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Button
                      type="text"
                      size="small"
                      onClick={() => onToggleCommentLike(comment.id)}
                      style={{ 
                        color: comment.isLiked ? '#fe2c55' : 'rgba(255, 255, 255, 0.5)',
                        padding: 0,
                        height: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px'
                      }}
                    >
                      {comment.isLiked ? <HeartFilled /> : <HeartOutlined />}
                      {comment.likes > 0 && <span>{formatNumber(comment.likes)}</span>}
                    </Button>
                    
                    <Button
                      type="text"
                      size="small"
                      onClick={() => handleShowReply(comment.id, comment.userName)}
                      style={{ 
                        color: 'rgba(255, 255, 255, 0.5)',
                        padding: 0,
                        height: 'auto',
                        fontSize: '12px'
                      }}
                    >
                      回复
                    </Button>
                    
                    {comment.userId === 'current_user' && (
                      <Button
                        type="text"
                        size="small"
                        onClick={() => onDeleteComment(comment.id)}
                        style={{ 
                          color: 'rgba(255, 255, 255, 0.3)',
                          padding: 0,
                          height: 'auto',
                          fontSize: '12px'
                        }}
                      >
                        删除
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* 回复列表 */}
              {comment.replies.length > 0 && (
                <div style={{ marginTop: '16px', marginLeft: '44px' }}>
                  {comment.replies.map((reply) => (
                    <div key={reply.id} style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <Avatar src={reply.userAvatar} size={24} style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ marginBottom: '4px' }}>
                            <span style={{ 
                              fontSize: '12px', 
                              fontWeight: 500, 
                              color: 'rgba(255, 255, 255, 0.5)' 
                            }}>
                              {reply.userName}
                            </span>
                            {reply.replyTo && (
                              <>
                                <span style={{ color: 'rgba(255, 255, 255, 0.3)', margin: '0 4px', fontSize: '12px' }}>回复</span>
                                <span style={{ 
                                  fontSize: '12px', 
                                  color: 'rgba(255, 255, 255, 0.7)'
                                }}>
                                  {reply.replyTo}
                                </span>
                              </>
                            )}
                            <span style={{ 
                              fontSize: '11px', 
                              color: 'rgba(255, 255, 255, 0.3)', 
                              marginLeft: '8px' 
                            }}>
                              {formatTime(reply.createdAt)}
                            </span>
                          </div>
                          
                          <div style={{ 
                            fontSize: '13px', 
                            color: 'rgba(255, 255, 255, 0.9)', 
                            lineHeight: '1.5',
                            marginBottom: '6px'
                          }}>
                            {reply.content}
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Button
                              type="text"
                              size="small"
                              onClick={() => onToggleCommentLike(comment.id, reply.id)}
                              style={{ 
                                color: reply.isLiked ? '#fe2c55' : 'rgba(255, 255, 255, 0.5)',
                                padding: 0,
                                height: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px',
                                fontSize: '11px'
                              }}
                            >
                              {reply.isLiked ? <HeartFilled /> : <HeartOutlined />}
                              {reply.likes > 0 && <span>{formatNumber(reply.likes)}</span>}
                            </Button>
                            
                            <Button
                              type="text"
                              size="small"
                              onClick={() => handleShowReply(comment.id, reply.userName)}
                              style={{ 
                                color: 'rgba(255, 255, 255, 0.5)',
                                padding: 0,
                                height: 'auto',
                                fontSize: '11px'
                              }}
                            >
                              回复
                            </Button>
                            
                            {reply.userId === 'current_user' && (
                              <Button
                                type="text"
                                size="small"
                                onClick={() => onDeleteReply(comment.id, reply.id)}
                                style={{ 
                                  color: 'rgba(255, 255, 255, 0.3)',
                                  padding: 0,
                                  height: 'auto',
                                  fontSize: '11px'
                                }}
                              >
                                删除
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 回复输入框 */}
              {replyStates[comment.id]?.show && (
                <div style={{ marginTop: '12px', marginLeft: '44px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <Avatar 
                      src="https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_user.jpeg" 
                      size={24}
                      style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <TextArea
                        value={replyStates[comment.id]?.content || ''}
                        onChange={(e) => handleReplyContentChange(comment.id, e.target.value)}
                        placeholder={`回复 @${replyStates[comment.id]?.replyTo}...`}
                        autoSize={{ minRows: 2, maxRows: 3 }}
                        style={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          fontSize: '13px',
                          color: '#fff'
                        }}
                      />
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        gap: '8px',
                        marginTop: '8px' 
                      }}>
                        <Button
                          size="small"
                          onClick={() => handleHideReply(comment.id)}
                          style={{ 
                            height: '28px', 
                            fontSize: '12px',
                            backgroundColor: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'rgba(255, 255, 255, 0.7)'
                          }}
                        >
                          取消
                        </Button>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => handleAddReply(comment.id)}
                          disabled={!replyStates[comment.id]?.content?.trim()}
                          style={{
                            backgroundColor: '#fe2c55',
                            borderColor: '#fe2c55',
                            height: '28px',
                            fontSize: '12px',
                            color: '#fff'
                          }}
                        >
                          回复
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 底部输入框 - 固定在底部 */}
      <div style={{ 
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px 20px',
        backgroundColor: 'rgba(22, 24, 35, 0.98)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-end'
      }}>
        <Avatar 
          src="https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_user.jpeg" 
          size={32}
          style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}
        />
        <div style={{ flex: 1, position: 'relative' }}>
          <TextArea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="善语结善缘，恶语伤人心"
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#fff',
              paddingRight: '40px'
            }}
          />
          <div style={{ 
            position: 'absolute', 
            right: '8px', 
            bottom: '4px'
          }}>
            <Button
              type="text"
              size="small"
              icon={<SendOutlined />}
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              style={{
                color: newComment.trim() ? '#fe2c55' : 'rgba(255, 255, 255, 0.3)',
                fontSize: '16px'
              }}
            />
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default CommentModal

















