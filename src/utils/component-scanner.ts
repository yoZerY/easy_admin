/**
 * 组件路径扫描工具
 * 使用 Vite 的 import.meta.glob 动态扫描 views 目录下的所有组件
 */

/**
 * 组件选项接口
 */
export interface ComponentOption {
  label: string
  value: string
  description?: string
  group?: string
}

/**
 * 动态获取所有可用的组件路径
 */
export function getComponentOptions(): ComponentOption[] {
  const components: ComponentOption[] = []

  // 添加布局组件
  components.push({
    label: 'Layout（布局组件）',
    value: 'Layout',
    description: '用于目录类型的菜单',
    group: '布局组件'
  })

  // 使用 Vite 的 import.meta.glob 扫描所有 .vue 文件
  const modules = import.meta.glob('/src/views/**/*.vue', { eager: false })

  // 处理扫描到的文件路径
  Object.keys(modules).forEach((path) => {
    // 移除 /src/ 前缀和 .vue 后缀
    const componentPath = path.replace('/src/', '').replace('.vue', '')

    // 跳过 components 目录下的组件（这些是内部组件，不是页面）
    if (componentPath.includes('/components/')) {
      return
    }

    // 生成显示标签
    const label = generateLabel(componentPath) || componentPath

    // 生成分组
    const group = generateGroup(componentPath) || '其他'

    // 生成描述（路由路径）
    const description = generateDescription(componentPath) || ''

    components.push({
      label,
      value: componentPath,
      description,
      group
    })
  })

  // 按分组和标签排序
  components.sort((a, b) => {
    if (a.group !== b.group) {
      return (a.group || '').localeCompare(b.group || '')
    }
    return a.label.localeCompare(b.label)
  })

  console.log('📦 扫描到的组件:', components.length, '个')
  console.log('组件列表:', components)

  return components
}

/**
 * 生成组件显示标签
 */
function generateLabel(componentPath: string): string {
  // views/system/user/index -> 用户管理
  // views/dashboard/analysis/index -> 数据分析

  const parts = componentPath.split('/')
  const fileName = parts[parts.length - 1] || ''
  const folderName = parts[parts.length - 2] || ''

  // 如果是 index，使用文件夹名称
  if (fileName === 'index') {
    return formatName(folderName)
  }

  // 否则使用文件名
  return formatName(fileName)
}

/**
 * 生成分组名称
 */
function generateGroup(componentPath: string): string {
  // views/system/user/index -> 系统管理
  // views/dashboard/analysis/index -> 仪表盘

  const parts = componentPath.split('/')

  if (parts.length < 3) {
    return '其他'
  }

  const category = parts[1] // views 后面的第一级目录

  const groupMap: Record<string, string> = {
    welcome: '首页',
    dashboard: '仪表盘',
    system: '系统管理',
    data: '数据管理',
    monitor: '系统监控',
    components: '组件示例',
    demo: '演示页面',
    user: '个人中心',
    error: '错误页面',
    login: '登录页面'
  }

  return groupMap[category || ''] || formatName(category || '')
}

/**
 * 生成描述（路由路径）
 */
function generateDescription(componentPath: string): string {
  // views/system/user/index -> /system/user
  // views/welcome/index -> /welcome

  const path = componentPath.replace('views/', '/').replace('/index', '')

  // 如果路径以 /error 开头，保持原样
  if (path.startsWith('/error/')) {
    return path.replace('/error/', '/')
  }

  return path
}

/**
 * 格式化名称（将 kebab-case 或 camelCase 转换为中文友好的名称）
 */
function formatName(name: string): string {
  // 简单的名称映射
  const nameMap: Record<string, string> = {
    // 系统管理
    user: '用户管理',
    role: '角色管理',
    menu: '菜单管理',
    department: '部门管理',
    dept: '部门管理',

    // 仪表盘
    dashboard: '仪表盘',
    analysis: '数据分析',
    workbench: '工作台',

    // 数据管理
    data: '数据管理',
    list: '数据列表',
    import: '数据导入',
    export: '数据导出',
    backup: '数据备份',

    // 系统监控
    monitor: '系统监控',
    online: '在线用户',
    logs: '系统日志',
    server: '服务监控',

    // 组件示例
    button: '按钮示例',
    table: '表格示例',
    form: '表单示例',

    // 演示页面
    permission: '权限演示',
    nprogress: '进度条演示',
    'login-flow': '登录流程演示',

    // 个人中心
    profile: '个人资料',
    security: '安全设置',
    settings: '账号设置',

    // 首页
    welcome: '欢迎页',

    // 错误页面
    '403': '403 无权限',
    '404': '404 页面不存在'
  }

  return nameMap[name] || name
}

/**
 * 根据组件路径获取组件选项
 */
export function getComponentOption(value: string): ComponentOption | undefined {
  const options = getComponentOptions()
  return options.find((option) => option.value === value)
}

/**
 * 验证组件路径是否有效
 */
export function isValidComponentPath(path: string): boolean {
  const options = getComponentOptions()
  return options.some((option) => option.value === path)
}

/**
 * 获取组件路径的显示名称
 */
export function getComponentLabel(value: string): string {
  const option = getComponentOption(value)
  return option ? option.label : value
}
