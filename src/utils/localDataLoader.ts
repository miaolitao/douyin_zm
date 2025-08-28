import { Video, Author } from '../types/video'

interface RawVideoData {
  aweme_id: string
  title: string
  desc: string
  create_time: number
  user_id: string
  nickname: string
  avatar: string
  liked_count: string
  comment_count: string
  share_count: string
  cover_url: string
  video_download_url: string
  music_download_url: string
  user_signature?: string
  ip_location?: string
}

// 本地数据加载器
export class LocalDataLoader {
  private static instance: LocalDataLoader
  private videosData: RawVideoData[] = []
  private processedVideos: Video[] = []
  private isLoaded = false
  private loadingPromise: Promise<void> | null = null

  private constructor() {}

  public static getInstance(): LocalDataLoader {
    if (!LocalDataLoader.instance) {
      LocalDataLoader.instance = new LocalDataLoader()
    }
    return LocalDataLoader.instance
  }

  // 加载本地JSON数据
  public async loadLocalData(): Promise<void> {
    // 如果已经加载，直接返回
    if (this.isLoaded) return

    // 如果正在加载，等待加载完成
    if (this.loadingPromise) {
      return this.loadingPromise
    }

    // 开始加载
    this.loadingPromise = this._loadData()
    return this.loadingPromise
  }

  private async _loadData(): Promise<void> {
    try {
      console.log('开始加载本地视频数据...')
      
      const response = await fetch('/search_contents_2025-08-28.json')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (!Array.isArray(data)) {
        throw new Error('数据格式错误：期望数组格式')
      }
      
      this.videosData = data
      
      // 处理数据并去除重复项
      const processedVideos = this.videosData.map(rawData => this.transformToVideo(rawData))
      
      // 使用Map去除重复的视频ID
      const uniqueVideosMap = new Map()
      processedVideos.forEach(video => {
        if (!uniqueVideosMap.has(video.id)) {
          uniqueVideosMap.set(video.id, video)
        }
      })
      
      this.processedVideos = Array.from(uniqueVideosMap.values())
      this.isLoaded = true
      
      console.log('本地数据加载成功:', this.videosData.length, '个原始视频，去重后:', this.processedVideos.length, '个视频')
    } catch (error) {
      console.error('加载本地数据失败:', error)
      this.videosData = []
      this.processedVideos = []
      throw error
    } finally {
      this.loadingPromise = null
    }
  }

  // 检查本地视频文件是否存在
  private checkLocalVideoExists(awemeId: string): boolean {
    // 这里我们假设如果视频文件夹存在，就认为视频存在
    // 实际项目中可以通过文件系统API检查
    const localVideoIds = [
      '7110904526948830496', '7147181113058905355', '7172863717414128909',
      '7223788896549735739', '7245595812531588410', '7273451305056701736',
      '7347702400997739839', '7386627863635709223', '7408519274144222502',
      '7429293632450022667', '7511727052308991289', '7523460900733422907',
      '7524076956111867193', '7534636828704935225', '7535812161073253690',
      '7537188687290961212', '7537275057438510394', '7540675651113520444',
      '7540896751978581307', '7543224299281239356'
    ]
    return localVideoIds.includes(awemeId)
  }

  // 检查本地图片是否存在
  private checkLocalImageExists(awemeId: string): boolean {
    const localImageIds = ['7533712373128383803', '7542546834440228154']
    return localImageIds.includes(awemeId)
  }

  // 获取本地视频路径
  private getLocalVideoPath(awemeId: string): string {
    return `/videos/${awemeId}/video.mp4`
  }

  // 获取本地封面图片路径
  private getLocalCoverPath(awemeId: string): string {
    if (this.checkLocalImageExists(awemeId)) {
      return `/images/${awemeId}/000.jpeg`
    }
    // 如果没有本地图片，使用默认占位图
    return '/placeholder-cover.svg'
  }

  // 获取本地头像路径
  private getLocalAvatarPath(awemeId: string): string {
    // 使用默认头像或者从images文件夹获取
    return '/placeholder-avatar.svg'
  }

  // 转换原始数据为Video格式
  private transformToVideo(rawData: any): Video {
    const awemeId = rawData.aweme_id
    const hasLocalVideo = this.checkLocalVideoExists(awemeId)
    const hasLocalImage = this.checkLocalImageExists(awemeId)

    return {
      id: awemeId,
      title: rawData.title || rawData.desc,
      description: rawData.desc,
      poster: hasLocalImage ? this.getLocalCoverPath(awemeId) : rawData.cover_url,
      videoUrl: hasLocalVideo ? this.getLocalVideoPath(awemeId) : rawData.video_download_url,
      duration: 45, // 默认时长，可以通过视频元数据获取
      views: this.parseCount(rawData.liked_count) * 10, // 估算观看数
      likes: this.parseCount(rawData.liked_count),
      comments: this.parseCount(rawData.comment_count),
      shares: this.parseCount(rawData.share_count),
      category: '推荐',
      tags: this.extractHashtags(rawData.desc),
      author: {
        id: rawData.user_id,
        name: rawData.nickname,
        avatar: this.getLocalAvatarPath(awemeId), // 使用本地头像
        followers: 1000000, // 默认粉丝数
        verified: true,
        description: rawData.user_signature || '抖音创作者'
      },
      createdAt: new Date(rawData.create_time * 1000).toISOString().split('T')[0],
      isLiked: false,
      isFollowed: false,
      music: {
        name: '背景音乐',
        artist: rawData.nickname,
        url: rawData.music_download_url
      },
      location: rawData.ip_location || '未知',
      hashtags: this.extractHashtags(rawData.desc),
      isLocal: hasLocalVideo // 标记是否为本地视频
    }
  }

  // 解析数字字符串（如 "19716" 或 "2.1万"）
  private parseCount(countStr: string): number {
    if (!countStr) return 0
    
    // 移除逗号
    countStr = countStr.replace(/,/g, '')
    
    // 处理中文数字单位
    if (countStr.includes('万')) {
      return parseFloat(countStr.replace('万', '')) * 10000
    }
    if (countStr.includes('k') || countStr.includes('K')) {
      return parseFloat(countStr.replace(/[kK]/g, '')) * 1000
    }
    
    return parseInt(countStr) || 0
  }

  // 提取hashtags
  private extractHashtags(desc: string): string[] {
    if (!desc) return []
    const matches = desc.match(/#([^#\s]+)/g)
    return matches ? matches.map(tag => tag.substring(1)) : []
  }

  // 获取所有视频数据
  public async getVideos(): Promise<Video[]> {
    await this.loadLocalData()
    return [...this.processedVideos] // 返回副本，避免外部修改
  }

  // 根据ID获取单个视频
  public async getVideoById(id: string): Promise<Video | null> {
    await this.loadLocalData()
    return this.processedVideos.find(video => video.id === id) || null
  }

  // 获取本地视频列表（只返回有本地文件的视频）
  public async getLocalVideos(): Promise<Video[]> {
    await this.loadLocalData()
    return this.processedVideos.filter(video => video.isLocal)
  }

  // 清除缓存，强制重新加载
  public clearCache(): void {
    this.videosData = []
    this.processedVideos = []
    this.isLoaded = false
    this.loadingPromise = null
    console.log('本地数据缓存已清除')
  }

  // 获取加载状态
  public getLoadingStatus(): { isLoaded: boolean; isLoading: boolean; videoCount: number } {
    return {
      isLoaded: this.isLoaded,
      isLoading: this.loadingPromise !== null,
      videoCount: this.processedVideos.length
    }
  }
}

// 导出单例实例
export const localDataLoader = LocalDataLoader.getInstance()
