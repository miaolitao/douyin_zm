import React, { useState, useEffect } from 'react'
import { Layout, Card, Button, Input, message, Space, Typography, Divider, Modal } from 'antd'
import { 
  FolderOpenOutlined, 
  ReloadOutlined, 
  SettingOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons'
import {
  getUserPaths,
  saveUserPaths,
  resetToDefaultPaths,
  MediaPathsConfig,
  ConfigurablePathType,
  PATH_DISPLAY_NAMES,
  PATH_DESCRIPTIONS,
  DERIVED_PATH_INFO
} from '../config/paths'

const { Content } = Layout
const { Title, Text, Paragraph } = Typography

const Settings: React.FC = () => {
  const [paths, setPaths] = useState<MediaPathsConfig>(getUserPaths())
  const [loading, setLoading] = useState<Record<ConfigurablePathType, boolean>>({
    mediaRoot: false,
    screenshots: false
  })

  // 选择文件夹
  const selectFolder = async (pathType: ConfigurablePathType) => {
    setLoading(prev => ({ ...prev, [pathType]: true }))
    
    try {
      let selectedPath: string | null = null
      
      if (pathType === 'mediaRoot') {
        // 使用专门的媒体根目录选择对话框
        selectedPath = await (window as any).electronAPI?.selectMediaRoot()
      } else {
        // 普通文件夹选择
        selectedPath = await (window as any).electronAPI?.selectFolder()
      }
      
      if (selectedPath) {
        const newPaths = { ...paths, [pathType]: selectedPath }
        // 如果是媒体根目录，重新计算所有派生路径
        if (pathType === 'mediaRoot') {
          newPaths.images = `${selectedPath}/images`
          newPaths.videos = `${selectedPath}/videos`
          newPaths.json = `${selectedPath}/json`
          newPaths.words = `${selectedPath}/words`
        }
        
        setPaths(newPaths)
        saveUserPaths({ [pathType]: selectedPath })
        message.success(`${PATH_DISPLAY_NAMES[pathType]}路径已更新`)
      }
    } catch (error) {
      console.error('选择文件夹失败:', error)
      message.error('选择文件夹失败，请重试')
    } finally {
      setLoading(prev => ({ ...prev, [pathType]: false }))
    }
  }

  // 手动输入路径
  const handlePathChange = (pathType: ConfigurablePathType, value: string) => {
    const newPaths = { ...paths, [pathType]: value }
    // 如果是媒体根目录，重新计算所有派生路径
    if (pathType === 'mediaRoot') {
      newPaths.images = `${value}/images`
      newPaths.videos = `${value}/videos`
      newPaths.json = `${value}/json`
      newPaths.words = `${value}/words`
    }
    setPaths(newPaths)
  }

  // 保存路径配置
  const savePaths = () => {
    try {
      // 只保存可配置的路径，其他路径会自动派生
      const configurablePaths = {
        mediaRoot: paths.mediaRoot,
        screenshots: paths.screenshots
      }
      saveUserPaths(configurablePaths)
      message.success('路径配置已保存！')
    } catch (error) {
      message.error('保存失败，请重试')
    }
  }

  // 重置为默认路径
  const resetPaths = () => {
    Modal.confirm({
      title: '确认重置',
      content: '确定要将所有路径重置为默认值吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        resetToDefaultPaths()
        setPaths(getUserPaths())
        message.success('路径配置已重置为默认值')
      }
    })
  }

  // 测试路径是否有效
  const testPath = async (pathType: ConfigurablePathType) => {
    const path = paths[pathType]
    try {
      const isValid = await (window as any).electronAPI?.testPath?.(path)
      if (isValid) {
        message.success(`${PATH_DISPLAY_NAMES[pathType]}路径有效`)
      } else {
        message.warning(`${PATH_DISPLAY_NAMES[pathType]}路径不存在或无法访问`)
      }
    } catch (error) {
      message.error('路径测试失败')
    }
  }

  // 渲染可配置路径配置项
  const renderConfigurablePathConfig = (pathType: ConfigurablePathType) => (
    <Card 
      key={pathType}
      style={{ 
        marginBottom: 16,
        borderRadius: 12,
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
      bodyStyle={{ padding: '20px' }}
    >
      <div style={{ marginBottom: 12 }}>
        <Title level={5} style={{ color: '#ffffff', margin: 0 }}>
          <SettingOutlined style={{ marginRight: 8, color: '#ff0050' }} />
          {PATH_DISPLAY_NAMES[pathType]}
        </Title>
        <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
          {PATH_DESCRIPTIONS[pathType]}
        </Text>
      </div>
      
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input
          value={paths[pathType]}
          onChange={(e) => handlePathChange(pathType, e.target.value)}
          placeholder="请输入文件夹路径或点击选择按钮"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 8,
            color: '#ffffff'
          }}
          suffix={
            <Button
              type="text"
              icon={<InfoCircleOutlined />}
              size="small"
              onClick={() => testPath(pathType)}
              style={{ color: '#ff0050' }}
              title="测试路径是否有效"
            />
          }
        />
        
        <Space>
          <Button
            type="primary"
            icon={<FolderOpenOutlined />}
            loading={loading[pathType]}
            onClick={() => selectFolder(pathType)}
            style={{
              background: '#ff0050',
              borderColor: '#ff0050',
              borderRadius: 8
            }}
          >
            {pathType === 'mediaRoot' ? '选择媒体根目录' : '选择文件夹'}
          </Button>
          
          <Button
            icon={<CheckCircleOutlined />}
            onClick={() => testPath(pathType)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              borderRadius: 8
            }}
          >
            测试路径
          </Button>
        </Space>
      </Space>
    </Card>
  )

  return (
    <Layout style={{ minHeight: '100vh', background: '#000000' }}>
      <Content style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <Title level={2} style={{ color: '#ffffff', textAlign: 'center' }}>
            <SettingOutlined style={{ marginRight: 12, color: '#ff0050' }} />
            文件夹路径设置
          </Title>
          <Paragraph style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>
            配置应用程序使用的文件夹路径，可以指向电脑上的任意位置
          </Paragraph>
        </div>

        <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* 可配置路径配置列表 */}
        {(Object.keys(PATH_DISPLAY_NAMES) as ConfigurablePathType[]).map(renderConfigurablePathConfig)}
        
        <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        {/* 自动派生路径显示 */}
        <Card 
          style={{ 
            marginBottom: 16,
            borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
          bodyStyle={{ padding: '20px' }}
        >
          <Title level={4} style={{ color: '#ffffff', marginBottom: 16 }}>
            <InfoCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
            自动派生的路径
          </Title>
          <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', display: 'block', marginBottom: 16 }}>
            以下路径会根据媒体根目录自动生成，无需单独配置
          </Text>
          
          {/* 显示所有自动派生的路径 */}
          {Object.entries(DERIVED_PATH_INFO).map(([key, info], index) => (
            <div 
              key={key}
              style={{ 
                marginBottom: index === Object.keys(DERIVED_PATH_INFO).length - 1 ? 0 : 12, 
                padding: '12px', 
                background: 'rgba(255, 255, 255, 0.05)', 
                borderRadius: 8 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text style={{ color: '#52c41a', fontWeight: 500 }}>{info.name}</Text>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '11px', marginTop: 4 }}>
                    {info.description.replace('{mediaRoot}', paths.mediaRoot)}
                  </div>
                </div>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', fontFamily: 'monospace' }}>
                  {paths[key as keyof MediaPathsConfig]}
                </Text>
              </div>
            </div>
          ))}
        </Card>

        <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* 操作按钮 */}
        <Space style={{ width: '100%', justifyContent: 'center' }} size="large">
          <Button
            type="primary"
            size="large"
            icon={<CheckCircleOutlined />}
            onClick={savePaths}
            style={{
              background: '#ff0050',
              borderColor: '#ff0050',
              borderRadius: 12,
              height: 48,
              paddingLeft: 32,
              paddingRight: 32
            }}
          >
            保存配置
          </Button>
          
          <Button
            size="large"
            icon={<ReloadOutlined />}
            onClick={resetPaths}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              borderRadius: 12,
              height: 48,
              paddingLeft: 32,
              paddingRight: 32
            }}
          >
            重置为默认
          </Button>
        </Space>

        {/* 说明信息 */}
        <Card 
          style={{ 
            marginTop: 32,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 12
          }}
        >
          <Title level={5} style={{ color: '#ff0050' }}>
            <InfoCircleOutlined style={{ marginRight: 8 }} />
            使用说明
          </Title>
          <Paragraph style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            • <strong style={{ color: '#52c41a' }}>媒体根目录</strong>：选择一个文件夹，系统会自动在其中查找或创建所有子文件夹（images、videos、json、words）<br/>
            • 点击"选择媒体根目录"按钮可以访问包括外置硬盘在内的所有位置<br/>
            • <strong style={{ color: '#52c41a' }}>截图文件夹</strong>：Playwright截图的专用存储位置<br/>
            • 也可以直接在输入框中手动输入路径<br/>
            • 点击"测试路径"可以验证路径是否有效<br/>
            • 配置会自动保存到本地，重启应用后仍然有效<br/>
            • 支持相对路径（相对于应用程序）和绝对路径<br/>
            • 极简配置：只需2个选择，自动管理4个子文件夹
          </Paragraph>
        </Card>
      </Content>
    </Layout>
  )
}

export default Settings
