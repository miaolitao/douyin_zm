const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

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

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1000,
    minHeight: 670,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
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