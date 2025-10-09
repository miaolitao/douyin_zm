// 截图助手工具
import { getUserPaths } from '../config/paths'

/**
 * 获取配置的截图保存路径
 * @returns 截图文件夹路径
 */
export const getScreenshotPath = (): string => {
  const userPaths = getUserPaths()
  let screenshotsPath = userPaths.screenshots
  
  // 转换相对路径为绝对路径（用于前端显示）
  if (screenshotsPath.startsWith('./')) {
    screenshotsPath = screenshotsPath.replace('./', '/')
  }
  
  return screenshotsPath
}

/**
 * 生成带时间戳的截图文件名
 * @param prefix 文件名前缀
 * @returns 文件名（不含路径）
 */
export const generateScreenshotFilename = (prefix = 'screenshot'): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `${prefix}-${timestamp}.png`
}

/**
 * 获取完整的截图文件路径
 * @param filename 文件名
 * @returns 完整的文件路径
 */
export const getFullScreenshotPath = (filename: string): string => {
  const screenshotsPath = getScreenshotPath()
  return `${screenshotsPath}/${filename}`
}

/**
 * Playwright 截图配置示例
 * 在使用 Playwright 进行截图时可以参考此配置
 */
export const playwrightScreenshotConfig = {
  // 根据用户配置生成截图路径
  getPath: (filename?: string): string => {
    const actualFilename = filename || generateScreenshotFilename()
    return getFullScreenshotPath(actualFilename)
  },
  
  // 默认截图选项
  defaultOptions: {
    fullPage: true,
    quality: 90,
    type: 'png' as const
  }
}

// 导出配置给外部使用
export const SCREENSHOT_CONFIG = {
  supportedFormats: ['png', 'jpeg', 'webp'],
  defaultQuality: 90,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  defaultPrefix: 'douyin-screenshot'
}










