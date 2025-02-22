import React from 'react'
import { Layout } from 'antd'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TitleBar from './components/TitleBar'
import Home from './pages/Home'
import Game from './pages/Game'
import Anime from './pages/Anime'
import Music from './pages/Music'
import Food from './pages/Food'
import Knowledge from './pages/Knowledge'
import Sports from './pages/Sports'

const { Content } = Layout

const App: React.FC = () => {
  return (
    <Layout style={{ height: '100vh' }}>
      <TitleBar />
      <Layout>
        <Sidebar />
        <Content style={{ position: 'relative', overflow: 'hidden' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="/anime" element={<Anime />} />
            <Route path="/music" element={<Music />} />
            <Route path="/food" element={<Food />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/sports" element={<Sports />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App