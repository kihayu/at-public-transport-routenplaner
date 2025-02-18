import { vMaska } from 'maska/vue'
import type { App } from 'vue'

export default {
  install: (app: App) => {
    app.directive('maska', vMaska)
  }
}
