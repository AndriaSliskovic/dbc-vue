import portalService from '../../services/portalService'
import personaService from '../../services/personaService'


export const namespaced = true

const companiesHardCoded={
    SiteCustomersList: [
      {
        CompanyGuid: '74451a04-888f-4fe4-b1ac-c268930b97d6',
        CompanyId: 712,
        CompanyName: 'Academy of Learning',
        IsDirectCompany: 1
      },
      {"CompanyGuid":"9ccadb7b-9ea2-4934-ac0b-decb508609c7","CompanyId":238,"CompanyName":"Standard demo","IsDirectCompany":1},
      {"CompanyGuid":"c75b90a4-cfa1-423e-8d3b-65a3cf7be720","CompanyId":1346,"CompanyName":"adsads","IsDirectCompany":1},
      {"CompanyGuid":"beb815e8-5495-46ed-9882-78bad353af53","CompanyId":1341,"CompanyName":"asdasd","IsDirectCompany":1},
      {"CompanyGuid":"5935f4ab-069e-4774-8af8-1a2eb9400ca4","CompanyId":1347,"CompanyName":"asdasddas","IsDirectCompany":1},
      {"CompanyGuid":"ba5f6bcf-ed8b-4900-b3c0-ab7fff64180b","CompanyId":1340,"CompanyName":"asdsad","IsDirectCompany":1},
      {"CompanyGuid":"0ceb29f3-4dc5-48c3-9f57-1090bc12ecbf","CompanyId":727,"CompanyName":"Big Smoke Burger","IsDirectCompany":1},

    ]
  }

export const state = {
  companies: [],
  selectedCompanyGuid: null,
  personas: [],
  personaObject:null,
  customFields:[]
}
export const mutations = {
  LOAD_PORTALS(state, payload) {
    state.companies = payload
  },
  COMPANY_GUID(state,payload){

    state.companyGuid=payload
  },
  PERSONA_GUID(state,payload){

    state.personaGuid=payload
  },
  GET_PERSONAS_BY_COMPANY(state,payload){
    state.personas = payload
  },
  GET_PERSONA_OBJECT(state,payload){
    //console.log('mutator persona object',payload)
    state.personaObject=payload
  },
  CLEAR_PERSONA(state){
    state.personas=null
  },
  SELECTED_PERSONAS_STATUS(state,payload){
    console.log(payload)
    state.personas=payload
  },
  GET_PERSONA_OBJECT(state,payload){
    //console.log(`mutator setuje ${payload}`)
    state.personaObject=payload
  },
  GET_CUSTOM_CUSTOM_FIELDS(state,payload){
    state.customFields=payload
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
    getPersonasByCompanyGuid({ commit}, companyGuidString) {
        console.log(`action za kompanijine persone ${companyGuidString}`)
        personaService.getPersonas(companyGuidString).then((response) => { 
          commit('GET_PERSONAS_BY_COMPANY', response)     
        });
    },
    getCompanyIdByPersonaId({commit},personaId){

        personaService.getCompanyIdByPersonaId(personaId)
        .then((response)=>
          commit('COMPANY_GUID',response.data.companyId)       
        )
        .then(
          commit('PERSONA_GUID',personaId) 
        )
    },
    setPersonasStatus({commit},element){
      console.log('action set status',element)
      commit('SET_PERSONAS_STATUS',element)
    },
    onSelectedPersonasStatus({commit},personas){
      console.log(personas)
      commit('SELECTED_PERSONAS_STATUS',personas)
    },
    getCustomFieldsByPersonaID({commit},personaId){
      return personaService.getCustomFieldsByPersonaID(personaId)
              .then(response=>commit('GET_CUSTOM_CUSTOM_FIELDS',response.data))
    },
    getSelectedPersonaByPersonaId({commit},personaId){
      console.log(`action persona objekta ${personaId}`)
      return personaService.getSelectedPersonaByPersonaId(personaId)
              .then(response=>commit('GET_PERSONA_OBJECT',response.data))
    },
    getCustomFieldsByPersonaID({commit},personaId){
      console.log(`action CustomFields ${personaId}`)
      return personaService.getCustomFieldsByPersonaID(personaId)
              .then(response=>commit('GET_CUSTOM_CUSTOM_FIELDS',response.data))
    },
    editPersonaData({commit},editedObject){
      console.log(`action edit persone ${editedObject.personaId}`)
      return personaService.editPersonaData(editedObject)
    },
    getSelectedCustomField({commit},cFieldId){
      console.log(`action customFielda ${cFieldId}`)
    }
}


export const getters = {}
