import Vue from 'vue'
import Vuex from 'vuex'
import * as feature from '@/store/modules/feature.js'
import * as notification from '@/store/modules/notification.js'
import * as persona from '@/store/modules/persona.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    feature,
    notification,
    persona
  },
  state: {
  },
  mutations: {
  }
})
