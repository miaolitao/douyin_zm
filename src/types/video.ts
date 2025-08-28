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

export interface VideoData {
  id: string
  url: string
  poster: string
  title: string
  author: {
    name: string
    avatar: string
  }
  description: string
  category: string
  likes: number
  comments: number
  shares: number
}