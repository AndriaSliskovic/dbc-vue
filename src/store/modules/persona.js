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
  customFields:[],
  selectedCustomField:null
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
  SET_COMPANY_ID(state,payload){
    state.selectedCompanyGuid=payload
  },
  GET_PERSONAS_BY_COMPANY(state,payload){
    state.personas = payload
  },
  SET_PERSONAS_STATUS(state,payload){
    console.log(payload.active)
    state.personaObject=payload
  },
  SET_SELECTED_CUSTOM_FIELD(state,payload){
    state.selectedCustomField=payload
  },
  GET_PERSONA_OBJECT(state,payload){
    //console.log('mutator persona object',payload)
    state.personaObject=payload
  },
  EDIT_PERSONA_DATA(state,editedObject){
    state.personaObject.name=editedObject.name
    state.personaObject.companyId=editedObject.companyId
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
  },

  ADD_PERSONA_DATASOURCE_ITEM(state,payload){
     state.selectedCustomField.dataSource.push(payload)
    console.log(`mutator za dataObject ${payload}`)
    //state.selectedCustomField.dataSource={...state.selectedCustomField.dataSource,dataSource:{display:payload,id:5}}
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
    setCompanyId({commit},companyId){
      commit('SET_COMPANY_ID',companyId)
    } ,
    getPersonasByCompanyGuid({ commit,dispatch}, companyGuidString) {
        console.log(`action za kompanijine persone ${companyGuidString}`)
        return personaService.getPersonas(companyGuidString)
        .then((response) => { 
          commit('GET_PERSONAS_BY_COMPANY', response)          
        })
        .catch(error => {
          const notification={
            type:'error',
            message:`Error loading personas by selected company, please contact administrator.`
          }
          //console.log(notification,error)
          dispatch('notification/add',notification,{root:true})
        })
        

    },

    setPersonasStatusOnServer({commit,dispatch},element){
      console.log(element.stringId,element.active)
      const status=element.active
      const personaUrlString=element.stringId
      //Aktivacija statusa
      if (status) {
        console.log("aktivira",personaUrlString,status)
        personaService.activateStatusById(personaUrlString)
        .then(
          ()=>{
            const notification={
              type:'success',
              message:`Data successfully changed !`
            }
            //Dobijanje poruke
            dispatch('notification/add',notification,{root:true})
            //Setovanje statea
            dispatch('setPersonasStatus', element)
          }).catch(error=>{
            const notification={
              type:'error',
              message:` Can't activate this persona - Server error !`
            }
            dispatch('notification/add',notification,{root:true})
            throw error
          })
      }else{
        console.log('deaktivira',personaUrlString)
        personaService.deactivateStatusById(personaUrlString)
        .then(
          ()=>{
            const notification={
              type:'success',
              message:`Data successfully changed !`
            }
            dispatch('notification/add',notification,{root:true})
            //Setuje status
            dispatch('setPersonasStatus', element)
          }).catch(error=>{
            const notification={
              type:'error',
              message:`Can't deactivate Persona. It is in use by CustomFields or PersonaInstances !`
            }
            dispatch('notification/add',notification,{root:true})
            throw error
          })
      }
    },
    setPersonasStatus({commit},element){
      console.log('action set status',element)
      commit('SET_PERSONAS_STATUS',element)
    },
    setSelectedCustomField({commit},selectedCustomField){
      commit('SET_SELECTED_CUSTOM_FIELD',selectedCustomField)
    },
    addNewPersona({commit},item){
      console.log(`action dodavanja persone `)
    },
    addPersonaDataSourceItem({commit},item){
      console.log(`action dodavanja persona data sourca ${item}`)
      commit('ADD_PERSONA_DATASOURCE_ITEM',item)
    },
    onSelectedPersonasStatus({commit},persona){
      console.log(persona)
      commit('SELECTED_PERSONAS_STATUS',persona)
    },
    getSelectedPersonaByPersonaId({commit,dispatch},personaId){
      console.log(`action persona objekta ${personaId}`)
      return personaService.getSelectedPersonaByPersonaId(personaId)
              .then(response=>commit('GET_PERSONA_OBJECT',response.data))
              .catch(error=>{
                const notification={
                  type:'error',
                  message:`Error loading persona object by selected persona, please contact administrator.`
                }
                console.log(notification,error)
                dispatch('notification/add',notification,{root:true})
              })
    },
    getCustomFieldsByPersonaID({commit,dispatch},personaId){
      console.log(`action CustomFields ${personaId}`)
      return personaService.getCustomFieldsByPersonaID(personaId)
              .then(response=>commit('GET_CUSTOM_CUSTOM_FIELDS',response.data))
              .catch(error=>{
                const notification={
                  type:'error',
                  message:`Error loading custom fields by selected persona, please contact administrator.`
                }
                console.log(notification,error)
                dispatch('notification/add',notification,{root:true})
              })
    },
    editPersonaData({commit,dispatch},editedObject){
      console.log(`action edit persone ${editedObject}`)
      return personaService.editPersonaData(editedObject)
              .then(response=>console.log(response))
              //treba setovati u centralni store
              .catch(error=>{
                const notification={
                  type:'error',
                  message:`Error loading custom fields by selected persona, please contact administrator.`
                }
                console.log(notification,error)
                dispatch('notification/add',notification,{root:true})
              })
    },
    getSelectedCustomField({commit},cFieldId){
      console.log(`action customFielda ${cFieldId}`)
    },
    createNewPersona({commit,dispatch},dataObject){
      //console.log(`kreirana persona ${dataObject}`,dataObject)
      return personaService.createNewPersona(dataObject)
      .then(response=>console.log(`kreirana persona ${dataObject}`,dataObject))
      .catch(error=>{
        const notification={
          type:'error',
          message:`Can not create new persona - server error, please contact administrator.`
        }
        console.log(notification,error)
        dispatch('notification/add',notification,{root:true})
      })
    }

}


export const getters = {}
