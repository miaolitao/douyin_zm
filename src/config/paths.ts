// 路径配置管理
export interface MediaPathsConfig {
  // 媒体根目录 - 包含images和videos子文件夹
  mediaRoot: string
  // 单独配置的路径
  screenshots: string
  // 自动派生的路径（只读）
  images: string
  videos: string
  json: string
  words: string
}

// 默认路径配置
export const DEFAULT_PATHS: Omit<MediaPathsConfig, 'images' | 'videos' | 'json' | 'words'> = {
  mediaRoot: './public',
  screenshots: './screenshots'
}

// 获取用户配置的路径
export const getUserPaths = (): MediaPathsConfig => {
  try {
    const userPaths = localStorage.getItem('mediaPathsConfig')
    const config = userPaths ? { ...DEFAULT_PATHS, ...JSON.parse(userPaths) } : DEFAULT_PATHS
    
    // 自动计算所有派生路径
    const finalConfig: MediaPathsConfig = {
      ...config,
      images: `${config.mediaRoot}/images`,
      videos: `${config.mediaRoot}/videos`,
      json: `${config.mediaRoot}/json`,
      words: `${config.mediaRoot}/words`
    }
    
    return finalConfig
  } catch (error) {
    console.warn('获取用户路径配置失败:', error)
    const defaultConfig: MediaPathsConfig = {
      ...DEFAULT_PATHS,
      images: `${DEFAULT_PATHS.mediaRoot}/images`,
      videos: `${DEFAULT_PATHS.mediaRoot}/videos`,
      json: `${DEFAULT_PATHS.mediaRoot}/json`,
      words: `${DEFAULT_PATHS.mediaRoot}/words`
    }
    return defaultConfig
  }
}

// 保存用户配置的路径
export const saveUserPaths = (paths: Partial<Omit<MediaPathsConfig, 'images' | 'videos' | 'json' | 'words'>>): void => {
  try {
    const storedPaths = localStorage.getItem('mediaPathsConfig')
    const currentConfig = storedPaths ? JSON.parse(storedPaths) : DEFAULT_PATHS
    const newConfig = { ...currentConfig, ...paths }
    
    localStorage.setItem('mediaPathsConfig', JSON.stringify(newConfig))
    console.log('路径配置已保存:', newConfig)
  } catch (error) {
    console.error('保存路径配置失败:', error)
  }
}

// 重置为默认路径
export const resetToDefaultPaths = (): void => {
  localStorage.removeItem('mediaPathsConfig')
  console.log('路径配置已重置为默认值')
}

// 可配置路径类型定义（排除自动派生路径）
export type ConfigurablePathType = 'mediaRoot' | 'screenshots'
export type PathType = keyof MediaPathsConfig

// 路径显示名称映射
export const PATH_DISPLAY_NAMES: Record<ConfigurablePathType, string> = {
  mediaRoot: '媒体根目录',
  screenshots: '截图文件夹'
}

// 路径描述映射
export const PATH_DESCRIPTIONS: Record<ConfigurablePathType, string> = {
  mediaRoot: '媒体文件的根目录，系统会在其中自动查找或创建 images、videos、json、words 子文件夹',
  screenshots: '存储Playwright截图的文件夹'
}

// 自动派生路径的显示信息
export const DERIVED_PATH_INFO = {
  images: {
    name: '封面图片文件夹',
    description: '自动从媒体根目录派生：{mediaRoot}/images'
  },
  videos: {
    name: '视频文件夹', 
    description: '自动从媒体根目录派生：{mediaRoot}/videos'
  },
  json: {
    name: '数据文件夹',
    description: '自动从媒体根目录派生：{mediaRoot}/json'
  },
  words: {
    name: '词云文件夹',
    description: '自动从媒体根目录派生：{mediaRoot}/words'
  }
}
