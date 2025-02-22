import React from 'react'
import { Layout } from 'antd'

const Music: React.FC = () => {
  return (
    <Layout style={{ height: '100%', backgroundColor: '#121212' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '600px',
            aspectRatio: '9/16',
            backgroundColor: '#1d1d1d',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span style={{ color: '#666' }}>音乐视频播放区域</span>
        </div>
        <div
          style={{
            width: '100%',
            maxWidth: '600px',
            padding: '16px',
            backgroundColor: '#1d1d1d',
            borderRadius: '8px'
          }}
        >
          <h3 style={{ marginBottom: '16px' }}>音乐视频标题</h3>
          <div style={{ color: '#666' }}>音乐人信息</div>
          <div style={{ marginTop: '16px', color: '#666' }}>视频描述</div>
        </div>
      </div>
    </Layout>
  )
}

export default Music