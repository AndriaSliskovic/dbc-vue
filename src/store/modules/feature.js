import portalService from '../../services/portalService'
import featureManagerService from './../../services/featureManagerService'


export const namespaced = true

const companiesHardCoded = {
  SiteCustomersList: [
    {
      CompanyGuid: '74451a04-888f-4fe4-b1ac-c268930b97d6',
      CompanyId: 712,
      CompanyName: 'Academy of Learning',
      IsDirectCompany: 1
    },
    {
      CompanyGuid: '9ccadb7b-9ea2-4934-ac0b-decb508609c7',
      CompanyId: 238,
      CompanyName: 'Standard demo',
      IsDirectCompany: 1
    },
    {
      CompanyGuid: 'c75b90a4-cfa1-423e-8d3b-65a3cf7be720',
      CompanyId: 1346,
      CompanyName: 'adsads',
      IsDirectCompany: 1
    },
    {
      CompanyGuid: 'beb815e8-5495-46ed-9882-78bad353af53',
      CompanyId: 1341,
      CompanyName: 'asdasd',
      IsDirectCompany: 1
    },
    {
      CompanyGuid: '5935f4ab-069e-4774-8af8-1a2eb9400ca4',
      CompanyId: 1347,
      CompanyName: 'asdasddas',
      IsDirectCompany: 1
    },
    {
      CompanyGuid: 'ba5f6bcf-ed8b-4900-b3c0-ab7fff64180b',
      CompanyId: 1340,
      CompanyName: 'asdsad',
      IsDirectCompany: 1
    },
    {
      CompanyGuid: '0ceb29f3-4dc5-48c3-9f57-1090bc12ecbf',
      CompanyId: 727,
      CompanyName: 'Big Smoke Burger',
      IsDirectCompany: 1
    }
  ]
}

export const state = {
  companies: {},
  selectedCompanyGuid:null,
  groups:[],
  dataObject:{},
  initialModules:null,
  selectedModules:null

}
export const mutations = {
  LOAD_PORTALS(state, payload) {
    state.companies = payload
  },
  LOAD_ALL_MODULES(state, payload){
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
  loadPortals({ commit,dispatch }) {
    return portalService.getAllActivePortals()
      .then(response => {
        commit('LOAD_PORTALS', response.data)
      })
      .catch(error => {
        const notification={
          type:'error',
          message:`Error loading companies, please contact administrator.`
        }
        dispatch('notification/add',notification,{root:true})
      })
  },

  LoadAllModules({ commit,dispatch }){
    return featureManagerService.getAllFeatures()
    .then(response=>{
      commit('LOAD_ALL_MODULES',response.data)
    })
    .catch(error => {
      const notification={
        type:'error',
        message:`Error loading initial features, please contact administrator.`
      }
      dispatch('notification/add',notification,{root:true})
    })
  },
  loadHardCodedCompanies({ commit }) {
    commit('LOAD_PORTALS', companiesHardCoded)
  },

  getSelectedModules({commit,dispatch}, compGuid){
     return featureManagerService.getSubscribedFeatures(compGuid)
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
  getCompanyGroups({commit,dispatch},companyId){
    return portalService.getPortalUserGroups(companyId)
   .then(response=>{
     var items = response.data.map(ug =>  {
        return {
          id : ug.Id,
          name : ug.Name,
          guid : ug.Guid
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
    console.log(modules)
    commit('SELECTED_MODULES',modules)
  },
  cleanModules({commit}){
    commit('CLEAN_MODULES')
  },
  submitForm({commit,dispatch},object){
    commit('SEND_DATA',object)
    return featureManagerService.updateFeatures(object)
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