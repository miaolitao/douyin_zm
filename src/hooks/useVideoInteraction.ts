import { useState, useCallback } from 'react'
import { Video } from '../types/video'

// 评论接口定义
export interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  createdAt: string
  likes: number
  isLiked: boolean
  replies: Reply[]
  parentId?: string
}

export interface Reply {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  createdAt: string
  likes: number
  isLiked: boolean
  replyTo?: string // 回复对象的用户名
}

export interface InteractionState {
  isLiked: boolean
  isFollowed: boolean
  likes: number
  comments: Comment[]
  commentsCount: number
  isCommentsVisible: boolean
  likeAnimation: boolean
  followAnimation: boolean
}

export interface InteractionActions {
  toggleLike: () => void
  toggleFollow: () => void
  toggleComments: () => void
  addComment: (content: string) => void
  addReply: (commentId: string, content: string, replyTo?: string) => void
  toggleCommentLike: (commentId: string, replyId?: string) => void
  deleteComment: (commentId: string) => void
  deleteReply: (commentId: string, replyId: string) => void
}

export const useVideoInteraction = (video: Video) => {
  // 初始化状态
  const [state, setState] = useState<InteractionState>({
    isLiked: video.isLiked || false,
    isFollowed: video.isFollowed || false,
    likes: video.likes || 0,
    comments: [],
    commentsCount: video.comments || 0,
    isCommentsVisible: false,
    likeAnimation: false,
    followAnimation: false
  })

  // 生成模拟评论数据
  const generateMockComments = useCallback(() => {
    const mockUsers = [
      { id: '1', name: '抖音用户_001', avatar: 'https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_1.jpeg' },
      { id: '2', name: '理理小不点', avatar: 'https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_2.jpeg' },
      { id: '3', name: '舞蹈达人', avatar: 'https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_3.jpeg' },
      { id: '4', name: '音乐爱好者', avatar: 'https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_4.jpeg' },
      { id: '5', name: '御姐范儿', avatar: 'https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_5.jpeg' }
    ]

    const mockComments = [
      '太好看了！！！',
      '这个舞蹈真的很棒',
      '求背景音乐',
      '小姐姐好美啊',
      '这个卡点太绝了',
      '学会了学会了',
      '每天都要来看一遍',
      '这就是传说中的御姐范吗',
      '动作好标准',
      '爱了爱了',
      '太有感觉了',
      '这个BGM绝了',
      '小姐姐跳舞真好看',
      '节奏感很棒',
      '这个视频火了火了'
    ]

    const comments: Comment[] = []
    const commentCount = Math.floor(Math.random() * 8) + 3 // 3-10个评论

    for (let i = 0; i < commentCount; i++) {
      const user = mockUsers[Math.floor(Math.random() * mockUsers.length)]
      const content = mockComments[Math.floor(Math.random() * mockComments.length)]
      
      const comment: Comment = {
        id: `comment_${Date.now()}_${i}`,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content,
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(), // 最近7天内
        likes: Math.floor(Math.random() * 100),
        isLiked: Math.random() > 0.8,
        replies: []
      }

      // 随机添加一些回复
      const replyCount = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0
      for (let j = 0; j < replyCount; j++) {
        const replyUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
        const replyContent = mockComments[Math.floor(Math.random() * mockComments.length)]
        
        comment.replies.push({
          id: `reply_${Date.now()}_${i}_${j}`,
          userId: replyUser.id,
          userName: replyUser.name,
          userAvatar: replyUser.avatar,
          content: replyContent,
          createdAt: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
          likes: Math.floor(Math.random() * 20),
          isLiked: Math.random() > 0.9,
          replyTo: j > 0 && Math.random() > 0.5 ? comment.replies[j - 1].userName : undefined
        })
      }

      comments.push(comment)
    }

    return comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [])

  // 点赞功能
  const toggleLike = useCallback(() => {
    setState(prev => {
      const newIsLiked = !prev.isLiked
      const newLikes = newIsLiked ? prev.likes + 1 : prev.likes - 1
      
      // 触发点赞动画
      setTimeout(() => {
        setState(current => ({ ...current, likeAnimation: false }))
      }, 800)
      
      return {
        ...prev,
        isLiked: newIsLiked,
        likes: newLikes,
        likeAnimation: newIsLiked // 只在点赞时播放动画
      }
    })
  }, [])

  // 关注功能
  const toggleFollow = useCallback(() => {
    setState(prev => {
      const newIsFollowed = !prev.isFollowed
      
      // 触发关注动画
      setTimeout(() => {
        setState(current => ({ ...current, followAnimation: false }))
      }, 600)
      
      return {
        ...prev,
        isFollowed: newIsFollowed,
        followAnimation: true
      }
    })
  }, [])

  // 切换评论显示
  const toggleComments = useCallback(() => {
    setState(prev => {
      if (!prev.isCommentsVisible && prev.comments.length === 0) {
        // 首次打开评论时生成模拟数据
        const mockComments = generateMockComments()
        return {
          ...prev,
          isCommentsVisible: true,
          comments: mockComments,
          commentsCount: mockComments.length
        }
      }
      
      return {
        ...prev,
        isCommentsVisible: !prev.isCommentsVisible
      }
    })
  }, [generateMockComments])

  // 添加评论
  const addComment = useCallback((content: string) => {
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      userId: 'current_user',
      userName: '我',
      userAvatar: 'https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_user.jpeg',
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: []
    }

    setState(prev => ({
      ...prev,
      comments: [newComment, ...prev.comments],
      commentsCount: prev.commentsCount + 1
    }))
  }, [])

  // 添加回复
  const addReply = useCallback((commentId: string, content: string, replyTo?: string) => {
    const newReply: Reply = {
      id: `reply_${Date.now()}`,
      userId: 'current_user',
      userName: '我',
      userAvatar: 'https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_user.jpeg',
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replyTo
    }

    setState(prev => ({
      ...prev,
      comments: prev.comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      )
    }))
  }, [])

  // 切换评论点赞
  const toggleCommentLike = useCallback((commentId: string, replyId?: string) => {
    setState(prev => ({
      ...prev,
      comments: prev.comments.map(comment => {
        if (comment.id === commentId) {
          if (replyId) {
            // 点赞回复
            return {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === replyId
                  ? {
                      ...reply,
                      isLiked: !reply.isLiked,
                      likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
                    }
                  : reply
              )
            }
          } else {
            // 点赞评论
            return {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
            }
          }
        }
        return comment
      })
    }))
  }, [])

  // 删除评论
  const deleteComment = useCallback((commentId: string) => {
    setState(prev => ({
      ...prev,
      comments: prev.comments.filter(comment => comment.id !== commentId),
      commentsCount: Math.max(0, prev.commentsCount - 1)
    }))
  }, [])

  // 删除回复
  const deleteReply = useCallback((commentId: string, replyId: string) => {
    setState(prev => ({
      ...prev,
      comments: prev.comments.map(comment =>
        comment.id === commentId
          ? { ...comment, replies: comment.replies.filter(reply => reply.id !== replyId) }
          : comment
      )
    }))
  }, [])

  // 格式化时间
  const formatTime = useCallback((dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days > 0) return `${days}天前`
    if (hours > 0) return `${hours}小时前`
    if (minutes > 0) return `${minutes}分钟前`
    return '刚刚'
  }, [])

  // 格式化数字
  const formatNumber = useCallback((num: number): string => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }, [])

  const actions: InteractionActions = {
    toggleLike,
    toggleFollow,
    toggleComments,
    addComment,
    addReply,
    toggleCommentLike,
    deleteComment,
    deleteReply
  }

  return {
    state,
    actions,
    formatTime,
    formatNumber
  }
}

















