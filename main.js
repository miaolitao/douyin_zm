const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

// 处理窗口控制事件
ipcMain.on('window-minimize', (event) => {
  BrowserWindow.fromWebContents(event.sender).minimize()
})

ipcMain.on('window-maximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  win.isMaximized() ? win.unmaximize() : win.maximize()
})

ipcMain.on('window-close', (event) => {
  BrowserWindow.fromWebContents(event.sender).close()
})

// 处理文件夹选择
ipcMain.handle('select-folder', async (event) => {
  try {
    const win = BrowserWindow.fromWebContents(event.sender)
    const result = await dialog.showOpenDialog(win, {
      title: '选择文件夹',
      properties: ['openDirectory', 'createDirectory', 'treatPackageAsDirectory'],
      buttonLabel: '选择',
      // 默认从用户主目录开始，这样可以访问所有硬盘
      defaultPath: require('os').homedir()
    })
    
    if (!result.canceled && result.filePaths.length > 0) {
      console.log('选择的文件夹:', result.filePaths[0])
      return result.filePaths[0]
    }
    return null
  } catch (error) {
    console.error('选择文件夹失败:', error)
    return null
  }
})

// 处理媒体根目录选择  
ipcMain.handle('select-media-root', async (event) => {
  try {
    const win = BrowserWindow.fromWebContents(event.sender)
    console.log('准备打开媒体根目录选择对话框')
    
    const result = await dialog.showOpenDialog(win, {
      title: '选择媒体根目录',
      message: '请选择一个文件夹作为媒体文件的根目录，系统会自动在其中查找或创建子文件夹',
      properties: ['openDirectory', 'createDirectory'],
      buttonLabel: '选择作为媒体根目录'
    })
    
    console.log('对话框结果:', result)
    
    if (!result.canceled && result.filePaths.length > 0) {
      console.log('选择的媒体根目录:', result.filePaths[0])
      return result.filePaths[0]
    }
    console.log('用户取消选择或没有选择路径')
    return null
  } catch (error) {
    console.error('选择媒体根目录失败:', error)
    return null
  }
})

// 测试路径是否存在
ipcMain.handle('test-path', async (event, folderPath) => {
  try {
    if (!folderPath) return false
    
    // 处理相对路径
    let absolutePath = folderPath
    if (!path.isAbsolute(folderPath)) {
      absolutePath = path.resolve(__dirname, folderPath)
    }
    
    // 检查路径是否存在且是目录
    const stats = await fs.promises.stat(absolutePath)
    return stats.isDirectory()
  } catch (error) {
    console.log('路径测试失败:', error.message)
    return false
  }
})

// 创建目录（如果不存在）
ipcMain.handle('create-directory', async (event, folderPath) => {
  try {
    if (!folderPath) return false
    
    let absolutePath = folderPath
    if (!path.isAbsolute(folderPath)) {
      absolutePath = path.resolve(__dirname, folderPath)
    }
    
    await fs.promises.mkdir(absolutePath, { recursive: true })
    return true
  } catch (error) {
    console.error('创建目录失败:', error)
    return false
  }
})

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1000,
    minHeight: 670,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: false,
      webSecurity: true
    }
  })

  // 窗口准备好后再显示
  win.once('ready-to-show', () => {
    win.show()
  })

  // 根据环境变量决定加载方式
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000')
    win.webContents.openDevTools()
  } else {
    win.loadFile('dist/index.html')
  }

  return win
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})