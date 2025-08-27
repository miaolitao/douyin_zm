# 抖音桌面端应用

这是一个一比一还原抖音UI样式的桌面端应用程序，使用 Electron + React + TypeScript + Ant Design 构建。

## 功能特性

- 🎨 完全还原抖音的UI设计风格
- 🖥️ 原生桌面应用体验
- 📱 响应式设计，支持不同屏幕尺寸
- 🎬 视频浏览和分类
- 🔍 搜索功能
- 👤 用户系统
- 💖 点赞、评论、分享功能
- 🎵 多分类内容（搞笑、美食、音乐、舞蹈等）

## 技术栈

- **前端框架**: React 18 + TypeScript
- **UI组件库**: Ant Design 5
- **桌面应用**: Electron 28
- **构建工具**: Vite 5
- **路由**: React Router DOM 6
- **样式**: CSS3 + 自定义主题

## 安装和运行

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# 启动开发服务器
npm run dev

# 启动Electron应用
npm start
```

### 构建应用

```bash
# 构建生产版本
npm run build
```

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── Sidebar.tsx     # 侧边栏导航
│   ├── TitleBar.tsx    # 标题栏
│   └── VideoPlayer.tsx # 视频播放器
├── pages/              # 页面目录
│   ├── Home.tsx        # 首页
│   ├── Featured.tsx    # 精选页面
│   ├── Game.tsx        # 游戏页面
│   ├── Anime.tsx       # 二次元页面
│   ├── Music.tsx       # 音乐页面
│   ├── Food.tsx        # 美食页面
│   ├── Knowledge.tsx   # 知识页面
│   ├── Sports.tsx      # 体育页面
│   └── VideoDetail.tsx # 视频详情页面
├── data/               # 数据目录
│   └── videos.ts       # 视频数据
├── types/              # 类型定义
│   └── video.ts        # 视频相关类型
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口
└── App.css             # 全局样式
```

## 设计特色

### 视觉风格
- 深色主题 (#000000 背景)
- 抖音品牌色 (#ff0050)
- 圆角设计 (12px 圆角)
- 半透明效果
- 悬停动画

### 交互体验
- 流畅的悬停效果
- 卡片悬停提升
- 图片缩放动画
- 加载动画
- 响应式布局

### 组件设计
- 自定义滚动条
- 抖音风格的按钮
- 视频卡片布局
- 分类标签系统
- 用户头像设计

## 主要页面

### 首页 (/)
- 分类标签导航
- 视频网格布局
- 无限滚动加载
- 视频信息展示

### 侧边栏
- 主要导航菜单
- 搜索功能
- 用户信息
- 上传按钮

### 标题栏
- 抖音Logo
- 搜索框
- 通知和消息
- 窗口控制

## 自定义配置

### 主题颜色
可以在 `src/main.tsx` 中修改主题配置：

```typescript
theme={{
  token: {
    colorPrimary: '#ff0050',        // 主色调
    colorBgContainer: '#000000',    // 背景色
    colorText: '#ffffff',           // 文字色
    borderRadius: 8,                // 圆角大小
  },
}}
```

### 样式定制
全局样式在 `src/App.css` 中定义，包括：
- Ant Design 组件样式覆盖
- 自定义动画效果
- 响应式设计规则
- 滚动条样式

## 开发说明

### 添加新页面
1. 在 `src/pages/` 目录下创建新页面组件
2. 在 `src/App.tsx` 中添加路由
3. 在 `src/components/Sidebar.tsx` 中添加导航菜单项

### 添加新功能
1. 在 `src/types/` 中定义相关类型
2. 在 `src/data/` 中添加数据
3. 在相应组件中实现功能逻辑

### 样式修改
- 全局样式：修改 `src/App.css`
- 组件样式：使用内联样式或创建组件专用CSS文件
- 主题配置：修改 `src/main.tsx` 中的主题设置

## 注意事项

- 确保所有依赖都已正确安装
- 开发时建议使用 `npm run dev` 启动开发服务器
- 测试桌面应用功能时使用 `npm start`
- 图片资源使用占位符，实际使用时请替换为真实资源

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！