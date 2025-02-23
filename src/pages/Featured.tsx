import React, { useState, useRef, useCallback } from 'react';
import { Layout, Tabs, Card, Avatar, Button, Row, Col } from 'antd';
import { HeartOutlined, MessageOutlined, ShareAltOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';

interface VideoData {
  id: string;
  url: string;
  poster: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  description: string;
  category: string;
  likes: number;
  comments: number;
  shares: number;
}

const categories = ['全部', '游戏', '二次元', '音乐', '美食', '知识', '体育'];

const sampleVideos: VideoData[] = Array(20).fill(null).map((_, index) => ({
  id: `${index + 1}`,
  url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  poster: `https://picsum.photos/600/${800 + index}`,
  title: `精选视频 ${index + 1}`,
  author: {
    name: `创作者 ${index + 1}`,
    avatar: `https://picsum.photos/100/${100 + index}`
  },
  description: `这是一个精选视频示例 ${index + 1}`,
  category: categories[Math.floor(Math.random() * categories.length)],
  likes: Math.floor(Math.random() * 10000),
  comments: Math.floor(Math.random() * 1000),
  shares: Math.floor(Math.random() * 500)
}));

const Featured: React.FC = () => {
  const navigate = useNavigate();
  const [currentCategory, setCurrentCategory] = useState('全部');
  const [videos, setVideos] = useState<VideoData[]>(sampleVideos.slice(0, 12));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();
  const lastVideoElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreVideos();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const loadMoreVideos = () => {
    setLoading(true);
    setTimeout(() => {
      const currentLength = videos.length;
      const newVideos = sampleVideos.slice(currentLength, currentLength + 12);
      if (newVideos.length === 0) {
        setHasMore(false);
      } else {
        setVideos(prev => [...prev, ...newVideos]);
      }
      setLoading(false);
    }, 1000);
  };

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    const filteredInitialVideos = category === '全部' 
      ? sampleVideos.slice(0, 12)
      : sampleVideos.filter(video => video.category === category).slice(0, 12);
    setVideos(filteredInitialVideos);
    setHasMore(true);
  };

  const filteredVideos = currentCategory === '全部'
    ? videos
    : videos.filter(video => video.category === currentCategory);

  return (
    <Layout style={{ backgroundColor: '#121212', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '24px', height: '100%', overflowY: 'auto', position: 'relative' }}>
        <Tabs
          activeKey={currentCategory}
          onChange={handleCategoryChange}
          items={categories.map(category => ({
            key: category,
            label: category,
          }))}
          style={{ marginBottom: '24px' }}
        />
        <Row gutter={[16, 16]}>
          {filteredVideos.map((video, index) => (
            <Col
              key={video.id}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              ref={index === filteredVideos.length - 1 ? lastVideoElementRef : null}
            >
              <Card
                hoverable
                onClick={() => navigate(`/video/${video.id}`)}
                cover={
                  <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                    <img
                      src={video.poster}
                      alt={video.title}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <PlayCircleOutlined
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '48px',
                        color: 'rgba(255, 255, 255, 0.8)'
                      }}
                    />
                  </div>
                }
                bodyStyle={{ padding: '16px', backgroundColor: '#1d1d1d' }}
                style={{ backgroundColor: '#1d1d1d', border: 'none' }}
              >
                <Card.Meta
                  avatar={<Avatar src={video.author.avatar} />}
                  title={<span style={{ color: '#fff' }}>{video.title}</span>}
                  description={<span style={{ color: '#999' }}>{video.author.name}</span>}
                />
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-around' }}>
                  <Button type="text" icon={<HeartOutlined style={{ color: '#fff' }} />} style={{ color: '#fff' }}>{video.likes}</Button>
                  <Button type="text" icon={<MessageOutlined style={{ color: '#fff' }} />} style={{ color: '#fff' }}>{video.comments}</Button>
                  <Button type="text" icon={<ShareAltOutlined style={{ color: '#fff' }} />} style={{ color: '#fff' }}>{video.shares}</Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        {loading && (
          <div style={{ textAlign: 'center', padding: '24px', color: '#fff' }}>
            加载中...
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Featured;