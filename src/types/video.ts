export interface Author {
  id: string
  name: string
  avatar: string
  followers: number
  verified: boolean
  description: string
}

export interface Video {
  id: string
  title: string
  description: string
  poster: string
  videoUrl: string
  duration: number
  views: number
  likes: number
  comments: number
  shares: number
  category: string
  tags: string[]
  author: Author
  createdAt: string
  isLiked: boolean
  isFollowed: boolean
  music?: {
    name: string
    artist: string
    url?: string
  }
  location?: string
  hashtags: string[]
  isLocal?: boolean // 标记是否为本地视频
}

// VideoData 接口已废弃，请使用 Video 接口
// 保留此接口仅为向后兼容
export interface VideoData extends Video {}