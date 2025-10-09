import { Video } from '../types/video'

export interface SearchOptions {
  category?: string
  sortBy?: 'relevance' | 'views' | 'likes' | 'time'
  timeRange?: 'all' | 'today' | 'week' | 'month'
  minViews?: number
  maxResults?: number
}

export interface SearchResult {
  video: Video
  relevanceScore: number
  matchedFields: string[]
}

export interface SearchSuggestion {
  text: string
  type: 'keyword' | 'user' | 'category' | 'hashtag'
  count: number
}

/**
 * 智能搜索引擎类
 * 提供高级搜索、排序、建议等功能
 */
export class SearchEngine {
  private videos: Video[]

  constructor(videos: Video[]) {
    this.videos = videos
  }

  /**
   * 更新视频数据
   */
  updateVideos(videos: Video[]) {
    this.videos = videos
  }

  /**
   * 智能搜索视频
   */
  search(query: string, options: SearchOptions = {}): SearchResult[] {
    if (!query.trim()) {
      return []
    }

    const searchTerms = this.preprocessQuery(query)
    let results: SearchResult[] = []

    // 对每个视频计算相关度得分
    for (const video of this.videos) {
      // 应用分类筛选
      if (options.category && options.category !== '全部' && video.category !== options.category) {
        continue
      }

      const relevanceScore = this.calculateRelevance(video, searchTerms)
      if (relevanceScore > 0) {
        const matchedFields = this.getMatchedFields(video, searchTerms)
        results.push({
          video,
          relevanceScore,
          matchedFields
        })
      }
    }

    // 排序结果
    results = this.sortResults(results, options.sortBy || 'relevance')

    // 限制结果数量
    if (options.maxResults) {
      results = results.slice(0, options.maxResults)
    }

    return results
  }

  /**
   * 获取搜索建议
   */
  getSuggestions(query: string, maxSuggestions: number = 8): SearchSuggestion[] {
    if (!query.trim()) {
      return []
    }

    const suggestions: SearchSuggestion[] = []
    const queryLower = query.toLowerCase()
    const suggestionMap = new Map<string, SearchSuggestion>()

    // 从视频标题中提取建议
    this.videos.forEach(video => {
      // 标题关键词建议
      const titleWords = video.title.split(/\s+/)
      titleWords.forEach(word => {
        if (word.toLowerCase().includes(queryLower) && word.length > 1) {
          const key = word.toLowerCase()
          const existing = suggestionMap.get(key)
          if (existing) {
            existing.count++
          } else {
            suggestionMap.set(key, {
              text: word,
              type: 'keyword',
              count: 1
            })
          }
        }
      })

      // 作者名建议
      if (video.author.name.toLowerCase().includes(queryLower)) {
        const key = `user:${video.author.name.toLowerCase()}`
        const existing = suggestionMap.get(key)
        if (existing) {
          existing.count++
        } else {
          suggestionMap.set(key, {
            text: video.author.name,
            type: 'user',
            count: 1
          })
        }
      }

      // 分类建议
      if (video.category.toLowerCase().includes(queryLower)) {
        const key = `category:${video.category.toLowerCase()}`
        const existing = suggestionMap.get(key)
        if (existing) {
          existing.count++
        } else {
          suggestionMap.set(key, {
            text: video.category,
            type: 'category',
            count: 1
          })
        }
      }

      // 标签建议
      video.hashtags?.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          const key = `hashtag:${tag.toLowerCase()}`
          const existing = suggestionMap.get(key)
          if (existing) {
            existing.count++
          } else {
            suggestionMap.set(key, {
              text: tag,
              type: 'hashtag',
              count: 1
            })
          }
        }
      })
    })

    // 转换为数组并排序
    const allSuggestions = Array.from(suggestionMap.values())
    allSuggestions.sort((a, b) => {
      // 按类型优先级排序，然后按数量排序
      const typeOrder = { user: 0, category: 1, hashtag: 2, keyword: 3 }
      const typeCompare = typeOrder[a.type] - typeOrder[b.type]
      if (typeCompare !== 0) return typeCompare
      return b.count - a.count
    })

    return allSuggestions.slice(0, maxSuggestions)
  }

  /**
   * 获取热门搜索词
   */
  getHotSearches(): string[] {
    // 基于视频数据生成热门搜索
    const keywordCount = new Map<string, number>()
    
    this.videos.forEach(video => {
      // 统计标签频率
      video.hashtags?.forEach(tag => {
        keywordCount.set(tag, (keywordCount.get(tag) || 0) + video.views)
      })
      
      // 统计分类频率
      keywordCount.set(video.category, (keywordCount.get(video.category) || 0) + video.views)
      
      // 统计作者频率（如果是大V）
      if (video.author.verified) {
        keywordCount.set(video.author.name, (keywordCount.get(video.author.name) || 0) + video.views)
      }
    })

    // 排序并返回前10个
    const sortedKeywords = Array.from(keywordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([keyword]) => keyword)

    return sortedKeywords
  }

  /**
   * 预处理搜索查询
   */
  private preprocessQuery(query: string): string[] {
    return query
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fff]/g, ' ') // 保留中文字符
      .split(/\s+/)
      .filter(term => term.length > 0)
  }

  /**
   * 计算视频与搜索词的相关度
   */
  private calculateRelevance(video: Video, searchTerms: string[]): number {
    let score = 0
    const titleLower = video.title.toLowerCase()
    const descriptionLower = video.description.toLowerCase()
    const authorNameLower = video.author.name.toLowerCase()
    const categoryLower = video.category.toLowerCase()

    for (const term of searchTerms) {
      // 标题匹配 (权重最高)
      if (titleLower.includes(term)) {
        score += 10
        if (titleLower.startsWith(term)) score += 5 // 开头匹配额外加分
      }

      // 作者名匹配
      if (authorNameLower.includes(term)) {
        score += 8
      }

      // 分类匹配
      if (categoryLower.includes(term)) {
        score += 6
      }

      // 描述匹配
      if (descriptionLower.includes(term)) {
        score += 3
      }

      // 标签匹配
      video.tags?.forEach(tag => {
        if (tag.toLowerCase().includes(term)) {
          score += 5
        }
      })

      // 话题标签匹配
      video.hashtags?.forEach(hashtag => {
        if (hashtag.toLowerCase().includes(term)) {
          score += 4
        }
      })

      // 音乐匹配
      if (video.music) {
        if (video.music.name.toLowerCase().includes(term)) {
          score += 3
        }
        if (video.music.artist.toLowerCase().includes(term)) {
          score += 3
        }
      }
    }

    // 根据视频质量调整得分
    const qualityBonus = Math.log(video.views + 1) * 0.1 + Math.log(video.likes + 1) * 0.05
    score += qualityBonus

    return score
  }

  /**
   * 获取匹配的字段
   */
  private getMatchedFields(video: Video, searchTerms: string[]): string[] {
    const matchedFields: string[] = []
    const titleLower = video.title.toLowerCase()
    const authorNameLower = video.author.name.toLowerCase()
    const categoryLower = video.category.toLowerCase()

    for (const term of searchTerms) {
      if (titleLower.includes(term)) {
        matchedFields.push('title')
      }
      if (authorNameLower.includes(term)) {
        matchedFields.push('author')
      }
      if (categoryLower.includes(term)) {
        matchedFields.push('category')
      }
      // 可以添加更多字段
    }

    return [...new Set(matchedFields)] // 去重
  }

  /**
   * 排序搜索结果
   */
  private sortResults(results: SearchResult[], sortBy: string): SearchResult[] {
    return results.sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return b.video.views - a.video.views
        case 'likes':
          return b.video.likes - a.video.likes
        case 'time':
          return new Date(b.video.createdAt).getTime() - new Date(a.video.createdAt).getTime()
        case 'relevance':
        default:
          return b.relevanceScore - a.relevanceScore
      }
    })
  }
}

// 创建全局搜索引擎实例
let globalSearchEngine: SearchEngine | null = null

export const getSearchEngine = (videos?: Video[]): SearchEngine => {
  if (!globalSearchEngine && videos) {
    globalSearchEngine = new SearchEngine(videos)
  } else if (globalSearchEngine && videos) {
    globalSearchEngine.updateVideos(videos)
  }
  return globalSearchEngine!
}











