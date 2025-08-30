import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Modal, Input, List, Avatar, Tag, Button, Divider, Select, Typography, Empty, Tooltip } from 'antd'
import { 
  SearchOutlined, 
  FireOutlined, 
  HistoryOutlined, 
  CloseOutlined,
  UserOutlined,
  TagOutlined,
  FolderOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  HeartOutlined,
  FilterOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useVideoData } from '../hooks/useVideoData'
import { Video } from '../types/video'
import { getSearchEngine, SearchResult, SearchSuggestion } from '../utils/searchEngine'
import { searchHistoryManager } from '../utils/searchHistory'

const { Text } = Typography
const { Option } = Select

interface SearchModalProps {
  visible: boolean
  onClose: () => void
}

const SearchModal: React.FC<SearchModalProps> = ({ visible, onClose }) => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')
  const [sortBy, setSortBy] = useState<'relevance' | 'views' | 'likes' | 'time'>('relevance')
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [hotSearches, setHotSearches] = useState<string[]>([])
  const inputRef = useRef<any>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const suggestionsTimeoutRef = useRef<NodeJS.Timeout>()

  // 使用统一的视频数据Hook
  const { videos } = useVideoData()

  // 初始化搜索引擎
  const searchEngine = useMemo(() => {
    return getSearchEngine(videos)
  }, [videos])

  // 分类选项
  const categoryOptions = ['全部', '游戏', '音乐', '美食', '二次元', '知识', '体育']

  useEffect(() => {
    if (visible) {
      // 加载搜索历史和热门搜索
      setSearchHistory(searchHistoryManager.getHistoryQueries(8))
      setHotSearches(searchEngine.getHotSearches())
      
      // 焦点到搜索框
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
      // 清理状态
      setSearchValue('')
      setSearchResults([])
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [visible, searchEngine])

  // 处理搜索
  const handleSearch = (value: string, immediate: boolean = false) => {
    setSearchValue(value)
    
    // 清除之前的定时器
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (!value.trim()) {
      setSearchResults([])
      setShowSuggestions(false)
      return
    }

    const delay = immediate ? 0 : 300 // 防抖延迟

    searchTimeoutRef.current = setTimeout(() => {
      setIsSearching(true)
      
      // 执行智能搜索
      const results = searchEngine.search(value, {
        category: selectedCategory === '全部' ? undefined : selectedCategory,
        sortBy,
        maxResults: 50
      })
      
      setSearchResults(results)
      setIsSearching(false)
      
      // 添加到搜索历史
      searchHistoryManager.addSearch(value, selectedCategory, results.length)
      setSearchHistory(searchHistoryManager.getHistoryQueries(8))
    }, delay)
  }

  // 处理搜索建议
  const handleSuggestions = (value: string) => {
    // 清除之前的建议定时器
    if (suggestionsTimeoutRef.current) {
      clearTimeout(suggestionsTimeoutRef.current)
    }

    if (!value.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setShowSuggestions(true)

    suggestionsTimeoutRef.current = setTimeout(() => {
      const newSuggestions = searchEngine.getSuggestions(value, 6)
      setSuggestions(newSuggestions)
    }, 100)
  }

  // 输入框变化处理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    handleSearch(value)
    handleSuggestions(value)
  }

  // 点击历史记录
  const handleHistoryClick = (item: string) => {
    setSearchValue(item)
    handleSearch(item, true)
    setShowSuggestions(false)
  }

  // 点击建议
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchValue(suggestion.text)
    handleSearch(suggestion.text, true)
    setShowSuggestions(false)
  }

  // 清除历史记录
  const clearHistory = () => {
    searchHistoryManager.clearHistory()
    setSearchHistory([])
  }

  // 跳转到视频详情
  const handleVideoClick = (videoId: string) => {
    navigate(`/video/${videoId}`)
    onClose()
  }

  // 格式化数字
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  // 获取建议图标
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'user': return <UserOutlined />
      case 'category': return <FolderOutlined />
      case 'hashtag': return <TagOutlined />
      default: return <SearchOutlined />
    }
  }

  // 高亮搜索词
  const highlightText = (text: string, query: string) => {
    if (!query) return text
    
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark style="background: #ff0050; color: white; padding: 0 2px; border-radius: 2px;">$1</mark>')
  }

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 20 }}
      bodyStyle={{ padding: 0 }}
      maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      <div style={{ backgroundColor: '#000000', minHeight: '500px' }}>
        {/* 搜索框和筛选器 */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          {/* 主搜索框 */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Input
              ref={inputRef}
              value={searchValue}
              onChange={handleInputChange}
              placeholder="搜索视频、用户、音乐、话题..."
              prefix={<SearchOutlined style={{ color: '#888' }} />}
              suffix={
                searchValue && (
                  <CloseOutlined 
                    style={{ color: '#888', cursor: 'pointer' }} 
                    onClick={() => {
                      setSearchValue('')
                      setSearchResults([])
                      setSuggestions([])
                      setShowSuggestions(false)
                    }}
                  />
                )
              }
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '20px',
                color: '#fff',
                height: '44px',
                fontSize: '16px'
              }}
            />
            
            {/* 搜索建议下拉 */}
            {showSuggestions && suggestions.length > 0 && searchValue && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: '#1a1a1a',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                zIndex: 1000,
                marginTop: '4px',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '8px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderBottom: index < suggestions.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                      transition: 'background-color 0.2s'
                    }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    {getSuggestionIcon(suggestion.type)}
                    <span style={{ color: '#fff', flex: 1 }}>{suggestion.text}</span>
                    <span style={{ color: '#888', fontSize: '12px' }}>{suggestion.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 筛选器 */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FilterOutlined style={{ color: '#888', fontSize: '14px' }} />
              <Text style={{ color: '#888', fontSize: '14px' }}>筛选:</Text>
            </div>
            
            <Select
              value={selectedCategory}
              onChange={(value) => {
                setSelectedCategory(value)
                if (searchValue) {
                  handleSearch(searchValue, true)
                }
              }}
              style={{ width: 100 }}
              size="small"
            >
              {categoryOptions.map(option => (
                <Option key={option} value={option}>{option}</Option>
              ))}
            </Select>
            
            <Select
              value={sortBy}
              onChange={(value) => {
                setSortBy(value)
                if (searchValue) {
                  handleSearch(searchValue, true)
                }
              }}
              style={{ width: 120 }}
              size="small"
            >
              <Option value="relevance">相关度</Option>
              <Option value="views">观看量</Option>
              <Option value="likes">点赞数</Option>
              <Option value="time">发布时间</Option>
            </Select>
          </div>
        </div>

        {/* 搜索内容 */}
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {!searchValue ? (
            // 默认显示搜索历史和热门搜索
            <div>
              {/* 搜索历史 */}
              {searchHistory.length > 0 && (
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ClockCircleOutlined style={{ color: '#888' }} />
                      <span style={{ color: '#fff', fontSize: '16px', fontWeight: 500 }}>搜索历史</span>
                    </div>
                    <Button 
                      type="text" 
                      size="small"
                      onClick={clearHistory}
                      style={{ color: '#888' }}
                    >
                      清除
                    </Button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {searchHistory.map((item, index) => (
                      <Tag
                        key={index}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#fff',
                          borderRadius: '16px',
                          padding: '6px 12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => handleHistoryClick(item)}
                      >
                        {item}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {searchHistory.length > 0 && <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: 0 }} />}

              {/* 热门搜索 */}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <FireOutlined style={{ color: '#ff0050' }} />
                  <span style={{ color: '#fff', fontSize: '16px', fontWeight: 500 }}>热门搜索</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                  {hotSearches.map((item, index) => (
                    <div
                      key={index}
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onClick={() => handleHistoryClick(item)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <span style={{ 
                        color: index < 3 ? '#ff0050' : '#888', 
                        fontSize: '14px', 
                        fontWeight: index < 3 ? 600 : 400,
                        minWidth: '16px'
                      }}>
                        {index + 1}
                      </span>
                      <span style={{ color: '#fff', flex: 1, fontSize: '14px' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // 显示搜索结果
            <div style={{ padding: '20px' }}>
              {/* 搜索结果头部信息 */}
              {!isSearching && searchResults.length > 0 && (
                <div style={{ 
                  marginBottom: '20px', 
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <Text style={{ color: '#888', fontSize: '14px' }}>
                    找到 <span style={{ color: '#ff0050', fontWeight: 'bold' }}>{searchResults.length}</span> 个相关结果
                    {selectedCategory !== '全部' && (
                      <span> · 分类: <span style={{ color: '#ff0050' }}>{selectedCategory}</span></span>
                    )}
                  </Text>
                </div>
              )}

              {isSearching ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    border: '3px solid rgba(255, 0, 80, 0.3)',
                    borderTop: '3px solid #ff0050',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 20px'
                  }} />
                  <Text style={{ color: '#888', fontSize: '16px' }}>正在搜索...</Text>
                </div>
              ) : searchResults.length > 0 ? (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {searchResults.map(({ video, relevanceScore, matchedFields }, index) => (
                    <div
                      key={video.id}
                      style={{ 
                        display: 'flex',
                        gap: '16px',
                        padding: '16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: '1px solid transparent'
                      }}
                      onClick={() => handleVideoClick(video.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                        e.currentTarget.style.borderColor = 'rgba(255, 0, 80, 0.3)'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'
                        e.currentTarget.style.borderColor = 'transparent'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      {/* 视频封面 */}
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <img
                          src={video.poster}
                          alt={video.title}
                          style={{
                            width: '120px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          opacity: 0.8
                        }}>
                          <PlayCircleOutlined style={{ fontSize: '24px', color: '#fff' }} />
                        </div>
                        {/* 视频时长 */}
                        <div style={{
                          position: 'absolute',
                          bottom: '4px',
                          right: '4px',
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          color: '#fff',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                        </div>
                      </div>

                      {/* 视频信息 */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* 标题 */}
                        <div 
                          style={{ 
                            color: '#fff', 
                            fontSize: '16px', 
                            fontWeight: 500,
                            marginBottom: '8px',
                            lineHeight: '1.4',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden'
                          }}
                          dangerouslySetInnerHTML={{
                            __html: highlightText(video.title, searchValue)
                          }}
                        />
                        
                        {/* 作者信息 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <Avatar src={video.author.avatar} size={24} />
                          <span 
                            style={{ color: '#888', fontSize: '14px' }}
                            dangerouslySetInnerHTML={{
                              __html: highlightText(video.author.name, searchValue)
                            }}
                          />
                          {video.author.verified && (
                            <span style={{ color: '#ff0050', fontSize: '12px' }}>✓</span>
                          )}
                        </div>

                        {/* 统计信息 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <EyeOutlined style={{ color: '#888', fontSize: '14px' }} />
                            <span style={{ color: '#888', fontSize: '13px' }}>
                              {formatNumber(video.views)}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <HeartOutlined style={{ color: '#888', fontSize: '14px' }} />
                            <span style={{ color: '#888', fontSize: '13px' }}>
                              {formatNumber(video.likes)}
                            </span>
                          </div>
                          <span style={{ color: '#888', fontSize: '13px' }}>
                            {video.createdAt}
                          </span>
                        </div>

                        {/* 分类和匹配字段 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <Tag 
                            size="small" 
                            style={{ 
                              backgroundColor: 'rgba(255, 0, 80, 0.2)', 
                              color: '#ff0050', 
                              border: 'none',
                              fontSize: '11px'
                            }}
                          >
                            {video.category}
                          </Tag>
                          {matchedFields.map(field => (
                            <Tag 
                              key={field}
                              size="small"
                              style={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                                color: '#888', 
                                border: 'none',
                                fontSize: '10px'
                              }}
                            >
                              {field === 'title' ? '标题' : field === 'author' ? '作者' : field === 'category' ? '分类' : field}
                            </Tag>
                          ))}
                        </div>
                      </div>

                      {/* 相关度得分（开发模式显示） */}
                      {process.env.NODE_ENV === 'development' && (
                        <div style={{
                          alignSelf: 'flex-start',
                          backgroundColor: 'rgba(0, 255, 0, 0.2)',
                          color: '#0f0',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px'
                        }}>
                          {relevanceScore.toFixed(1)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ padding: '60px 20px' }}
                  description={
                    <div style={{ textAlign: 'center' }}>
                      <Text style={{ color: '#888', fontSize: '16px', display: 'block', marginBottom: '8px' }}>
                        未找到相关内容
                      </Text>
                      <Text style={{ color: '#666', fontSize: '14px' }}>
                        尝试调整搜索词或筛选条件
                      </Text>
                    </div>
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default SearchModal
