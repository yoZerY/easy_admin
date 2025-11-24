import type { Component } from 'vue'
import { LayoutTypeEnum } from '@/enums/theme'
import VerticalLayout from '../layouts/VerticalLayout.vue'
import HorizontalLayout from '../layouts/HorizontalLayout.vue'
import MixedLayout from '../layouts/MixedLayout.vue'
import ColumnsLayout from '../layouts/ColumnsLayout.vue'

export interface LayoutConfig {
  type: LayoutTypeEnum
  name: string
  icon: string
  component: Component
}

export const LAYOUT_CONFIGS: LayoutConfig[] = [
  {
    type: LayoutTypeEnum.VERTICAL,
    name: '垂直布局',
    icon: 'Menu',
    component: VerticalLayout
  },
  {
    type: LayoutTypeEnum.HORIZONTAL,
    name: '水平布局',
    icon: 'Grid',
    component: HorizontalLayout
  },
  {
    type: LayoutTypeEnum.MIXED,
    name: '混合布局',
    icon: 'Operation',
    component: MixedLayout
  },
  {
    type: LayoutTypeEnum.COLUMNS,
    name: '双列布局',
    icon: 'Tickets',
    component: ColumnsLayout
  }
]
