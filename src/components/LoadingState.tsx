import React from 'react'
import { Spin, Alert, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

interface LoadingStateProps {
  loading: boolean
  error: string | null
  onRetry?: () => void
  children: React.ReactNode
  emptyMessage?: string
  showEmpty?: boolean
}

/**
 * 通用的加载状态组件
 * 处理加载中、错误、空状态的显示
 */
const LoadingState: React.FC<LoadingStateProps> = ({
  loading,
  error,
  onRetry,
  children,
  emptyMessage = '暂无数据',
  showEmpty = false
}) => {
  // 加载中状态
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
        flexDirection: 'column',
        color: '#ffffff'
      }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', fontSize: '14px', color: '#888' }}>
          加载中...
        </div>
      </div>
    )
  }

  // 错误状态
  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
        padding: '20px'
      }}>
        <Alert
          message="加载失败"
          description={error}
          type="error"
          showIcon
          style={{
            backgroundColor: 'rgba(255, 77, 79, 0.1)',
            border: '1px solid rgba(255, 77, 79, 0.3)',
            color: '#ffffff'
          }}
          action={
            onRetry && (
              <Button
                size="small"
                icon={<ReloadOutlined />}
                onClick={onRetry}
                style={{
                  backgroundColor: '#ff0050',
                  borderColor: '#ff0050',
                  color: '#ffffff'
                }}
              >
                重试
              </Button>
            )
          }
        />
      </div>
    )
  }

  // 空状态
  if (showEmpty) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
        color: '#888',
        fontSize: '14px'
      }}>
        {emptyMessage}
      </div>
    )
  }

  // 正常内容
  return <>{children}</>
}

export default LoadingState
