import Vue from 'vue'
import Router from 'vue-router'
import Home from './layer/Home.vue'
import NProgress from 'nprogress'
import NotFound from './views/errorPages/NotFound.vue'
import NetworkIssue from './views/errorPages/NetworkIssue.vue'
import FeaturePage from "./views/featureManager/FeaturePage.vue"
import PersonasPage from "./views/Persona/PersonasPage.vue"
import CustomFields from "./views/Persona/CustomFields.vue"
import Playground from "./views/playground/Playground.vue"

Vue.use(Router)

const router= new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/playground',
      name: 'playground',
      component: Playground
    },
    {
      path: '/feature',
      name: 'feature',
      component: FeaturePage,
    },
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
    {
      path: '/404',
      name: '404',
      component: NotFound,
      props:true
    },
    {
      path: '/network-issue',
      name: 'network-issue',
      component: NetworkIssue,
      props:true
    },
    //Route for all navigation that doesn exist
    {
      path: '*',
      redirect:{name:'404',params: { resource: 'page' }}
    }
  ]
})

router.beforeEach((routeTo, routeFrom, next) => {
  // Start the route progress bar.
  NProgress.start()
  next()
})
router.afterEach(() => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})

export default router
