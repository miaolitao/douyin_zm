// Electron API 类型声明
declare global {
  interface Window {
    electron?: {
      minimize: () => void
      maximize: () => void
      close: () => void
    }
    electronAPI?: {
      selectFolder: () => Promise<string | null>
      selectMediaRoot: () => Promise<string | null>
      testPath: (path: string) => Promise<boolean>
      createDirectory: (path: string) => Promise<boolean>
    }
  }
}

export {}
