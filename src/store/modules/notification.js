export const namespaced = true
    
    export const state = {
      notifications: [],
      reload:false
    }

    let nextId = 1
    
    export const mutations = {
      PUSH(state, notification) {
        state.notifications.push({
          ...notification,
          id: nextId++
        })
      },
      DELETE(state, notificationToRemove) {
        state.notifications = state.notifications.filter(
          notification => notification.id !== notificationToRemove.id
        )
      },
      RELOAD_PAGE(state){
        state.reload=true
      }
    } 
    
    export const actions = {
        add({ commit }, notification) {
          commit('PUSH', notification)
        },
        remove({ commit }, notificationToRemove) {
          commit('DELETE', notificationToRemove)
        },
        reloadPage({commit}){
          commit('RELOAD_PAGE')
        }
      }