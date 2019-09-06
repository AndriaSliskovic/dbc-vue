import portalService from '../../services/portalService'
import personaService from '../../services/personaService'
import { reject } from 'q';

export const namespaced = true

const companiesHardCoded={
    SiteCustomersList: [
      {
        CompanyGuid: '74451a04-888f-4fe4-b1ac-c268930b97d6',
        CompanyId: 712,
        CompanyName: 'Academy of Learning',
        IsDirectCompany: 1
      },
      {"CompanyGuid":"c75b90a4-cfa1-423e-8d3b-65a3cf7be720","CompanyId":1346,"CompanyName":"adsads","IsDirectCompany":1},{"CompanyGuid":"beb815e8-5495-46ed-9882-78bad353af53","CompanyId":1341,"CompanyName":"asdasd","IsDirectCompany":1},{"CompanyGuid":"5935f4ab-069e-4774-8af8-1a2eb9400ca4","CompanyId":1347,"CompanyName":"asdasddas","IsDirectCompany":1},{"CompanyGuid":"ba5f6bcf-ed8b-4900-b3c0-ab7fff64180b","CompanyId":1340,"CompanyName":"asdsad","IsDirectCompany":1},{"CompanyGuid":"0ceb29f3-4dc5-48c3-9f57-1090bc12ecbf","CompanyId":727,"CompanyName":"Big Smoke Burger","IsDirectCompany":1}
    ]
  }

export const state = {
  companies: [],
  selectedCompanyGuid: null,
  personas: []
}
export const mutations = {
  LOAD_PORTALS(state, payload) {
    state.companies = payload
  },
  GET_PERSONAS_BY_COMPANY(state,payload){
      state.personas = payload
  },
  CLEAR_PERSONA(state){
    state.personas=null
  }
}
export const actions = {
  loadPortals({ commit, dispatch }) {
    return portalService
      .getAllActivePortals()
      .then(response => {
        commit('LOAD_PORTALS', response.data)
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: `Error loading companies, please contact administrator.`
        }
        dispatch('notification/add', notification, { root: true })
      })
  },
    loadHardCodedCompanies({commit}){
        commit('LOAD_PORTALS',companiesHardCoded)
    },
    getPersonaData(companyGuidString){
      return  personaService.getPersonas(companyGuidString)
    },    
    getPersonasByCompanyGuid({ commit, dispatch }, companyGuidString) {
        personaService.getPersonas(companyGuidString).then((response) => { 
          commit('GET_PERSONAS_BY_COMPANY', response)     
        });
    },
}


export const getters = {}
