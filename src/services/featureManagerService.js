import client from "./service-clients/base-client"

if (!apiGatewayUrl) {
    var apiGatewayUrl = 'http://10.99.0.100:5200'
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
        console.log(`servis feature,${dataObject.subscribedEntityId},${dataObject.moduleIds}`)
        return apiGatewayClient.put('/feature-manager/features', dataObject)
    }
}