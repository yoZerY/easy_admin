import { DEFAULT_THEME_COLORS } from '@/constants'
import { LayoutTypeEnum, PageTransitionEnum, TagsViewStyleEnum, ThemeModeEnum } from '@/enums'
import {
  applyAllColors,
  applyColor,
  applyThemeMode,
  resolveThemeMode,
  watchSystemTheme
} from '@/utils/theme'
import { defineStore } from 'pinia'

export interface SettingState {
  isDark: boolean
  themeMode: ThemeModeEnum
  layoutType: LayoutTypeEnum
  pageTransition: PageTransitionEnum
  showTagsView: boolean
  tagsViewStyle: TagsViewStyleEnum
  primaryColor: string
  successColor: string
  warningColor: string
  dangerColor: string
  errorColor: string
  infoColor: string
  menuCollapse: boolean
}

export const useSettingStore = defineStore('setting', {
  state: (): SettingState => {
    return {
      isDark: false,
      themeMode: ThemeModeEnum.LIGHT,
      layoutType: LayoutTypeEnum.VERTICAL,
      pageTransition: PageTransitionEnum.FADE,
      showTagsView: true,
      tagsViewStyle: TagsViewStyleEnum.CHROME,
      primaryColor: DEFAULT_THEME_COLORS.primary,
      successColor: DEFAULT_THEME_COLORS.success,
      warningColor: DEFAULT_THEME_COLORS.warning,
      dangerColor: DEFAULT_THEME_COLORS.danger,
      errorColor: DEFAULT_THEME_COLORS.error,
      infoColor: DEFAULT_THEME_COLORS.info,
      menuCollapse: false
    }
  },
  getters: {
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
    setMenuCollapse() {
      this.menuCollapse = !this.menuCollapse
    },
    //设置布局
    setLayoutType(type: LayoutTypeEnum) {
      this.layoutType = type
    },
    setThemeMode(mode: ThemeModeEnum) {
      this.themeMode = mode
      this.applyTheme()
    },
    setPageTransition(transition: PageTransitionEnum) {
      this.pageTransition = transition
    },
    //设置主颜色
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
    //应用主题
    applyTheme() {
      this.isDark = resolveThemeMode(this.themeMode)
      applyThemeMode(this.isDark)
      applyAllColors(this.colors, this.isDark)
    },
    // 初始化主题
    initTheme() {
      // 如果是 AUTO 模式，监听系统主题变化
      if (this.themeMode === ThemeModeEnum.AUTO) {
        watchSystemTheme((isDark) => {
          this.isDark = isDark
          applyThemeMode(isDark)
          applyAllColors(this.colors, isDark)
        })
      } else {
        this.applyTheme()
      }
    }
  },
  persist: true
})
