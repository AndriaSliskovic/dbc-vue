import Vue from 'vue'
import VueRouter from 'vue-router'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import router from '../../router'
import store from '../../store/store'
import vuetify from '@/plugins/vuetify'
import 'nprogress/nprogress.css'
import Vuelidate from 'vuelidate'
import PersonaPage from './PersonaPage.vue';


Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(Vuelidate)

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
store.strict=false
new Vue({
  router,
  store,
  vuetify,
  render: h => h(PersonaPage)
}).$mount('#app')
