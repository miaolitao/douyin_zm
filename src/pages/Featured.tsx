import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Layout, Tabs, Card, Avatar, Button, Row, Col } from 'antd';
import { HeartOutlined, MessageOutlined, ShareAltOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import { useVideoData } from '../hooks/useVideoData';
import LoadingState from '../components/LoadingState';
import { categories } from '../data/videos';

const Featured: React.FC = () => {
  const navigate = useNavigate();
  const [currentCategory, setCurrentCategory] = useState('全部');
  const [displayCount, setDisplayCount] = useState(12);
  const observer = useRef<IntersectionObserver>();

  // 使用统一的视频数据Hook
  const { videos: allVideos, loading, error, refetch, updateVideo } = useVideoData()

  // 过滤和分页逻辑
  const filteredVideos = useMemo(() => {
    const filtered = currentCategory === '全部'
      ? allVideos
      : allVideos.filter(video => video.category === currentCategory)
    
    return filtered.slice(0, displayCount)
  }, [allVideos, currentCategory, displayCount])

  const hasMore = useMemo(() => {
    const totalFiltered = currentCategory === '全部'
      ? allVideos.length
      : allVideos.filter(video => video.category === currentCategory).length
    
    return displayCount < totalFiltered
  }, [allVideos, currentCategory, displayCount])
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
    if (!hasMore) return;
    setDisplayCount(prev => prev + 12);
  };

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    setDisplayCount(12); // 重置显示数量
  };



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
        <LoadingState
          loading={loading}
          error={error}
          onRetry={refetch}
          showEmpty={filteredVideos.length === 0}
          emptyMessage="暂无精选视频"
        >
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
        </LoadingState>
      </div>
    </Layout>
  );
};

export default Featured;