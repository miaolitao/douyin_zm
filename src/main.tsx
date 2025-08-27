import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#ff0050',
          colorBgContainer: '#000000',
          colorBgElevated: '#000000',
          colorBgLayout: '#000000',
          colorText: '#ffffff',
          colorTextSecondary: '#888888',
          colorBorder: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 8,
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)