import axios from 'axios'



var client = function(url) {
  var servis = axios.create({
    baseURL: url,
    withCredentials: false,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 5000
  })
  return servis
}
//const apiGatewayUrl = 'https://microapi.fact.deluxebrand.com'
const apiGatewayUrl = 'http://app.quadro.local:80'
const apiGatewayClient = client(
  //apiGatewayUrl + '/api/admin/s3/uploadImage'
  apiGatewayUrl + '/persona/admin/s3/uploadImage'
)

export default {
    uploadImage(formData) {
      console.log("image service",formData)
      return apiGatewayClient.post('',formData)
    }
}