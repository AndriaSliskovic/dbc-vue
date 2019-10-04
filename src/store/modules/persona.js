import portalService from '../../services/portalService'
import personaService from '../../services/personaService'


export const namespaced = true

const companiesHardCoded={
    SiteCustomersList: [
      {
        "CompanyGuid": '74451a04-888f-4fe4-b1ac-c268930b97d6',
        "CompanyId": 712,
        "CompanyName": 'Academy of Learning',
        "IsDirectCompany": 1
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
  //COMPANY
  LOAD_PORTALS(state, payload) {
    state.companies = payload
  },
  COMPANY_GUID(state,payload){
    state.companyGuid=payload
  },
  SET_COMPANY_ID(state,payload){
    state.selectedCompanyGuid=payload
  },
  //PERSONA
  //
  GET_PERSONAS_BY_COMPANY(state,payload){
    state.personas = payload
  },
  CREATE_PERSONA(state,payload){
    console.log(`mutator create persona ${payload}`)
  },
  DELETE_PERSONA(state,payload){
    console.log(`mutator delete ${payload}`)
    const newArray=state.personas.filter(
      el=>el.id !==payload
    )
    state.personas=newArray
    console.log(`mutator delete ${newArray}`)
  },
  EDIT_PERSONA_DATA(state,editedObject){
    state.personaObject.name=editedObject.name
    state.personaObject.companyId=editedObject.companyId
    //Editovanje persone u nizu
    const personaId=editedObject.id
    const object=state.personas.filter(el=>el.id===personaId).map(e=>{e.name=editedObject.name})
    console.log(object)
  },
  CLEAR_PERSONA(state){
    state.personas=null
  },
  GET_PERSONA_OBJECT(state,payload){
    //console.log('mutator persona object',payload)
    state.personaObject=payload
  },
  PERSONA_GUID(state,payload){
    state.personaGuid=payload
  },

  //STATUS PERSONA
  SET_PERSONAS_STATUS(state,payload){
    console.log(payload.active)
    state.personaObject=payload
  },
  SELECTED_PERSONAS_STATUS(state,payload){
    console.log(payload)
    state.personas=payload
  },
//CUSTOM FIELDS
GET_CUSTOM_CUSTOM_FIELDS(state,payload){
  state.customFields=payload
},
  SET_SELECTED_CUSTOM_FIELD(state,payload){
    state.selectedCustomField=payload
  },




  //DATA SOURCE ITEMS
  ADD_PERSONA_DATASOURCE_ITEM(state,payload){
    if (!state.selectedCustomField.dataSource) {
      console.log(`kreiraj niz`)
      state.selectedCustomField.dataSource=[]
    }
     state.selectedCustomField.dataSource.push(payload)
    console.log(`mutator za dataObject ${payload}`)
    //state.selectedCustomField.dataSource={...state.selectedCustomField.dataSource,dataSource:{display:payload,id:5}}
  },
  REMOVE_PERSONA_DATASOURCE_ITEM(state,payload){
    //console.log(`mutator remove ${payload}`)
    const filteredArray=state.selectedCustomField.dataSource.filter(
      (el)=>el.id!=payload
    )
    //console.log(fileredArray)
    state.selectedCustomField.dataSource=filteredArray
  }
}
export const actions = {
  //COMPNIES
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
    //PERSONAS
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
    createNewPersona({commit,dispatch},dataObject){
      //console.log(`kreirana persona ${dataObject}`,dataObject)
      personaService.createNewPersona(dataObject)
      .then(commit("CREATE_PERSONA",dataObject))
      .then(          
        ()=>{
        const notification={
          type:'success',
          message:`Persona successfully created !`
        }
        //Dobijanje poruke
        dispatch('notification/add',notification,{root:true})
      })
      .catch(error=>{
        const notification={
          type:'error',
          message:`Can not create new persona - server error, please contact administrator.`
        }
        console.log(notification,error)
        dispatch('notification/add',notification,{root:true})
      })
    },


    deletePersona({commit,dispatch},personaId){
      console.log(`delete persona stringId : ${personaId}`)

      personaService.deleteSelectedPersona(personaId)
      .then(commit("DELETE_PERSONA",personaId))
      .then(          
        ()=>{
        const notification={
          type:'success',
          message:`Persona successfully deleted !`
        }
        //Dobijanje poruke
        dispatch('notification/add',notification,{root:true})
      })
      .catch(error=>{
        const notification={
          type:'error',
          message:`Can not delete selected persona - server error, please contact administrator.`
        }
        dispatch('notification/add',notification,{root:true})
      })
    },
    //PERSONA STATUS
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
    onSelectedPersonasStatus({commit},persona){
      console.log(persona)
      commit('SELECTED_PERSONAS_STATUS',persona)
    },
    //CUSTOM FIELDS
    setSelectedCustomField({commit},selectedCustomField){
      commit('SET_SELECTED_CUSTOM_FIELD',selectedCustomField)
    },
    addPersonaDataSourceItem({commit},item){
      console.log(`action dodavanja persona data sourca ${item}`)
      commit('ADD_PERSONA_DATASOURCE_ITEM',item)
    },
    removePersonaDataSourceItem({commit},id){
      console.log(`action brisanja persona data sourca ${id}`)
      commit('REMOVE_PERSONA_DATASOURCE_ITEM',id)
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
              .then(
                ()=>{
                  const notification={
              type:'success',
              message:`Data successfully changed !`
            }
            dispatch('notification/add',notification,{root:true})
            commit('EDIT_PERSONA_DATA',editedObject)
            dispatch('notification/reloadPage',{},{root:true})
                }


              )
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
    

}


export const getters = {}
