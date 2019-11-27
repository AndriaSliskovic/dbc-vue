import portalService from '../../services/portalService'
import personaService from '../../services/personaService'
import { stat } from 'fs'

export const namespaced = true

export const state = {
  personas: [],
  personaObject: null,
  customFields: [],
  selectedCustomField: null,
  masks: [],
  categories: []
}
export const mutations = {
  //PERSONA
  GET_PERSONAS_BY_COMPANY(state, payload) {
    console.log("setovanje persona po comp",payload)
    state.personas = payload
  },
  DELETE_PERSONA(state, payload) {
    console.log(`mutator delete ${payload}`)
    const newArray = state.personas.filter(el => el.id !== payload.id)
    state.personas = newArray
    console.log(`mutator delete ${newArray}`, newArray)
  },
  EDIT_PERSONA_DATA(state, payload) {
    console.log(payload)
    //Editovanje persone u nizu
    const editedArray=state.personas.map((e)=>e.id==payload.id?payload:e)
    state.personas=editedArray
  },
  GET_PERSONA_OBJECT(state, payload) {
    //console.log('mutator persona object',payload)
    state.personaObject = payload
  },
  PERSONA_GUID(state, payload) {
    state.personaGuid = payload
  },

  //STATUS PERSONA
  SET_PERSONAS_STATUS(state, payload) {
    console.log('mutator set persona status', payload)
    state.personaObject = payload
    state.personas.map(el =>
      el.id === payload.id ? (el.active = payload.active) : el
    )
  },
  SELECTED_PERSONAS_STATUS(state, payload) {
    console.log(payload)
    state.personas = payload
  },

  //CUSTOM FIELDS
  GET_CUSTOM_FIELDS(state, payload) {
    state.customFields = payload
  },
  SET_SELECTED_CUSTOM_FIELD(state, payload) {
    state.selectedCustomField = payload
  },
  ADD_CUSTOM_FIELD_TO_ARRAY(state, payload) {
    ;[...state.customFields, payload]
  },
  UPDATE_CUSTOM_FIELD(state, payload) {
    console.log('mutator update cf', payload)
    const newArray = state.customFields.map(el =>
      el.id === payload.id ? (el = payload) : el
    )
    state.customFields = newArray
  },
  DELETE_CUSTOM_FIELD(state, payload) {
    console.log(`mutator delete custom field ${payload}`)
    const newArray = state.customFields.filter(el => el.id !== payload)
    state.customFields = newArray
    console.log(`mutator delete ${newArray}`, newArray)
  },
  //CATEGORY
  CREATE_CATEGORY_ARRAY(state) {
    const catItems = state.customFields.map(e => e.category)
    const filteredCategories = [...new Set(catItems)]
    state.categories = filteredCategories
  },

  ADD_NEW_CATEGORY(state, payload) {
    //console.log("mutator",payload)
    // [...state.categories,payload]
    state.categories.push(payload)
  },

  //DATA SOURCE ITEMS
  ADD_PERSONA_DATASOURCE_ITEM(state, payload) {
    if (!state.selectedCustomField.dataSource) {
      console.log(`kreiraj niz`)
      state.selectedCustomField.dataSource = []
    }
    state.selectedCustomField.dataSource.push(payload)
    console.log(`mutator za dataObject ${payload}`)
    //state.selectedCustomField.dataSource={...state.selectedCustomField.dataSource,dataSource:{display:payload,id:5}}
  },
  REMOVE_PERSONA_DATASOURCE_ITEM(state, payload) {
    //console.log(`mutator remove ${payload}`)
    const filteredArray = state.selectedCustomField.dataSource.filter(
      el => el.id != payload
    )
    //console.log(fileredArray)
    state.selectedCustomField.dataSource = filteredArray
  },
  GET_MASKS(state, payload) {
    state.masks = payload
  }
}
export const actions = {
  //PERSONAS
  getPersonasByCompanyGuid({ commit, dispatch }, companyGuidString) {
    console.log(`action za kompanijine persone ${companyGuidString}`)
    
    return personaService
      .getPersonas(companyGuidString)
      .then(response => {
        console.log(
          `action persona po companyId stringu ${companyGuidString}`,
          response
        )
        commit('GET_PERSONAS_BY_COMPANY', response)
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: error
        }
        //console.log(notification,error)
        dispatch('notification/add', notification, { root: true })
      })
  },

  createNewPersona({ commit, dispatch }, dataObject) {
    console.log(`action create persona ${dataObject}`, dataObject)
    //Ne setuje u centralni state zato sto nema persona id
    //commit('CREATE_NEW_PERSONA', dataObject)
    personaService
      .createNewPersona(dataObject)
      .then(() => {
        const notification = {
          type: 'success',
          message: `Persona successfully created !`
        }
        //Add to central store
        dispatch('getPersonasByCompanyGuid', dataObject.companyIdString)
        //Success mesage
        dispatch('notification/add', notification, { root: true })
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: `Can not create new persona - server error, please contact administrator.`
        }
        console.log(notification, error)
        dispatch('notification/add', notification, { root: true })
        dispatch('getPersonasByCompanyGuid', dataObject.companyIdString)
      })
  },

  deletePersona({ commit, dispatch }, persona) {
    console.log(`delete persona stringId : ${persona}`, persona)

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
        dispatch('getPersonasByCompanyGuid', persona.companyIdString)
      })
  },
  getSelectedPersonaByPersonaId({ commit, dispatch }, personaId) {
    console.log(`action persona objekta ${personaId}`)
    return personaService
      .getSelectedPersonaByPersonaId(personaId)
      .then(response => commit('GET_PERSONA_OBJECT', response.data))
      .catch(error => {
        const notification = {
          type: 'error',
          message: `Error loading persona object by selected persona, please contact administrator.`
        }
        console.log(notification, error)
        dispatch('notification/add', notification, { root: true })
      })
  },

  editPersonaData({ commit, dispatch,rootState }, editedObject) {
    console.log(`action edit persone ${editedObject}`,state.personaObject.companyId,rootState.companies.companyIdString)
    return personaService
      .editPersonaData(editedObject)
      .then(() => {
        const notification = {
          type: 'success',
          message: `Data successfully changed !`
        }
        dispatch('notification/add', notification, { root: true })
        commit('EDIT_PERSONA_DATA',editedObject)
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: `Error editing custom fields by selected persona, please contact administrator.`
        }
        console.log(notification, error)
        dispatch('notification/add', notification, { root: true })
      })

  },
    setSelectedCustomField({ commit }, selectedCustomField) {
      commit('SET_SELECTED_CUSTOM_FIELD', selectedCustomField)
    },

  //PERSONA STATUS
  setPersonasStatusOnServer({ commit, dispatch,rootState }, element) {

    console.log(element.stringId, element.active, element)
    const status = element.active
    const personaUrlString = element.stringId
    const companyIdStr=rootState.companies.companyIdString
    console.log(companyIdStr)
    //Aktivacija statusa
    if (status) {
      console.log('aktivira', personaUrlString, status)
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

          //dispatch('getPersonasByCompanyGuid',companyIdStr)
          throw error
        })
    } else {
      console.log('deaktivira', personaUrlString)
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
          dispatch('getPersonasByCompanyGuid', element.companyIdString)
          throw error
        })
    }
  },
  setPersonasStatus({ commit }, element) {
    console.log('action set status', element)
    commit('SET_PERSONAS_STATUS', element)
  },
  onSelectedPersonasStatus({ commit }, persona) {
    console.log(persona)
    commit('SELECTED_PERSONAS_STATUS', persona)
  },
  addPersonaDataSourceItem({ commit }, item) {
    console.log(`action dodavanja persona data sourca ${item}`)
    commit('ADD_PERSONA_DATASOURCE_ITEM', item)
  },
  removePersonaDataSourceItem({ commit }, id) {
    console.log(`action brisanja persona data sourca ${id}`)
    commit('REMOVE_PERSONA_DATASOURCE_ITEM', id)
  },

  //CATEGORIES
  getAllCategoriesForSelectedPersona({ commit }) {
    console.log('pravi niz')
    commit('CREATE_CATEGORY_ARRAY')
  },
  addNewCategory({ commit }, newCategory) {
    console.log(newCategory)
    commit('ADD_NEW_CATEGORY', newCategory)
  },
  //CUSTOM FIELDS
  getSelectedCustomField({ commit, dispatch }, cFieldId) {
    console.log(`action selected customFielda ${cFieldId}`)
  },
  createNewCustomField({ commit, dispatch }, cField) {
    console.log(`action new persona ${cField.personaId}`, cField)
    //Ne treba mutator jer se svi podaci nalaze u store.selectedCustomField
    return personaService
      .createNewCustomField(cField)
      .then(() => {
        const notification = {
          type: 'success',
          message: `New custom fields successfully added for selected persona!`
        }
        dispatch('notification/add', notification, { root: true })
        commit('ADD_CUSTOM_FIELD_TO_ARRAY', cField)
      })
      .catch(error => {
        console.log(error)
        const notification = {
          type: 'error',
          message: "Unable to create custom field, there is errors on entered data"
        }

        dispatch('notification/add', notification, { root: true })
        // dispatch('notification/reloadPage', {}, { root: true })
      })
      .then(() =>
        //console.log("state pesona id :",state.personaObject.id)
        dispatch('getCustomFieldsByPersonaID', state.personaObject.id)
      )
  },
  setSelectedCustomField({ commit }, selectedCustomField) {
    commit('SET_SELECTED_CUSTOM_FIELD', selectedCustomField)
  },
  getCustomFieldsByPersonaID({ commit, dispatch }, personaId) {
    console.log(`action CustomFields ${personaId}`)
    return personaService
      .getCustomFieldsByPersonaID(personaId)
      .then(response => commit('GET_CUSTOM_FIELDS', response.data))
      .catch(error => {
        const notification = {
          type: 'error',
          message: `Error loading custom fields by selected persona, please contact administrator.`
        }
        console.log(notification, error)
        dispatch('notification/add', notification, { root: true })
      })
  },
  updateCustomField({ commit, dispatch }, cField) {
    console.log(`update action ${cField}`, cField)
    commit('UPDATE_CUSTOM_FIELD', cField)
    return personaService
      .updateCustomField(cField)
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
        console.log(notification, error)
        dispatch('notification/add', notification, { root: true })
      })
      .then(() => commit('UPDATE_CUSTOM_FIELD', cField))
  },
  deleteSelectedCustomField({ commit, dispatch }, params) {
    console.log(`action za delete`, params)
    console.log(params.personaId)
    console.log(params.cFieldId)
    return personaService
      .deleteSelectedCustomField(params)
      .then(() => {
        const notification = {
          type: 'success',
          message: `Custom field successfully deleted for selected persona!`
        }
        dispatch('notification/add', notification, { root: true })
        commit('DELETE_CUSTOM_FIELD', params.cFieldId)
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: error
        }
        console.log(notification, error)
        dispatch('notification/add', notification, { root: true })
      })
  },
  getMasks({ commit }) {
    return portalService
      .getMasks()
      .then(response => commit('GET_MASKS', response.data))
  }
}

export const getters = {}
