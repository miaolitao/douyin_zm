import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Card, Avatar, Button, Input, List } from 'antd';
import { Comment } from '@ant-design/compatible';
import { HeartOutlined, MessageOutlined, ShareAltOutlined } from '@ant-design/icons';
import VideoPlayer from '../components/VideoPlayer';
import { sampleVideos } from '../data/videos';

const { Content } = Layout;

const sampleComments = [
  {
    author: '用户1',
    avatar: 'https://picsum.photos/100/100',
    content: '这个视频太棒了！',
    datetime: '2分钟前',
    likes: 128
  },
  {
    author: '用户2',
    avatar: 'https://picsum.photos/100/101',
    content: '学到了很多，感谢分享',
    datetime: '5分钟前',
    likes: 56
  },
  {
    author: '用户3',
    avatar: 'https://picsum.photos/100/102',
    content: '期待更多类似的内容',
    datetime: '10分钟前',
    likes: 32
  }
];

const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const video = sampleVideos.find(v => v.id === id);

  if (!video) {
    return <div>视频不存在</div>;
  }

  return (
    <Layout style={{ height: '100%', backgroundColor: '#121212', padding: '24px' }}>
      <Content style={{ display: 'flex', gap: '24px' }}>
        <div style={{ flex: '1 1 70%' }}>
          <Card
            style={{ backgroundColor: '#1d1d1d', marginBottom: '24px' }}
            bodyStyle={{ padding: 0 }}
          >
            <div style={{ height: '600px' }}>
              <VideoPlayer videoUrl={video.videoUrl} poster={video.poster} />
            </div>
          </Card>
          
          <Card
            style={{ backgroundColor: '#1d1d1d' }}
            bodyStyle={{ padding: '16px' }}
          >
            <Card.Meta
              avatar={<Avatar src={video.author.avatar} size={48} />}
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#fff', fontSize: '18px' }}>{video.title}</span>
                  <div>
                    <Button type="primary" icon={<HeartOutlined />} style={{ marginRight: '8px' }}>喜欢</Button>
                    <Button icon={<ShareAltOutlined />}>分享</Button>
                  </div>
                </div>
              }
              description={
                <div style={{ color: '#999', marginTop: '8px' }}>
                  <div style={{ marginBottom: '8px' }}>{video.author.name}</div>
                  <div>{video.description}</div>
                </div>
              }
            />
          </Card>
        </div>

        <Card
          style={{ flex: '1 1 30%', backgroundColor: '#1d1d1d', height: 'fit-content' }}
          title="评论"
          headStyle={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <div style={{ marginBottom: '16px' }}>
            <Input.TextArea
              placeholder="写下你的评论..."
              autoSize={{ minRows: 2, maxRows: 4 }}
              style={{ backgroundColor: '#2d2d2d', borderColor: '#3d3d3d', color: '#fff' }}
            />
            <div style={{ marginTop: '8px', textAlign: 'right' }}>
              <Button type="primary">发布评论</Button>
            </div>
          </div>

          <List
            itemLayout="horizontal"
            dataSource={sampleComments}
            renderItem={item => (
              <Comment
                author={<span style={{ color: '#fff' }}>{item.author}</span>}
                avatar={<Avatar src={item.avatar} />}
                content={<p style={{ color: '#fff' }}>{item.content}</p>}
                datetime={
                  <div style={{ color: '#999' }}>
                    <span>{item.datetime}</span>
                    <Button 
                      type="text" 
                      icon={<HeartOutlined />} 
                      style={{ marginLeft: '8px', color: '#999' }}
                    >
                      {item.likes}
                    </Button>
                  </div>
                }
              />
            )}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default VideoDetail;