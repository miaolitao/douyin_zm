# 抖音PC客户端

一个基于Electron和React的抖音PC客户端应用，提供流畅的桌面端抖音浏览体验。

## 项目特点

- 🖥️ 原生桌面应用体验
- ⚡ 基于Electron的高性能架构
- 🎨 现代化的用户界面设计
- 🔄 流畅的视频浏览和交互
- 🛠️ 使用Vite构建，开发体验优秀

## 技术栈

- Electron - 跨平台桌面应用框架
- React + TypeScript - 前端开发框架
- Vite - 现代化构建工具

## 开发环境要求

- Node.js 16.x 或更高版本
- npm 或 yarn 包管理器

## 安装和运行

1. 克隆项目到本地：

```bash
git clone [项目地址]
cd douyin_pc
```

2. 安装依赖：

```bash
npm install
# 或
yarn
```

3. 启动开发服务器：

```bash
npm run dev
# 或
yarn dev
```

4. 打包应用：

```bash
npm run build
# 或
yarn build
```

## 项目结构

```
douyin_pc/
├── src/              # 源代码目录
│   ├── components/   # 公共组件
│   ├── pages/       # 页面组件
│   ├── App.tsx      # 应用入口组件
│   └── main.tsx     # 主渲染进程入口
├── main.js          # 主进程入口文件
├── preload.js       # 预加载脚本
└── vite.config.ts   # Vite配置文件
```

## 贡献指南

欢迎提交Issue和Pull Request，一起完善这个项目！

## 许可证

本项目采用 MIT 许可证。