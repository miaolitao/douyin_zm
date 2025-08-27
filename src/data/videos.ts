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
  }
  location?: string
  hashtags: string[]
}

export const categories = ['全部', '精选', '推荐', '关注', '朋友', '游戏', '二次元', '音乐', '美食', '知识', '体育', '时尚', '旅行', '搞笑', '影视', '生活']

export const sampleVideos: Video[] = [
  {
    id: 'real1',
    title: '为了这个骚曲一定得配张照片',
    description: '为了这个骚曲一定得配张照片，音乐和画面的完美结合',
    poster: 'https://p9-pc-sign.douyinpic.com/tos-cn-i-0813c000-ce/oQyEGAeB0Eg0yTFiiAAkiAEaAEKsfVHwOeIlCo~noop.jpeg?biz_tag=pcweb_cover&card_type=303&column_n=0&from=327834062&l=2025082619172323CDE1A7152188145906&lk3s=138a59ce&s=PackSourceEnum_SEARCH&se=false&x-expires=1757415600&x-signature=NPEWTSYEMNC2NjSObyfxDl8%2Fp%2BY%3D',
    videoUrl: 'https://www.douyin.com/aweme/v1/play/?video_id=v1e00fgi0000d1kb7anog65jpkmfes8g&line=0&file_id=3b2ff49702834b56b8367271b27338d4&sign=72275cc0b46d593b60831ebe40cb520b&is_play_url=1&source=PackSourceEnum_PUBLISH_SEARCH',
    duration: 45,
    views: 2500000,
    likes: 180000,
    comments: 8500,
    shares: 3200,
    category: '音乐',
    tags: ['音乐', '骚曲', '配乐'],
    author: {
      id: 'real_user1',
      name: '音乐创作者',
      avatar: 'https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_724c0d4aa68cf5c9c275e3bf3949f029.jpeg?card_type=303&column_n=0&from=327834062',
      followers: 1800000,
      verified: true,
      description: '专业音乐制作人，创作优质音乐内容'
    },
    createdAt: '2024-08-26',
    isLiked: false,
    isFollowed: false,
    music: {
      name: '骚曲配乐',
      artist: '原创音乐',
      url: 'https://lf9-music-east.douyinstatic.com/obj/ies-music-hj/7449791085401934649.mp3'
    },
    location: '北京',
    hashtags: ['#音乐', '#骚曲', '#配乐', '#原创', '#音乐制作']
  },
  {
    id: '1',
    title: '超治愈！小猫咪第一次看到雪的反应太可爱了',
    description: '小猫咪第一次看到雪，反应太可爱了，萌化了我的心',
    poster: 'https://via.placeholder.com/300x400/ff0050/ffffff?text=猫咪+雪',
    videoUrl: 'https://example.com/video1.mp4',
    duration: 15,
    views: 1250000,
    likes: 89000,
    comments: 3200,
    shares: 1500,
    category: '搞笑',
    tags: ['萌宠', '治愈', '可爱'],
    author: {
      id: 'user1',
      name: '萌宠日记',
      avatar: 'https://via.placeholder.com/40x40/ff0050/ffffff?text=萌',
      followers: 1250000,
      verified: true,
      description: '分享萌宠日常，治愈你的每一天'
    },
    createdAt: '2024-01-15',
    isLiked: false,
    isFollowed: false,
    music: {
      name: '治愈系BGM',
      artist: '原创音乐'
    },
    location: '北京',
    hashtags: ['#萌宠', '#治愈', '#可爱', '#猫咪', '#雪']
  },
  {
    id: '2',
    title: '深夜食堂：自制麻辣香锅，香辣过瘾！',
    description: '深夜美食分享，自制麻辣香锅的详细教程',
    poster: 'https://via.placeholder.com/300x400/ff6b35/ffffff?text=麻辣香锅',
    videoUrl: 'https://example.com/video2.mp4',
    duration: 45,
    views: 890000,
    likes: 67000,
    comments: 2100,
    shares: 890,
    category: '美食',
    tags: ['美食', '麻辣', '教程'],
    author: {
      id: 'user2',
      name: '美食达人小王',
      avatar: 'https://via.placeholder.com/40x40/ff6b35/ffffff?text=美',
      followers: 890000,
      verified: false,
      description: '分享美食制作技巧'
    },
    createdAt: '2024-01-14',
    isLiked: false,
    isFollowed: false,
    music: {
      name: '深夜食堂',
      artist: '美食BGM'
    },
    location: '成都',
    hashtags: ['#美食', '#麻辣香锅', '#深夜食堂', '#教程', '#川菜']
  },
  {
    id: '3',
    title: '超燃！街舞少年挑战高难度动作',
    description: '街舞少年展示超高难度动作，燃爆全场',
    poster: 'https://via.placeholder.com/300x400/00d4ff/ffffff?text=街舞',
    videoUrl: 'https://example.com/video3.mp4',
    duration: 32,
    views: 2100000,
    likes: 156000,
    comments: 8900,
    shares: 3200,
    category: '舞蹈',
    tags: ['街舞', '燃', '高难度'],
    author: {
      id: 'user3',
      name: '街舞小王子',
      avatar: 'https://via.placeholder.com/40x40/00d4ff/ffffff?text=舞',
      followers: 2100000,
      verified: true,
      description: '专业街舞教学，燃爆你的舞蹈细胞'
    },
    createdAt: '2024-01-13',
    isLiked: false,
    isFollowed: false,
    music: {
      name: '燃爆BGM',
      artist: '街舞音乐'
    },
    location: '上海',
    hashtags: ['#街舞', '#燃', '#高难度', '#舞蹈', '#挑战']
  },
  {
    id: '4',
    title: '日本京都樱花季，美到窒息！',
    description: '日本京都樱花季的绝美景色，每一帧都是壁纸',
    poster: 'https://via.placeholder.com/300x400/ff69b4/ffffff?text=樱花',
    videoUrl: 'https://example.com/video4.mp4',
    duration: 28,
    views: 1560000,
    likes: 134000,
    comments: 5600,
    shares: 2100,
    category: '旅行',
    tags: ['旅行', '樱花', '日本'],
    author: {
      id: 'user4',
      name: '旅行摄影师',
      avatar: 'https://via.placeholder.com/40x40/ff69b4/ffffff?text=旅',
      followers: 1560000,
      verified: true,
      description: '专业旅行摄影，记录世界美好'
    },
    createdAt: '2024-01-12',
    isLiked: false,
    isFollowed: false,
    music: {
      name: '樱花季',
      artist: '日本民谣'
    },
    location: '京都',
    hashtags: ['#旅行', '#樱花', '#日本', '#京都', '#摄影']
  },
  {
    id: '5',
    title: '超简单！3分钟学会弹吉他',
    description: '零基础吉他教学，3分钟学会弹奏简单歌曲',
    poster: 'https://via.placeholder.com/300x400/9c27b0/ffffff?text=吉他',
    videoUrl: 'https://example.com/video5.mp4',
    duration: 180,
    views: 890000,
    likes: 78000,
    comments: 3400,
    shares: 1200,
    category: '音乐',
    tags: ['音乐', '吉他', '教学'],
    author: {
      id: 'user5',
      name: '吉他老师阿杰',
      avatar: 'https://via.placeholder.com/40x40/9c27b0/ffffff?text=吉',
      followers: 890000,
      verified: false,
      description: '专业吉他教学，让音乐触手可及'
    },
    createdAt: '2024-01-11',
    isLiked: false,
    isFollowed: false,
    music: {
      name: '小星星',
      artist: '经典儿歌'
    },
    location: '广州',
    hashtags: ['#音乐', '#吉他', '#教学', '#零基础', '#弹唱']
  }
]

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
  avatar: 'https://via.placeholder.com/40x40/ff0050/ffffff?text=我',
  followers: 1234,
  following: 567,
  likes: 89000,
  verified: false,
  description: '记录美好生活',
  videos: []
}

// 搜索历史
export const searchHistory = [
  '猫咪',
  '美食教程',
  '街舞',
  '旅行',
  '吉他教学'
]

// 热门搜索
export const hotSearches = [
  '热门话题1',
  '热门话题2',
  '热门话题3',
  '热门话题4',
  '热门话题5'
]