import imageService from '../../services/imagesService'

export const namespaced = true

const uploadService=(formData)=> {
  var client = function(url) {
    var servis = axios.create({
      baseURL: url,
      withCredentials: false,
      headers: {
        'Content-Type': 'multipart/form-data'
        // 'type': 'image/png'
      },
      timeout: 5000
    })
    return servis
  }

  const apiGatewayUrl = 'https://microapi.fact.deluxebrand.com'
  const apiGatewayClient = client(
    apiGatewayUrl + '/api/admin/s3/uploadImage'
  )
  console.log('servis za upload', formData)
  apiGatewayClient
    .post('', formData)
    .then(res => (this.selectedFile.fileName = res.data.fileName))
    .then(() => console.log(this.selectedFile))
}

export const state = {
  imagesArray:[
    
  ],
  selectedImage:null,
  uploadedImage:null
}
export const mutations = {
  ADD_IMAGES_TO_ARRAY(state,payload){
    state.imagesArray.push(payload)
  },
  SET_UPLOADED_IMAGE(state,payload){
    state.uploadedImage=payload
  },
  REMOVE_IMAGE(state,payload){
    state.images.splice(payload,1)
  },
}
export const actions = {
  addToImagesArray({commit}, image){
    commit('ADD_IMAGES_TO_ARRAY',image)
  },
  removeImage({commit}, key){
    commit('REMOVE_IMAGE',key)
  },
  uploadImage({commit, dispatch},selectedFile){
   

  }
}
export const getters = {}
