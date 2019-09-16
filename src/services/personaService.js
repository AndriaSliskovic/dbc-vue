import client from "./service-clients/base-client"

if (apiGatewayUrl == null) {
    var apiGatewayUrl = 'http://10.99.0.100:5200'
    //var apiGatewayUrl = 'http://localhost:5200'
  }

const apiGatewayClient = client(apiGatewayUrl + "/persona/persona")

export default {
    getPersonas(companyGuid) {
        return apiGatewayClient.get(`?${companyGuid}`).then((response) => {
            console.log(response)
            return response.data;
        })
    },
    updateFeatures(personaGuidString) {
        return apiGatewayClient.put('/', personaGuidString)
    },
    getPersonaObjectByPersonaId(personaGuid){
        //console.log('servis persona objekta ',personaGuid)
        return apiGatewayClient.get(`/${personaGuid}`)
    },
    getCompanyIdByPersonaId(personaGuid){
        return apiGatewayClient.get(`/${personaGuid}`)
    },
    deactivateStatusById(personaUrlString){
        return apiGatewayClient.patch(`/deactivate?${personaUrlString}`)
    },
    activateStatusById(personaUrlString){
        return apiGatewayClient.patch(`/activate?${personaUrlString}`)
    },
    getCustomFieldsByPersonaId(personaGuid){
        console.log(`servis za custom fields ${personaGuid}`)
        return apiGatewayClient.get(`/${personaGuid}/fields`)
    }

}