import imageService from '../../services/imagesService'

export const namespaced = true

export const state = {
  uploadedImage:null
}
export const mutations = {
  SET_SELECTED_IMAGE(state,payload){
    state.uploadedImage=payload
  }
}
export const actions = {
  uploadImage({commit, dispatch},selectedFile){
   // console.log(selectedFile)
    commit('SET_SELECTED_IMAGE', selectedFile)
    //imageService.uploadImage(selectedFile)

    // .then(() => {
    //   const notification = {
    //     type: 'success',
    //     message: `Image successfully uploaded !`
    //   }
    //   //Success mesage
    //   dispatch('notification/add', notification, { root: true })
    //   commit('SET_SELECTED_IMAGE', selectedFile)
    // })
    // .catch(error => {
    //   const notification = {
    //     type: 'error',
    //     message: error
    //   }
    //   dispatch('notification/add', notification, { root: true })
    // })

  }
}
export const getters = {}
