import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter as Router } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#fe2c55',
          borderRadius: 2,
          colorBgContainer: '#121212',
          colorBgElevated: '#1d1d1d',
          colorText: '#ffffff'
        }
      }}
    >
      <Router>
        <App />
      </Router>
    </ConfigProvider>
  </React.StrictMode>
)