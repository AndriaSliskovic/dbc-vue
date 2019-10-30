import portalService from '../../services/portalService'
import personaService from '../../services/personaService'
import { stat } from 'fs'

export const namespaced = true

export const state = {
  personas: [],
  personaObject: null,
  customFields: [],
  selectedCustomField: null,
  masks:[],
  categories:[]
}
export const mutations = {
  //PERSONA
  GET_PERSONAS_BY_COMPANY(state, payload) {
    state.personas = payload
  },
  DELETE_PERSONA(state, payload) {
    const newArray = state.personas.filter(el => el.id !== payload.id)
    state.personas = newArray
  },
  EDIT_PERSONA_DATA(state, payload) {
    state.personaObject.name = payload.name
    state.personaObject.companyId = payload.companyId
    //Editovanje persone u nizu
    state.personas
      .filter(el => el.id === payload.personaId)
      .map(e => {
        (e.name = payload.name), (e.companyId = payload.companyId)
      })
  },
  GET_PERSONA_OBJECT(state, payload) {
    state.personaObject = payload
  },
  PERSONA_GUID(state, payload) {
    state.personaGuid = payload
  },

  //STATUS PERSONA
  SET_PERSONAS_STATUS(state, payload) {
    state.personaObject = payload
    state.personas.map(el=>el.id===payload.id?el.active=payload.active:el)

  },
  SELECTED_PERSONAS_STATUS(state, payload) {
    state.personas = payload
  },

  //CUSTOM FIELDS
  GET_CUSTOM_FIELDS(state, payload) {
    state.customFields = payload
  },
  SET_SELECTED_CUSTOM_FIELD(state, payload) {
    state.selectedCustomField = payload
  },
  ADD_CUSTOM_FIELD_TO_ARRAY(state,payload){
    [...state.customFields,payload]
  },
  UPDATE_CUSTOM_FIELD(state, payload){
    const newArray= state.customFields.map(el=>el.id===payload.id?el=payload:el)
    state.customFields=newArray

  },
  DELETE_CUSTOM_FIELD(state, payload) {
    const newArray = state.customFields.filter(el => el.id !== payload)
    state.customFields = newArray
  },
  //CATEGORY
  CREATE_CATEGORY_ARRAY(state){
    const catItems=state.customFields.map(e=>e.category)
    const filteredCategories = [...new Set(catItems)]
    state.categories=filteredCategories
  },

  ADD_NEW_CATEGORY(state,payload){
    state.categories.push(payload)
  },

  //DATA SOURCE ITEMS
  ADD_PERSONA_DATASOURCE_ITEM(state, payload) {
    if (!state.selectedCustomField.dataSource) {
      state.selectedCustomField.dataSource = []
    }
    state.selectedCustomField.dataSource.push(payload)
  },
  REMOVE_PERSONA_DATASOURCE_ITEM(state, payload) {
    const filteredArray = state.selectedCustomField.dataSource.filter(
      el => el.id != payload
    )
    state.selectedCustomField.dataSource = filteredArray
  },
  GET_MASKS(state,payload){
    state.masks=payload
  },

  
}
export const actions = {
  //PERSONAS
  getPersonasByCompanyGuid({ commit, dispatch }, companyGuidString) {
    return personaService
      .getPersonas(companyGuidString)
      .then(response => {
        commit('GET_PERSONAS_BY_COMPANY', response)
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: `Error loading personas by selected company, please contact administrator.`
        }
        dispatch('notification/add', notification, { root: true })
      })
  },
  
  createNewPersona({ commit, dispatch }, dataObject) {
    //Ne setuje u centralni state zato sto nema persona id
    //commit('CREATE_NEW_PERSONA', dataObject)
    personaService.createNewPersona(dataObject)
      .then(() => {
        const notification = {
          type: 'success',
          message: `Persona successfully created !`
        }
        //Add to central store
        dispatch('getPersonasByCompanyGuid',dataObject.companyIdString)
        //Success mesage
        dispatch('notification/add', notification, { root: true })
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: `Can not create new persona - server error, please contact administrator.`
        }
        dispatch('notification/add', notification, { root: true })
        dispatch('getPersonasByCompanyGuid',dataObject.companyIdString)
      })
  },

  deletePersona({ commit, dispatch }, persona) {
    personaService
      .deleteSelectedPersona(persona.stringId)
      .then(commit('DELETE_PERSONA', persona))
      .then(() => {
        const notification = {
          type: 'success',
          message: `Persona successfully deleted !`
        }
        //Dobijanje poruke
        dispatch('notification/add', notification, { root: true })
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: `Can not delete selected persona - server error, please contact administrator.`
        }
        dispatch('notification/add', notification, { root: true })
        dispatch( 'getPersonasByCompanyGuid',persona.companyIdString)
      })
  },
  //PERSONA STATUS
  setPersonasStatusOnServer({ commit, dispatch }, element) {
    const status = element.active
    const personaUrlString = element.stringId
    //Aktivacija statusa
    if (status) {
      personaService
        .activateStatusById(personaUrlString)
        .then(() => {
          const notification = {
            type: 'success',
            message: `Data successfully changed !`
          }
          //Dobijanje poruke
          dispatch('notification/add', notification, { root: true })
          //Setting status
          dispatch('setPersonasStatus', element)
        })
        .catch(error => {
          const notification = {
            type: 'error',
            message: ` Can't activate this persona - Server error !`
          }
          dispatch('notification/add', notification, { root: true })
          throw error
        })
    } else {
      personaService
        .deactivateStatusById(personaUrlString)
        .then(() => {
          const notification = {
            type: 'success',
            message: `Data successfully changed !`
          }
          dispatch('notification/add', notification, { root: true })
          //Setting status
          dispatch('setPersonasStatus', element)
        })
        .catch(error => {
          const notification = {
            type: 'error',
            message: `Can't deactivate Persona. It is in use by CustomFields or PersonaInstances !`
          }
          dispatch('notification/add', notification, { root: true })
          dispatch('getPersonasByCompanyGuid',element.companyIdString)
          throw error
        })
    }
  },
  setPersonasStatus({ commit }, element) {
    commit('SET_PERSONAS_STATUS', element)
  },
  onSelectedPersonasStatus({ commit }, persona) {
    commit('SELECTED_PERSONAS_STATUS', persona)
  },
  addPersonaDataSourceItem({ commit }, item) {
    commit('ADD_PERSONA_DATASOURCE_ITEM', item)
  },
  removePersonaDataSourceItem({ commit }, id) {
    commit('REMOVE_PERSONA_DATASOURCE_ITEM', id)
  },

  getSelectedPersonaByPersonaId({ commit, dispatch }, personaId) {
    return personaService
      .getSelectedPersonaByPersonaId(personaId)
      .then(response => commit('GET_PERSONA_OBJECT', response.data))
      .catch(error => {
        const notification = {
          type: 'error',
          message: `Error loading persona object by selected persona, please contact administrator.`
        }
        dispatch('notification/add', notification, { root: true })
      })
  },
 
  editPersonaData({ commit, dispatch }, editedObject) {
    return personaService
      .editPersonaData(editedObject)
      .then(() => {
        const notification = {
          type: 'success',
          message: `Data successfully changed !`
        }
        dispatch('notification/add', notification, { root: true })
        commit('EDIT_PERSONA_DATA', editedObject)
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: `Error editing custom fields by selected persona, please contact administrator.`
        }
        dispatch('notification/add', notification, { root: true })
      })
  },
    setSelectedCustomField({ commit }, selectedCustomField) {
    commit('SET_SELECTED_CUSTOM_FIELD', selectedCustomField)
  },
  //CATEGORIES
  getAllCategoriesForSelectedPersona({commit}){
    commit('CREATE_CATEGORY_ARRAY')
  },
  addNewCategory({commit},newCategory){
    commit('ADD_NEW_CATEGORY',newCategory)
  },
  //CUSTOM FIELDS
  getSelectedCustomField({ commit, dispatch }, cFieldId) {
  },
  createNewCustomField({ commit, dispatch }, cField) {
    //Ne treba mutator jer se svi podaci nalaze u store.selectedCustomField
    return personaService
      .createNewCustomField(cField)
      .then(() => {
        const notification = {
          type: 'success',
          message: `New custom fields successfully added for selected persona!`
        }
        dispatch('notification/add', notification, { root: true })
        commit('ADD_CUSTOM_FIELD_TO_ARRAY',cField)
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: `Error creating new custom fields by selected persona, please contact administrator.`
        }
        dispatch('notification/add', notification, { root: true })
      })
      .then(()=>
        dispatch('getCustomFieldsByPersonaID', state.personaObject.id) 
      )
 
  },
  setSelectedCustomField({ commit }, selectedCustomField) {
    commit('SET_SELECTED_CUSTOM_FIELD', selectedCustomField)
  },
  getCustomFieldsByPersonaID({ commit, dispatch }, personaId) {
    return personaService
      .getCustomFieldsByPersonaID(personaId)
      .then(response => commit('GET_CUSTOM_FIELDS', response.data))
      .catch(error => {
        const notification = {
          type: 'error',
          message: `Error loading custom fields by selected persona, please contact administrator.`
        }
        dispatch('notification/add', notification, { root: true })
      })
  },
  updateCustomField({ commit, dispatch }, cField) {
    commit('UPDATE_CUSTOM_FIELD',cField)
    return personaService.updateCustomField(cField)
      .then(() => {
        const notification = {
          type: 'success',
          message: `Custom field successfully updated for selected persona!`
        }
        dispatch('notification/add', notification, { root: true })
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: error
        }
        dispatch('notification/add', notification, { root: true })
      })
      .then(
        ()=>commit('UPDATE_CUSTOM_FIELD',cField)
      )
  },
  deleteSelectedCustomField({commit,dispatch},params){
    return personaService.deleteSelectedCustomField(params)
      .then(()=>{
        const notification = {
          type: 'success',
          message: `Custom field successfully deleted for selected persona!`
        }
        dispatch('notification/add', notification, { root: true })
        commit("DELETE_CUSTOM_FIELD",params.cFieldId)
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: error
        }
        dispatch('notification/add', notification, { root: true })
      })
  },
  getMasks({commit}){
      return portalService.getMasks()
      .then(
        response=>commit('GET_MASKS',response.data)       
      )
  }
}

export const getters = {}
