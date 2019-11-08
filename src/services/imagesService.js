import client from './service-clients/base-client'

if (typeof window.apiGatewayUrl === 'undefined') {
  window.apiGatewayUrl = 'http://10.99.0.100:5200'
}

const apiGatewayClient = client(apiGatewayUrl + "/persona/admin/s3/uploadImage")

export default {
    uploadImage(selectedFile) {
      console.log("servis za upload",selectedFile)
      return apiGatewayClient.post('/',selectedFile)
    }
}