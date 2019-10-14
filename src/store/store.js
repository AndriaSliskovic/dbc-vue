import Vue from 'vue'
import Vuex from 'vuex'
import * as feature from '@/store/modules/feature.js'
import * as notification from '@/store/modules/notification.js'
import * as persona from '@/store/modules/persona.js'
import * as companies from '@/store/modules/companies.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    feature,
    notification,
    persona,
    companies
  },
  state: {
  },
  mutations: {
  }
})
