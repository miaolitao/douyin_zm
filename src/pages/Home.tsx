import React, { useState } from 'react'
import { Layout, Avatar, Typography, Button } from 'antd'
import VideoPlayer from '../components/VideoPlayer'
import { HeartOutlined, MessageOutlined, ShareAltOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface VideoData {
  id: string
  url: string
  poster: string
  title: string
  author: {
    name: string
    avatar: string
  }
  description: string
}

const sampleVideos: VideoData[] = [
  {
    id: '1',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: 'https://picsum.photos/600/800',
    title: '有趣的短视频',
    author: {
      name: '创作者小明',
      avatar: 'https://picsum.photos/100/100'
    },
    description: '这是一个有趣的短视频示例，展示了视频播放组件的功能。'
  },
  {
    id: '2',
    url: 'https://www.w3schools.com/html/movie.mp4',
    poster: 'https://picsum.photos/600/801',
    title: '精彩瞬间',
    author: {
      name: '创作者小红',
      avatar: 'https://picsum.photos/100/101'
    },
    description: '记录生活中的精彩瞬间，分享快乐时光。'
  },
  {
    id: '3',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: 'https://picsum.photos/600/802',
    title: '趣味分享',
    author: {
      name: '创作者小华',
      avatar: 'https://picsum.photos/100/102'
    },
    description: '分享有趣的生活片段，带给大家欢乐。'
  }
]

const Home: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isLoading) return

    if (e.deltaY > 0 && currentVideoIndex < sampleVideos.length - 1) {
      setIsLoading(true)
      setCurrentVideoIndex(prev => prev + 1)
      setTimeout(() => setIsLoading(false), 500)
    } else if (e.deltaY < 0 && currentVideoIndex > 0) {
      setIsLoading(true)
      setCurrentVideoIndex(prev => prev - 1)
      setTimeout(() => setIsLoading(false), 500)
    }
  }

  const currentVideo = sampleVideos[currentVideoIndex]

  return (
    <Layout style={{ height: '100%', backgroundColor: '#121212' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: '24px',
          padding: '24px',
          height: '100%',
          overflow: 'hidden'
        }}
        onWheel={handleScroll}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '800px',
            aspectRatio: '16/9',
            backgroundColor: '#000',
            borderRadius: '4px',
            overflow: 'hidden',
            transition: 'transform 0.3s ease-out',
            transform: isLoading ? 'scale(0.98)' : 'scale(1)',
            position: 'relative',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <VideoPlayer
            videoUrl={currentVideo.url}
            poster={currentVideo.poster}
          />
        </div>
        <div
          style={{
            width: '360px',
            backgroundColor: '#1d1d1d',
            borderRadius: '4px',
            padding: '16px',
            height: 'fit-content'
          }}
        >
          <Title level={4} style={{ color: '#fff', marginBottom: '16px', fontSize: '16px' }}>
            {currentVideo.title}
          </Title>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
            <Avatar src={currentVideo.author.avatar} size={36} style={{ border: '2px solid #fe2c55' }} />
            <div style={{ flex: 1 }}>
              <Text style={{ color: '#fff', fontSize: '15px', fontWeight: 500, display: 'block' }}>{currentVideo.author.name}</Text>
              <Text style={{ color: '#999', fontSize: '13px' }}>1.2k粉丝</Text>
            </div>
            <Button type="primary" size="small" style={{ backgroundColor: '#fe2c55', borderColor: '#fe2c55', borderRadius: '2px' }}>关注</Button>
          </div>
          <Text style={{ color: '#999', fontSize: '14px', lineHeight: '1.6', display: 'block', marginBottom: '16px' }}>{currentVideo.description}</Text>
          <div style={{ display: 'flex', gap: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 500 }}>1.2w</Text>
              <Text style={{ color: '#999', fontSize: '12px', display: 'block' }}>获赞</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 500 }}>1.8k</Text>
              <Text style={{ color: '#999', fontSize: '12px', display: 'block' }}>粉丝</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 500 }}>128</Text>
              <Text style={{ color: '#999', fontSize: '12px', display: 'block' }}>关注</Text>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home