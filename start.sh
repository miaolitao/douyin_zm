#!/bin/bash

echo "🚀 启动抖音桌面端应用..."
echo ""

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js 18+"
    echo "   下载地址: https://nodejs.org/"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到npm，请先安装npm"
    exit 1
fi

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败，请检查网络连接或重试"
        exit 1
    fi
    echo "✅ 依赖安装完成"
fi

echo ""
echo "🎯 选择运行模式:"
echo "1. 开发模式 (推荐用于开发调试)"
echo "2. 桌面应用模式 (完整的Electron应用)"
echo "3. 构建生产版本"
echo ""
read -p "请输入选择 (1-3): " choice

case $choice in
    1)
        echo "🔧 启动开发服务器..."
        echo "   浏览器将自动打开 http://localhost:3000"
        echo "   按 Ctrl+C 停止服务器"
        echo ""
        npm run dev
        ;;
    2)
        echo "🖥️  启动桌面应用..."
        echo "   正在启动Electron应用..."
        echo ""
        npm start
        ;;
    3)
        echo "🏗️  构建生产版本..."
        echo "   正在构建应用..."
        echo ""
        npm run build
        echo "✅ 构建完成！输出目录: dist/"
        ;;
    *)
        echo "❌ 无效选择，请重新运行脚本"
        exit 1
        ;;
esac

