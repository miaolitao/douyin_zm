const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close')
})

// 文件夹选择和路径管理API
contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectMediaRoot: () => ipcRenderer.invoke('select-media-root'),
  testPath: (path) => ipcRenderer.invoke('test-path', path),
  createDirectory: (path) => ipcRenderer.invoke('create-directory', path)
})