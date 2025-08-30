import React from 'react'
import { Layout } from 'antd'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
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
import Profile from './pages/Profile'
import Demo from './components/Demo'
import InteractionTestDemo from './components/InteractionTestDemo'

const { Content } = Layout

const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#000000'
      }}>
        <TitleBar />
        <Layout style={{ flex: 1, overflow: 'hidden' }}>
          <Sidebar />
          <Content style={{ 
            flex: 1, 
            overflow: 'auto', 
            backgroundColor: '#000000',
            position: 'relative'
          }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/test" element={<InteractionTestDemo />} />
              <Route path="/featured" element={<Featured />} />
              <Route path="/game" element={<Game />} />
              <Route path="/anime" element={<Anime />} />
              <Route path="/music" element={<Music />} />
              <Route path="/food" element={<Food />} />
              <Route path="/knowledge" element={<Knowledge />} />
              <Route path="/sports" element={<Sports />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/video/:id" element={<VideoDetail />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  )
}

export default App