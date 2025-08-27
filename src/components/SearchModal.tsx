import React, { useState, useEffect, useRef } from 'react'
import { Modal, Input, List, Avatar, Tag, Button, Divider } from 'antd'
import { SearchOutlined, FireOutlined, HistoryOutlined, CloseOutlined } from '@ant-design/icons'
import { searchHistory, hotSearches, sampleVideos } from '../data/videos'

interface SearchModalProps {
  visible: boolean
  onClose: () => void
}

const SearchModal: React.FC<SearchModalProps> = ({ visible, onClose }) => {
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<any>(null)

  useEffect(() => {
    if (visible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [visible])

  const handleSearch = (value: string) => {
    setSearchValue(value)
    if (value.trim()) {
      setIsSearching(true)
      // 模拟搜索延迟
      setTimeout(() => {
        const results = sampleVideos.filter(video => 
          video.title.toLowerCase().includes(value.toLowerCase()) ||
          video.author.name.toLowerCase().includes(value.toLowerCase()) ||
          video.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase()))
        )
        setSearchResults(results)
        setIsSearching(false)
      }, 500)
    } else {
      setSearchResults([])
    }
  }

  const handleHistoryClick = (item: string) => {
    setSearchValue(item)
    handleSearch(item)
  }

  const clearHistory = () => {
    // 这里可以添加清除搜索历史的逻辑
  }

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      style={{ top: 20 }}
      bodyStyle={{ padding: 0 }}
      maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      <div style={{ backgroundColor: '#000000', minHeight: '400px' }}>
        {/* 搜索框 */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Input
            ref={inputRef}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="搜索视频、用户、音乐"
            prefix={<SearchOutlined style={{ color: '#888' }} />}
            suffix={
              searchValue && (
                <CloseOutlined 
                  style={{ color: '#888', cursor: 'pointer' }} 
                  onClick={() => {
                    setSearchValue('')
                    setSearchResults([])
                  }}
                />
              )
            }
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '20px',
              color: '#fff',
              height: '40px'
            }}
          />
        </div>

        {/* 搜索内容 */}
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {!searchValue ? (
            // 默认显示搜索历史和热门搜索
            <div>
              {/* 搜索历史 */}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HistoryOutlined style={{ color: '#888' }} />
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
                        padding: '4px 12px',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleHistoryClick(item)}
                    >
                      {item}
                    </Tag>
                  ))}
                </div>
              </div>

              <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: 0 }} />

              {/* 热门搜索 */}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <FireOutlined style={{ color: '#ff0050' }} />
                  <span style={{ color: '#fff', fontSize: '16px', fontWeight: 500 }}>热门搜索</span>
                </div>
                <List
                  dataSource={hotSearches}
                  renderItem={(item, index) => (
                    <List.Item
                      style={{ 
                        padding: '12px 0', 
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleHistoryClick(item)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                        <span style={{ 
                          color: index < 3 ? '#ff0050' : '#888', 
                          fontSize: '16px', 
                          fontWeight: index < 3 ? 600 : 400,
                          minWidth: '20px'
                        }}>
                          {index + 1}
                        </span>
                        <span style={{ color: '#fff', flex: 1 }}>{item}</span>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </div>
          ) : (
            // 显示搜索结果
            <div style={{ padding: '20px' }}>
              {isSearching ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    border: '3px solid rgba(255, 0, 80, 0.3)',
                    borderTop: '3px solid #ff0050',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 16px'
                  }} />
                  <span style={{ color: '#888' }}>搜索中...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <List
                  dataSource={searchResults}
                  renderItem={(video) => (
                    <List.Item
                      style={{ 
                        padding: '16px 0', 
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                        <img
                          src={video.poster}
                          alt={video.title}
                          style={{
                            width: '80px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ color: '#fff', fontSize: '14px', marginBottom: '4px', lineHeight: '1.4' }}>
                            {video.title}
                          </div>
                          <div style={{ color: '#888', fontSize: '12px' }}>
                            {video.author.name} · {video.views}次观看
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <span style={{ color: '#888' }}>未找到相关内容</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default SearchModal
