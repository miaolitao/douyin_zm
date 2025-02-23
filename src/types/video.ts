export interface VideoData {
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