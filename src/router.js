import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import NProgress from 'nprogress'
import NotFound from './views/errorPages/NotFound.vue'
import NetworkIssue from './views/errorPages/NetworkIssue.vue'
import FeaturePage from "./views/featureManager/FeaturePage.vue"

Vue.use(Router)

const router= new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/feature',
      name: 'feature',
      component: FeaturePage,
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
