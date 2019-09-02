import EventService from '../../services/EventService'
import dbcServer from '../../services/dbcServer'


export const namespaced = true

export const state = {
  companies: {},
  selectedCompanyGuid:null,
  groups:[],
  dataObject:{},
  initialModules:null,
  selectedModules:null

}
export const mutations = {
  FETCH_COMPANIES(state, payload) {
    state.companies = payload
  },
  FETCH_INITIAL_MODULES(state, payload){
    state.initialModules=payload
  },
  SELECTED_COMPANY_GUID(state,payload){
    state.selectedCompanyGuid = payload
  },
  GET_COMPANY_GROUPS(state,payload){
    state.groups=payload
  },
  SELECTED_MODULES(state,payload){
    state.selectedModules=payload 
  },
  CLEAN_MODULES(state){
    state.selectedModules=null
  },
  SEND_DATA(state,payload){
    state.dataObject=payload
  }
}
export const actions = {
  fetchCompanies({ commit,dispatch }) {
    return dbcServer.getCompanies()
      .then(response => {
        commit('FETCH_COMPANIES', response.data)
      })
      .catch(error => {
        const notification={
          type:'error',
          message:`Error loading companies, please contact administrator.`
        }
        dispatch('notification/add',notification,{root:true})
      })
  },

  fetchInitialModules({ commit,dispatch }){
    return dbcServer.getFeatures()
    .then(response=>{
      commit('FETCH_INITIAL_MODULES',response.data)
    })
    .catch(error => {
      const notification={
        type:'error',
        message:`Error loading initial features, please contact administrator.`
      }
      dispatch('notification/add',notification,{root:true})
    })
  },

  getSelectedModules({commit,dispatch}, compGuid){
     return dbcServer.getSelectedFeatures(compGuid)
    .then(response=>{
      commit('SELECTED_MODULES',response.data)
    })
    .catch(error=>{
      const notification={
        type:'error',
        message:`Error loading features, please contact administrator.`
      }
      dispatch('notification/add',notification,{root:true})
    })
  },
  getCompanyGroups({commit},companyId){
    return dbcServer.getCompanyGroups(companyId)
   .then(response=>{
     var items = response.data.d.map(ug =>  {
        return {
          id : ug.COMP_USERGROUP_ID,
          name : ug.GROUP_NAME,
          guid : ug.GUID
        }
     })
      commit('GET_COMPANY_GROUPS',items)
   })
   .catch(error=>{
    const notification={
      type:'error',
      message:`Error loading company groups, please contact administrator.`
    }
    dispatch('notification/add',notification,{root:true})
   })
 },

  selectedCompanyGuid({commit},companyGuid){
    commit('SELECTED_COMPANY_GUID',companyGuid)
  },
  selectedCompanyObject({commit},company){
    commit('SELECTED_COMPANY_OBJECT',company)
  },
  selectedGroupGuid({commit},group){
    commit('SELECTED_GROUP',group)
  },
  selectedModules({commit},modules){
    commit('SELECTED_MODULES',modules)
  },
  cleanModules({commit}){
    commit('CLEAN_MODULES')
  },
  submitForm({commit,dispatch},object){
    commit('SEND_DATA',object)
    return dbcServer.editFeatures(object)
    .then(
      ()=>{
        const notification={
          type:'success',
          message:`Data successfully changed !`
        }
        dispatch('notification/add',notification,{root:true})
      }).catch(error=>{
        const notification={
          type:'error',
          message:`Failed to send data !`
        }
        dispatch('notification/add',notification,{root:true})
        throw error
      })

  }
}

export const gettes = {

}