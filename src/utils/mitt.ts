import mitt from 'mitt'
import type { Emitter } from 'mitt'

/** 全局公共事件需要在此处添加类型 */
type Events = {
  openSettingPanel: void
}

export const emitter: Emitter<Events> = mitt<Events>()
