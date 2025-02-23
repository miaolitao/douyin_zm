import React from 'react'
import { Layout } from 'antd'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TitleBar from './components/TitleBar'
import Home from './pages/Home'
import Featured from './pages/Featured'
import Game from './pages/Game'
import Anime from './pages/Anime'
import Music from './pages/Music'
import Food from './pages/Food'
import Knowledge from './pages/Knowledge'
import Sports from './pages/Sports'
import VideoDetail from './pages/VideoDetail'

const { Content } = Layout

const App: React.FC = () => {
  return (
    <Layout style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TitleBar />
      <Layout style={{ flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <Content style={{ flex: 1, overflow: 'auto', backgroundColor: '#121212' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/featured" element={<Featured />} />
            <Route path="/game" element={<Game />} />
            <Route path="/anime" element={<Anime />} />
            <Route path="/music" element={<Music />} />
            <Route path="/food" element={<Food />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/video/:id" element={<VideoDetail />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App