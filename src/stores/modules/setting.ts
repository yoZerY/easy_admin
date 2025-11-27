import { defineStore } from 'pinia'
import { DEFAULT_THEME_COLORS } from '@/config/setting'
import { LayoutTypeEnum, ThemeModeEnum, PageTransitionEnum, TagsViewStyleEnum } from '@/enums/theme'
import {
  resolveThemeMode,
  applyThemeMode,
  applyColor,
  applyAllColors,
  watchSystemTheme
} from '@/theme'

export interface ThemeColors {
  primary: string
  success: string
  warning: string
  danger: string
  error: string
  info: string
}

export interface SettingState {
  layoutType: LayoutTypeEnum
  themeMode: ThemeModeEnum
  pageTransition: PageTransitionEnum
  tagsViewStyle: TagsViewStyleEnum
  showTagsView: boolean
  themeColors: ThemeColors
  isDark: boolean
}

export const useSettingStore = defineStore('setting', {
  state: (): SettingState => {
    return {
      layoutType: LayoutTypeEnum.VERTICAL,
      themeMode: ThemeModeEnum.LIGHT,
      pageTransition: PageTransitionEnum.FADE,
      tagsViewStyle: TagsViewStyleEnum.SMART,
      showTagsView: true,
      themeColors: {
        primary: DEFAULT_THEME_COLORS.primary,
        success: DEFAULT_THEME_COLORS.success,
        warning: DEFAULT_THEME_COLORS.warning,
        danger: DEFAULT_THEME_COLORS.danger,
        error: DEFAULT_THEME_COLORS.error,
        info: DEFAULT_THEME_COLORS.info
      },
      isDark: false
    }
  },
  getters: {
    //获取所有颜色
    colors: (state) => state.themeColors
  },
  actions: {
    setLayoutType(type: LayoutTypeEnum) {
      this.layoutType = type
    },
    setPageTransition(transition: PageTransitionEnum) {
      this.pageTransition = transition
    },
    setTagsViewStyle(style: TagsViewStyleEnum) {
      this.tagsViewStyle = style
    },
    setShowTagsView(show: boolean) {
      this.showTagsView = show
    },
    //应用主题
    applyTheme() {
      this.isDark = resolveThemeMode(this.themeMode)
      applyThemeMode(this.isDark)
      applyAllColors(this.colors, this.isDark)
    },
    setThemeMode(mode: ThemeModeEnum) {
      console.log('mode :>> ', mode)
      this.themeMode = mode
      this.applyTheme()
    },
    setPrimaryColor(color: string) {
      this.themeColors.primary = color
      applyColor('primary', color, this.isDark)
    },
    // 设置成功色
    setSuccessColor(color: string) {
      this.themeColors.success = color
      applyColor('success', color, this.isDark)
    },
    // 设置警告色
    setWarningColor(color: string) {
      this.themeColors.warning = color
      applyColor('warning', color, this.isDark)
    },
    // 设置危险色
    setDangerColor(color: string) {
      this.themeColors.danger = color
      applyColor('danger', color, this.isDark)
    },
    // 设置错误色
    setErrorColor(color: string) {
      this.themeColors.error = color
      applyColor('error', color, this.isDark)
    },
    // 设置信息色
    setInfoColor(color: string) {
      this.themeColors.info = color
      applyColor('info', color, this.isDark)
    },
    // 初始化主题
    initTheme() {
      this.applyTheme()

      // 如果是 AUTO 模式，监听系统主题变化
      if (this.themeMode === ThemeModeEnum.AUTO) {
        watchSystemTheme((isDark) => {
          this.isDark = isDark
          applyThemeMode(isDark)
          applyAllColors(this.colors, isDark)
        })
      }
    }
  },
  persist: {
    storage: localStorage
  }
})
