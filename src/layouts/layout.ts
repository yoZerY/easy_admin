import type { Component } from 'vue'
import VerticalLayout from './VerticalLayout/index.vue'
import HorizontalLayout from './HorizontalLayout/index.vue'
import MixedLayout from './MixedLayout/index.vue'
import ColumnsLayout from './ColumnsLayout/index.vue'
import { LayoutTypeEnum } from '@/enums'

export interface LayoutConfig {
  type: LayoutTypeEnum
  name: string
  icon: string
  component: Component
}

export const LAYOUTS: LayoutConfig[] = [
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
