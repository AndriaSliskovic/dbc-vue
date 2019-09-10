import client from "./service-clients/base-client"

if (apiGatewayUrl == null) {
    var apiGatewayUrl = 'http://localhost:5200/'
  }

const apiGatewayClient = client(apiGatewayUrl)

export default {
    getPersonas(companyGuid) {
        return apiGatewayClient.get(`/persona/persona?${companyGuid}`).then((response) => {
            return response.data;
        })
    },
    updateFeatures(personaGuid) {
        return apiGatewayClient.put('/persona/persona/', personaGuid)
    },
    getPersonaById(personaGuid){
        return apiGatewayClient.get('/persona/persona/', personaGuid)
    }
}