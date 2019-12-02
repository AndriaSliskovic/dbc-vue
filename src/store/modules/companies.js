import companyService from '../../services/companyService'

export const namespaced = true

export const state = {
  allCompanies: [],
  selectedCompanyGUID: null,
  companyIdString:null
}
export const mutations = {
  LOAD_COMPANIES(state, payload) {
    state.allCompanies = payload
  },
  SET_COMPANY_ID(state, payload) {
    state.selectedCompanyGUID = payload
  },
  SET_COMPANY_ID_STRING(state,payload){
    state.companyIdString=`companyId=${payload}`
  },
}
export const actions = {
  loadAllCompanies({ commit, dispatch }) {
    return companyService
      .getAllCompanies()
      .then(response => {
        commit('LOAD_COMPANIES', response.data)
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: `Error loading companies, please contact administrator.`
        }
        dispatch('notification/add', notification, { root: true })
      })
  },
  setCompanyId({ commit }, companyId) {
    commit('SET_COMPANY_ID', companyId)
    commit('SET_COMPANY_ID_STRING',companyId)
  }
}
export const getters = {}
