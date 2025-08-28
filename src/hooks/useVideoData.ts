import { useState, useEffect, useCallback } from 'react'
import { localDataLoader } from '../utils/localDataLoader'
import { Video } from '../types/video'

interface UseVideoDataReturn {
  videos: Video[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  getVideoById: (id: string) => Video | null
  updateVideo: (id: string, updates: Partial<Video>) => void
}

// 全局视频数据缓存
let globalVideosCache: Video[] = []
let globalLoadingPromise: Promise<Video[]> | null = null

/**
 * 统一的视频数据管理Hook
 * 提供视频数据的加载、缓存、更新功能
 */
export const useVideoData = (): UseVideoDataReturn => {
  const [videos, setVideos] = useState<Video[]>(globalVideosCache)
  const [loading, setLoading] = useState(globalVideosCache.length === 0)
  const [error, setError] = useState<string | null>(null)

  const loadVideos = useCallback(async (): Promise<Video[]> => {
    // 如果已有缓存，直接返回
    if (globalVideosCache.length > 0) {
      return globalVideosCache
    }

    // 如果正在加载，等待现有的加载完成
    if (globalLoadingPromise) {
      return globalLoadingPromise
    }

    // 开始新的加载
    globalLoadingPromise = localDataLoader.getVideos()
    
    try {
      const loadedVideos = await globalLoadingPromise
      globalVideosCache = loadedVideos
      return loadedVideos
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '加载视频数据失败'
      throw new Error(errorMessage)
    } finally {
      globalLoadingPromise = null
    }
  }, [])

  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)
    
    try {
      // 清除缓存，强制重新加载
      globalVideosCache = []
      globalLoadingPromise = null
      
      const loadedVideos = await loadVideos()
      setVideos(loadedVideos)
      console.log('视频数据重新加载成功:', loadedVideos.length, '个视频')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '重新加载视频数据失败'
      setError(errorMessage)
      console.error('重新加载视频数据失败:', err)
    } finally {
      setLoading(false)
    }
  }, [loadVideos])

  const getVideoById = useCallback((id: string): Video | null => {
    return videos.find(video => video.id === id) || null
  }, [videos])

  const updateVideo = useCallback((id: string, updates: Partial<Video>): void => {
    const updatedVideos = videos.map(video => 
      video.id === id ? { ...video, ...updates } : video
    )
    
    // 更新本地状态
    setVideos(updatedVideos)
    
    // 更新全局缓存
    globalVideosCache = updatedVideos
    
    console.log('视频数据已更新:', id, updates)
  }, [videos])

  // 初始化加载
  useEffect(() => {
    let isMounted = true
    
    const initializeData = async () => {
      if (globalVideosCache.length > 0) {
        // 如果有缓存，直接使用
        if (isMounted) {
          setVideos(globalVideosCache)
          setLoading(false)
          console.log('使用缓存的视频数据:', globalVideosCache.length, '个视频')
        }
        return
      }
      
      if (isMounted) {
        setLoading(true)
        setError(null)
      }
      
      try {
        const loadedVideos = await loadVideos()
        if (isMounted) {
          setVideos(loadedVideos)
          console.log('视频数据加载成功:', loadedVideos.length, '个视频')
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : '加载视频数据失败'
          setError(errorMessage)
          console.error('加载视频数据失败:', err)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    initializeData()
    
    return () => {
      isMounted = false
    }
  }, []) // 只在组件挂载时执行一次

  return {
    videos,
    loading,
    error,
    refetch,
    getVideoById,
    updateVideo
  }
}

/**
 * 获取单个视频的Hook
 */
export const useVideo = (id: string) => {
  const { videos, loading, error, getVideoById } = useVideoData()
  const [video, setVideo] = useState<Video | null>(null)

  useEffect(() => {
    if (!loading && videos.length > 0) {
      const foundVideo = getVideoById(id)
      setVideo(foundVideo)
    }
  }, [id, videos, loading, getVideoById])

  return {
    video,
    loading,
    error
  }
}
