import { ThemeModeEnum } from '@/enums/theme'
import tinycolor from 'tinycolor2'

type ColorType = 'primary' | 'success' | 'warning' | 'danger' | 'error' | 'info'

interface ThemeColors {
  primary: string
  success: string
  warning: string
  danger: string
  error: string
  info: string
}

/**
 * 获取系统主题偏好
 */
function getSystemTheme(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * 解析主题模式，返回实际的暗色状态
 */
export function resolveThemeMode(mode: ThemeModeEnum): boolean {
  if (mode === ThemeModeEnum.AUTO) {
    return getSystemTheme()
  }
  return mode === ThemeModeEnum.DARK
}

/**
 * 应用主题模式到 DOM
 */
export function applyThemeMode(isDark: boolean): void {
  const html = document.documentElement
  html.classList.remove('dark', 'light')
  html.classList.add(isDark ? 'dark' : 'light')
}

/**
 * 生成颜色变体
 */
function generateColorVariants(color: string, isDark: boolean): Record<string, string> {
  const variants: Record<string, string> = {}
  setLightColor(variants, color, isDark)
  setDarkColor(variants, color)
  return variants
}

const setLightColor = (variants: Record<string, string>, color: string, isDark: boolean) => {
  const mixColor = isDark ? '#000000' : '#ffffff'
  for (let i = 1; i <= 9; i++) {
    variants[`light-${i}`] = tinycolor.mix(color, mixColor, i * 10).toHexString()
  }
}

const setDarkColor = (variants: Record<string, string>, color: string) => {
  for (let i = 1; i <= 9; i++) {
    variants[`dark-${i}`] = tinycolor.mix(color, '#000000', i * 10).toHexString()
  }
}

/**
 * 应用单个颜色及其变体到 CSS 变量
 */
export const applyColor = (colorType: ColorType, color: string, isDark: boolean) => {
  const root = document.documentElement.style
  root.setProperty(`--el-color-${colorType}`, color)
  const variants = generateColorVariants(color, isDark)
  Object.entries(variants).forEach(([key, value]) => {
    root.setProperty(`--el-color-${colorType}-${key}`, value)
  })
}

/**
 * 批量应用所有颜色
 */
export function applyAllColors(colors: ThemeColors, isDark: boolean): void {
  Object.entries(colors).forEach(([type, color]) => {
    applyColor(type as ColorType, color, isDark)
  })
}

/**
 * 监听系统主题变化
 */
export function watchSystemTheme(callback: (isDark: boolean) => void): () => void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = (e: MediaQueryListEvent) => callback(e.matches)

  mediaQuery.addEventListener('change', handler)

  return () => mediaQuery.removeEventListener('change', handler)
}
