import React, { useState } from 'react'
import { Modal, Input, Button, Avatar, Divider, Tooltip } from 'antd'
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
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={400}
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '16px', fontWeight: 600 }}>评论 ({comments.length})</span>
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={onClose}
            style={{ color: '#86909c' }}
          />
        </div>
      }
      closeIcon={null}
      styles={{
        body: { maxHeight: '60vh', overflowY: 'auto' }
      }}
    >
      {/* 添加评论输入框 */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <Avatar 
            src="https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_user.jpeg" 
            size={32}
          />
          <div style={{ flex: 1 }}>
            <TextArea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="说点什么..."
              autoSize={{ minRows: 2, maxRows: 4 }}
              style={{ 
                border: '1px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <Button
                type="primary"
                size="small"
                icon={<SendOutlined />}
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                style={{
                  backgroundColor: '#ff0050',
                  borderColor: '#ff0050',
                  borderRadius: '16px',
                  height: '32px',
                  paddingLeft: '16px',
                  paddingRight: '16px'
                }}
              >
                发送
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Divider style={{ margin: '16px 0' }} />

      {/* 评论列表 */}
      <div style={{ minHeight: '200px' }}>
        {comments.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#86909c', 
            padding: '40px 0',
            fontSize: '14px'
          }}>
            暂无评论，快来发表第一条评论吧~
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} style={{ marginBottom: '16px' }}>
              {/* 主评论 */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <Avatar src={comment.userAvatar} size={32} />
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: 600, 
                      color: '#1f2329' 
                    }}>
                      {comment.userName}
                    </span>
                    <span style={{ 
                      fontSize: '12px', 
                      color: '#86909c', 
                      marginLeft: '8px' 
                    }}>
                      {formatTime(comment.createdAt)}
                    </span>
                  </div>
                  
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#1f2329', 
                    lineHeight: '20px',
                    marginBottom: '8px'
                  }}>
                    {comment.content}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Button
                      type="text"
                      size="small"
                      onClick={() => onToggleCommentLike(comment.id)}
                      style={{ 
                        color: comment.isLiked ? '#ff0050' : '#86909c',
                        padding: 0,
                        height: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
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
                        color: '#86909c',
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
                          color: '#f53f3f',
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
                <div style={{ marginTop: '12px', marginLeft: '40px' }}>
                  {comment.replies.map((reply) => (
                    <div key={reply.id} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <Avatar src={reply.userAvatar} size={24} />
                        <div style={{ flex: 1 }}>
                          <div style={{ marginBottom: '4px' }}>
                            <span style={{ 
                              fontSize: '13px', 
                              fontWeight: 600, 
                              color: '#1f2329' 
                            }}>
                              {reply.userName}
                            </span>
                            {reply.replyTo && (
                              <>
                                <span style={{ color: '#86909c', margin: '0 4px' }}>回复</span>
                                <span style={{ 
                                  fontSize: '13px', 
                                  color: '#165dff'
                                }}>
                                  @{reply.replyTo}
                                </span>
                              </>
                            )}
                            <span style={{ 
                              fontSize: '11px', 
                              color: '#86909c', 
                              marginLeft: '8px' 
                            }}>
                              {formatTime(reply.createdAt)}
                            </span>
                          </div>
                          
                          <div style={{ 
                            fontSize: '13px', 
                            color: '#1f2329', 
                            lineHeight: '18px',
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
                                color: reply.isLiked ? '#ff0050' : '#86909c',
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
                                color: '#86909c',
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
                                  color: '#f53f3f',
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
                <div style={{ marginTop: '12px', marginLeft: '40px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <Avatar 
                      src="https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_user.jpeg" 
                      size={24}
                    />
                    <div style={{ flex: 1 }}>
                      <TextArea
                        value={replyStates[comment.id]?.content || ''}
                        onChange={(e) => handleReplyContentChange(comment.id, e.target.value)}
                        placeholder={`回复 @${replyStates[comment.id]?.replyTo}...`}
                        autoSize={{ minRows: 2, maxRows: 3 }}
                        style={{ 
                          border: '1px solid #e1e5e9',
                          borderRadius: '6px',
                          fontSize: '13px'
                        }}
                      />
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        gap: '8px',
                        marginTop: '6px' 
                      }}>
                        <Button
                          size="small"
                          onClick={() => handleHideReply(comment.id)}
                          style={{ height: '28px', fontSize: '12px' }}
                        >
                          取消
                        </Button>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => handleAddReply(comment.id)}
                          disabled={!replyStates[comment.id]?.content?.trim()}
                          style={{
                            backgroundColor: '#ff0050',
                            borderColor: '#ff0050',
                            height: '28px',
                            fontSize: '12px'
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
    </Modal>
  )
}

export default CommentModal

