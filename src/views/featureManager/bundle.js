import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import FeaturePage from './FeaturePage.vue'
import router from '../../router'
import store from '../../store/store'
import vuetify from '@/plugins/vuetify'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false

//Babelova scripta za automatsko globalno ucitavanje Base komponenti
const requireComponent = require.context(
  '../../components',
  false,
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)

  const componentName = upperFirst(
    camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, '$1'))
  )

  Vue.component(componentName, componentConfig.default || componentConfig)
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(FeaturePage)
}).$mount('#app')
