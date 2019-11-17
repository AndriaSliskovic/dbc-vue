import axios from 'axios'
import NProgress from 'nprogress'

if (typeof window.apiGatewayUrl === 'undefined') {
  window.apiGatewayUrl = 'http://app.quadro.local:80'
  //window.apiGatewayUrl ='https://microapi.fact.deluxebrand.com/api/admin/s3/uploadImage'
}

var client = function(url){
  var servis=axios.create({
    baseURL: url,
    withCredentials: false,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
      // 'type': 'image/png'
    },
    timeout: 5000})
    return servis
} 

const apiGatewayClient = client(apiGatewayUrl + "/persona/admin/s3/uploadImage")
//const apiGatewayClient = client(apiGatewayUrl)

export default {
    uploadImage(selectedFile) {
      console.log("servis za upload",selectedFile)
      apiGatewayClient.post('/',selectedFile)
      .then(
        (res)=>console.log(res)
      )
      //return apiGatewayClient.post('https://microapi.fact.deluxebrand.com/api/admin/s3/uploadImage',selectedFile)
    }
}