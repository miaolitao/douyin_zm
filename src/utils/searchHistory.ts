/**
 * 搜索历史管理工具
 * 提供搜索历史的持久化存储和管理功能
 */

export interface SearchHistoryItem {
  id: string
  query: string
  timestamp: number
  category?: string
  resultCount?: number
}

const SEARCH_HISTORY_KEY = 'douyin_search_history'
const MAX_HISTORY_ITEMS = 20

export class SearchHistoryManager {
  private static instance: SearchHistoryManager | null = null
  private history: SearchHistoryItem[] = []

  private constructor() {
    this.loadHistory()
  }

  /**
   * 获取单例实例
   */
  static getInstance(): SearchHistoryManager {
    if (!SearchHistoryManager.instance) {
      SearchHistoryManager.instance = new SearchHistoryManager()
    }
    return SearchHistoryManager.instance
  }

  /**
   * 添加搜索记录
   */
  addSearch(query: string, category?: string, resultCount?: number): void {
    if (!query.trim()) return

    const normalizedQuery = query.trim()
    
    // 检查是否已存在相同的搜索记录
    const existingIndex = this.history.findIndex(item => item.query === normalizedQuery)
    
    if (existingIndex !== -1) {
      // 如果存在，移除旧记录
      this.history.splice(existingIndex, 1)
    }

    // 添加新记录到开头
    const newItem: SearchHistoryItem = {
      id: this.generateId(),
      query: normalizedQuery,
      timestamp: Date.now(),
      category,
      resultCount
    }

    this.history.unshift(newItem)

    // 限制历史记录数量
    if (this.history.length > MAX_HISTORY_ITEMS) {
      this.history = this.history.slice(0, MAX_HISTORY_ITEMS)
    }

    this.saveHistory()
  }

  /**
   * 获取搜索历史
   */
  getHistory(limit?: number): SearchHistoryItem[] {
    if (limit) {
      return this.history.slice(0, limit)
    }
    return [...this.history]
  }

  /**
   * 获取搜索历史查询词列表
   */
  getHistoryQueries(limit?: number): string[] {
    const items = this.getHistory(limit)
    return items.map(item => item.query)
  }

  /**
   * 删除特定搜索记录
   */
  removeSearch(query: string): void {
    this.history = this.history.filter(item => item.query !== query)
    this.saveHistory()
  }

  /**
   * 删除特定ID的搜索记录
   */
  removeSearchById(id: string): void {
    this.history = this.history.filter(item => item.id !== id)
    this.saveHistory()
  }

  /**
   * 清空搜索历史
   */
  clearHistory(): void {
    this.history = []
    this.saveHistory()
  }

  /**
   * 获取热门搜索词（基于搜索频率）
   */
  getPopularSearches(limit: number = 10): string[] {
    // 统计搜索频率
    const frequencyMap = new Map<string, number>()
    
    this.history.forEach(item => {
      const query = item.query.toLowerCase()
      frequencyMap.set(query, (frequencyMap.get(query) || 0) + 1)
    })

    // 按频率排序
    const sortedQueries = Array.from(frequencyMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([query]) => query)

    return sortedQueries
  }

  /**
   * 搜索历史中的查询
   */
  searchInHistory(query: string): SearchHistoryItem[] {
    const queryLower = query.toLowerCase()
    return this.history.filter(item => 
      item.query.toLowerCase().includes(queryLower)
    )
  }

  /**
   * 获取最近搜索的分类
   */
  getRecentCategories(limit: number = 5): string[] {
    const categories = this.history
      .filter(item => item.category)
      .map(item => item.category!)
      .filter((category, index, arr) => arr.indexOf(category) === index) // 去重
      .slice(0, limit)

    return categories
  }

  /**
   * 获取搜索统计信息
   */
  getSearchStats(): {
    totalSearches: number
    uniqueQueries: number
    averageResultCount: number
    mostSearchedQuery: string | null
  } {
    const uniqueQueries = new Set(this.history.map(item => item.query.toLowerCase())).size
    const totalResultCounts = this.history
      .filter(item => item.resultCount !== undefined)
      .map(item => item.resultCount!)
    
    const averageResultCount = totalResultCounts.length > 0
      ? totalResultCounts.reduce((sum, count) => sum + count, 0) / totalResultCounts.length
      : 0

    const queryFrequency = new Map<string, number>()
    this.history.forEach(item => {
      const query = item.query.toLowerCase()
      queryFrequency.set(query, (queryFrequency.get(query) || 0) + 1)
    })

    const mostSearchedQuery = queryFrequency.size > 0
      ? Array.from(queryFrequency.entries()).sort((a, b) => b[1] - a[1])[0][0]
      : null

    return {
      totalSearches: this.history.length,
      uniqueQueries,
      averageResultCount: Math.round(averageResultCount),
      mostSearchedQuery
    }
  }

  /**
   * 从localStorage加载历史记录
   */
  private loadHistory(): void {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          this.history = parsed
          // 清理过期记录 (30天前的记录)
          const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
          this.history = this.history.filter(item => item.timestamp > thirtyDaysAgo)
        }
      }
    } catch (error) {
      console.warn('Failed to load search history from localStorage:', error)
      this.history = []
    }
  }

  /**
   * 保存历史记录到localStorage
   */
  private saveHistory(): void {
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(this.history))
    } catch (error) {
      console.warn('Failed to save search history to localStorage:', error)
    }
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// 导出单例实例
export const searchHistoryManager = SearchHistoryManager.getInstance()



