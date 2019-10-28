import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import App from './App.vue'
import BaseLayer from './layers/BaseLayer.vue'
import router from './router'
import store from './store/store'
import vuetify from '@/plugins/vuetify'
// import nprogerss from 'nprogress'
import 'nprogress/nprogress.css'
import Vuelidate from 'vuelidate'

//Globalno ucitani osnovni Layer posto on nije komponenta
Vue.component('BaseLayer', BaseLayer)

Vue.config.productionTip = false

//Nacin ubacivanja 3rd party packagea
Vue.use(Vuelidate)

//Babelova scripta za automatsko globalno ucitavanje Base komponenti
const requireComponent = require.context(
  './components',
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
store.strict=false
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
