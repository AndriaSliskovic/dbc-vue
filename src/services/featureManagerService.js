import client from "./service-clients/base-client"

if (apiGatewayUrl == null) {
    var apiGatewayUrl = 'http://localhost:5200/'
  }

const apiGatewayClient = client(apiGatewayUrl)

export default {
    getSubscribedFeatures(subscribedEntityGuid) {
        return apiGatewayClient.get(`/feature-manager/features/${subscribedEntityGuid}`)
    },
    getAllFeatures() {
        return apiGatewayClient.get('/feature-manager/features')
    },
    updateFeatures(dataObject) {
        return apiGatewayClient.put('/feature-manager/features', dataObject)
    }
}