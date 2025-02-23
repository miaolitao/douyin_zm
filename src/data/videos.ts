import { VideoData } from '../types/video';

const categories = ['全部', '游戏', '二次元', '音乐', '美食', '知识', '体育'];

export const sampleVideos: VideoData[] = Array(20).fill(null).map((_, index) => ({
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

export { categories };