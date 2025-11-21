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
      maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)' }}
      closeIcon={<CloseOutlined style={{ color: '#fff', fontSize: '20px' }} />}
    >
      <style>
        {`
          @keyframes fadeInSlide {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .search-result-item {
            animation: fadeInSlide 0.4s ease-out forwards;
            opacity: 0;
          }
          
          .search-result-item:hover .play-icon {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
          }
          
          .search-tag:hover {
            background-color: rgba(255, 255, 255, 0.2) !important;
          }
        `}
      </style>
      <div style={{ backgroundColor: '#161823', minHeight: '600px', borderRadius: '8px', overflow: 'hidden' }}>
        {/* 搜索框和筛选器 */}
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {/* 主搜索框 */}
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Input
              ref={inputRef}
              value={searchValue}
              onChange={handleInputChange}
              placeholder="搜索视频、用户、音乐、话题..."
              prefix={<SearchOutlined style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '18px' }} />}
              suffix={
                searchValue && (
                  <CloseOutlined 
                    style={{ color: 'rgba(255, 255, 255, 0.5)', cursor: 'pointer' }} 
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
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid transparent',
                borderRadius: '12px',
                color: '#fff',
                height: '48px',
                fontSize: '16px',
                paddingLeft: '16px',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#fe2c55'}
              onBlur={(e) => e.target.style.borderColor = 'transparent'}
            />
            
            {/* 搜索建议下拉 */}
            {showSuggestions && suggestions.length > 0 && searchValue && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: '#1f212e',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                zIndex: 1000,
                marginTop: '8px',
                maxHeight: '300px',
                overflowY: 'auto',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '12px 20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'background-color 0.2s'
                    }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <div style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      {getSuggestionIcon(suggestion.type)}
                    </div>
                    <span style={{ color: '#fff', flex: 1, fontSize: '14px' }}>{suggestion.text}</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '12px' }}>{suggestion.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 筛选器 */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FilterOutlined style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }} />
              <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>筛选:</Text>
            </div>
            
            <Select
              value={selectedCategory}
              onChange={(value) => {
                setSelectedCategory(value)
                if (searchValue) {
                  handleSearch(searchValue, true)
                }
              }}
              style={{ width: 110 }}
              bordered={false}
              dropdownStyle={{ backgroundColor: '#1f212e', border: '1px solid rgba(255, 255, 255, 0.08)' }}
            >
              {categoryOptions.map(option => (
                <Option key={option} value={option} style={{ color: '#fff' }}>{option}</Option>
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
              style={{ width: 110 }}
              bordered={false}
              dropdownStyle={{ backgroundColor: '#1f212e', border: '1px solid rgba(255, 255, 255, 0.08)' }}
            >
              <Option value="relevance" style={{ color: '#fff' }}>相关度</Option>
              <Option value="views" style={{ color: '#fff' }}>观看量</Option>
              <Option value="likes" style={{ color: '#fff' }}>点赞数</Option>
              <Option value="time" style={{ color: '#fff' }}>发布时间</Option>
            </Select>
          </div>
        </div>

        {/* 搜索内容 */}
        <div style={{ maxHeight: '600px', overflowY: 'auto', padding: '0 24px 24px' }}>
          {!searchValue ? (
            // 默认显示搜索历史和热门搜索
            <div style={{ paddingTop: '24px' }}>
              {/* 搜索历史 */}
              {searchHistory.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ClockCircleOutlined style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      <span style={{ color: '#fff', fontSize: '15px', fontWeight: 500 }}>搜索历史</span>
                    </div>
                    <Button 
                      type="text" 
                      size="small"
                      onClick={clearHistory}
                      style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px' }}
                    >
                      清除
                    </Button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {searchHistory.map((item, index) => (
                      <Tag
                        key={index}
                        className="search-tag"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: 'none',
                          color: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '4px',
                          padding: '4px 12px',
                          cursor: 'pointer',
                          fontSize: '13px',
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

              {/* 热门搜索 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <FireOutlined style={{ color: '#fe2c55' }} />
                  <span style={{ color: '#fff', fontSize: '15px', fontWeight: 500 }}>热门搜索</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {hotSearches.map((item, index) => (
                    <div
                      key={index}
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        backgroundColor: 'transparent',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onClick={() => handleHistoryClick(item)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <span style={{ 
                        color: index < 3 ? '#fe2c55' : 'rgba(255, 255, 255, 0.5)', 
                        fontSize: '14px', 
                        fontWeight: index < 3 ? 600 : 400,
                        minWidth: '20px',
                        textAlign: 'center'
                      }}>
                        {index + 1}
                      </span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.9)', flex: 1, fontSize: '14px' }}>{item}</span>
                      {index < 2 && (
                        <Tag color="#fe2c55" style={{ margin: 0, fontSize: '10px', lineHeight: '16px', height: '18px', border: 'none' }}>热</Tag>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // 显示搜索结果
            <div style={{ paddingTop: '20px' }}>
              {/* 搜索结果头部信息 */}
              {!isSearching && searchResults.length > 0 && (
                <div style={{ 
                  marginBottom: '20px', 
                  paddingBottom: '12px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px' }}>
                    找到 <span style={{ color: '#fe2c55', fontWeight: 'bold' }}>{searchResults.length}</span> 个相关结果
                    {selectedCategory !== '全部' && (
                      <span> · 分类: <span style={{ color: '#fe2c55' }}>{selectedCategory}</span></span>
                    )}
                  </Text>
                </div>
              )}

              {isSearching ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    border: '3px solid rgba(255, 255, 255, 0.1)',
                    borderTop: '3px solid #fe2c55',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 20px'
                  }} />
                  <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>正在搜索...</Text>
                </div>
              ) : searchResults.length > 0 ? (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {searchResults.map(({ video, relevanceScore, matchedFields }, index) => (
                    <div
                      key={video.id}
                      className="search-result-item"
                      style={{ 
                        display: 'flex',
                        gap: '16px',
                        padding: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: '1px solid transparent',
                        animationDelay: `${index * 0.05}s`
                      }}
                      onClick={() => handleVideoClick(video.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                        e.currentTarget.style.borderColor = 'rgba(254, 44, 85, 0.3)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'
                        e.currentTarget.style.borderColor = 'transparent'
                      }}
                    >
                      {/* 视频封面 */}
                      <div style={{ position: 'relative', flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}>
                        <img
                          src={video.poster}
                          alt={video.title}
                          style={{
                            width: '160px',
                            height: '100px',
                            objectFit: 'cover',
                            transition: 'transform 0.3s'
                          }}
                        />
                        <div 
                          className="play-icon"
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            opacity: 0,
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                          }}
                        >
                          <PlayCircleOutlined style={{ fontSize: '32px', color: '#fff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                        </div>
                        {/* 视频时长 */}
                        <div style={{
                          position: 'absolute',
                          bottom: '6px',
                          right: '6px',
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          color: '#fff',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 500
                        }}>
                          {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                        </div>
                      </div>

                      {/* 视频信息 */}
                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '4px 0' }}>
                        <div>
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
                          
                          {/* 匹配标签 */}
                          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                             {matchedFields.includes('category') && (
                               <Tag color="rgba(254, 44, 85, 0.2)" style={{ color: '#fe2c55', border: 'none', margin: 0, fontSize: '11px' }}>
                                 {video.category}
                               </Tag>
                             )}
                          </div>
                        </div>
                        
                        <div>
                          {/* 作者信息 */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <Avatar src={video.author.avatar} size={20} style={{ border: '1px solid rgba(255,255,255,0.2)' }} />
                            <span 
                              style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px' }}
                              dangerouslySetInnerHTML={{
                                __html: highlightText(video.author.name, searchValue)
                              }}
                            />
                          </div>

                          {/* 统计信息 */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <EyeOutlined style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px' }} />
                              <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>
                                {formatNumber(video.views)}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <HeartOutlined style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px' }} />
                              <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>
                                {formatNumber(video.likes)}
                              </span>
                            </div>
                            <span style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '12px' }}>
                              {video.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ padding: '80px 0' }}
                  description={
                    <div style={{ textAlign: 'center' }}>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '15px', display: 'block', marginBottom: '8px' }}>
                        未找到相关内容
                      </Text>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '13px' }}>
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
