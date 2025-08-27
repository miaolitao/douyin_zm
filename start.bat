@echo off
chcp 65001 >nul
echo 🚀 启动抖音桌面端应用...
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到Node.js，请先安装Node.js 18+
    echo    下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查npm是否安装
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到npm，请先安装npm
    pause
    exit /b 1
)

REM 检查依赖是否安装
if not exist "node_modules" (
    echo 📦 正在安装依赖...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败，请检查网络连接或重试
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
)

echo.
echo 🎯 选择运行模式:
echo 1. 开发模式 (推荐用于开发调试)
echo 2. 桌面应用模式 (完整的Electron应用)
echo 3. 构建生产版本
echo.
set /p choice="请输入选择 (1-3): "

if "%choice%"=="1" (
    echo 🔧 启动开发服务器...
    echo    浏览器将自动打开 http://localhost:3000
    echo    按 Ctrl+C 停止服务器
    echo.
    npm run dev
) else if "%choice%"=="2" (
    echo 🖥️  启动桌面应用...
    echo    正在启动Electron应用...
    echo.
    npm start
) else if "%choice%"=="3" (
    echo 🏗️  构建生产版本...
    echo    正在构建应用...
    echo.
    npm run build
    echo ✅ 构建完成！输出目录: dist/
    pause
) else (
    echo ❌ 无效选择，请重新运行脚本
    pause
    exit /b 1
)

