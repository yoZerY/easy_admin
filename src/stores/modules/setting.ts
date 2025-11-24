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

export interface SettingState {
  layoutType: LayoutTypeEnum
  themeMode: ThemeModeEnum
  pageTransition: PageTransitionEnum
  tagsViewStyle: TagsViewStyleEnum
  showTagsView: boolean
  primaryColor: string
  successColor: string
  warningColor: string
  dangerColor: string
  errorColor: string
  infoColor: string
  actualIsDark: boolean
}

export const useSettingStore = defineStore('setting', {
  state: (): SettingState => {
    return {
      layoutType: LayoutTypeEnum.VERTICAL,
      themeMode: ThemeModeEnum.LIGHT,
      pageTransition: PageTransitionEnum.FADE,
      tagsViewStyle: TagsViewStyleEnum.SMART,
      showTagsView: true,
      primaryColor: DEFAULT_THEME_COLORS.primary,
      successColor: DEFAULT_THEME_COLORS.success,
      warningColor: DEFAULT_THEME_COLORS.warning,
      dangerColor: DEFAULT_THEME_COLORS.danger,
      errorColor: DEFAULT_THEME_COLORS.error,
      infoColor: DEFAULT_THEME_COLORS.info,
      actualIsDark: false
    }
  },
  getters: {
    isDark: (state) => state.actualIsDark,
    //获取所有颜色
    colors: (state) => {
      return {
        primary: state.primaryColor,
        success: state.successColor,
        warning: state.warningColor,
        danger: state.dangerColor,
        error: state.errorColor,
        info: state.infoColor
      }
    }
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
      this.actualIsDark = resolveThemeMode(this.themeMode)
      applyThemeMode(this.isDark)
      applyAllColors(this.colors, this.isDark)
    },
    setThemeMode(mode: ThemeModeEnum) {
      console.log('mode :>> ', mode)
      this.themeMode = mode
      this.applyTheme()
    },
    setPrimaryColor(color: string) {
      this.primaryColor = color
      applyColor('primary', color, this.isDark)
    },
    // 设置成功色
    setSuccessColor(color: string) {
      this.successColor = color
      applyColor('success', color, this.isDark)
    },
    // 设置警告色
    setWarningColor(color: string) {
      this.warningColor = color
      applyColor('warning', color, this.isDark)
    },
    // 设置危险色
    setDangerColor(color: string) {
      this.dangerColor = color
      applyColor('danger', color, this.isDark)
    },
    // 设置错误色
    setErrorColor(color: string) {
      this.errorColor = color
      applyColor('error', color, this.isDark)
    },

    // 设置信息色
    setInfoColor(color: string) {
      this.infoColor = color
      applyColor('info', color, this.isDark)
    },
    // 初始化主题
    initTheme() {
      this.applyTheme()

      // 如果是 AUTO 模式，监听系统主题变化
      if (this.themeMode === ThemeModeEnum.AUTO) {
        watchSystemTheme((isDark) => {
          this.actualIsDark = isDark
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
