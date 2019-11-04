import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import PersonasPage from "./PersonasPage.vue"
import CustomFields from "./CustomFields.vue"

Vue.use(Router)

const router= new Router({
  routes: [
    {
      path: '/personas',
      name: 'personas',
      component: PersonasPage,
    },
    {
      path:'/persona/:personaId',
      name:'customFields',
      component:CustomFields
    },
  ]
})

router.beforeEach((routeTo, routeFrom, next) => {
  NProgress.start()
  next()
})
router.afterEach(() => {
  NProgress.done()
})

export default router
