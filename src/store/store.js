import Vue from 'vue'
import Vuex from 'vuex'
import * as feature from '@/store/modules/feature.js'
import * as notification from '@/store/modules/notification.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    feature,
    notification
  },
  state: {
  },
  mutations: {
  }
})
