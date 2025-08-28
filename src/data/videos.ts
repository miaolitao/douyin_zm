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
}

export const categories = ['全部', '精选', '推荐', '关注', '朋友', '游戏', '二次元', '音乐', '美食', '知识', '体育', '时尚', '旅行', '搞笑', '影视', '生活']

// 注意：sampleVideos 现在由 localDataLoader 提供，这里保留空数组作为备用
export const sampleVideos: Video[] = []

// 用户数据
export interface User {
  id: string
  name: string
  avatar: string
  followers: number
  following: number
  likes: number
  verified: boolean
  description: string
  videos: Video[]
}

export const currentUser: User = {
  id: 'current_user',
  name: '我的抖音',
  avatar: 'https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_724c0d4aa68cf5c9c275e3bf3949f029.jpeg?card_type=303&column_n=0&from=327834062',
  followers: 1234,
  following: 567,
  likes: 89000,
  verified: false,
  description: '记录美好生活',
  videos: []
}

// 搜索历史
export const searchHistory = [
  '理理小不点',
  '舞蹈',
  '音乐',
  '御姐',
  '卡点舞'
]

// 热门搜索
export const hotSearches = [
  '理理小不点',
  'DL运镜',
  '御姐',
  '卡点舞',
  '电影感',
  '港风复古',
  '腹肌马甲线',
  '夹心摇3'
]

