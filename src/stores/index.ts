import type { App } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const store = createPinia()

store.use(
  createPersistedState({
    key: (id) => `__easy_admin__${id}__`
  })
)

const initStore = (app: App<Element>) => {
  app.use(store)
}

export { store, initStore }
