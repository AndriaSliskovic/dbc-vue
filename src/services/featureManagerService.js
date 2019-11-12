import client from "./service-clients/base-client"

if (typeof window.apiGatewayUrl === 'undefined') {
    window.apiGatewayUrl = 'http://app.quadro.local:80'
}

const apiGatewayClient = client(window.apiGatewayUrl)

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