import client from './service-clients/base-client'

if (apiGatewayUrl == null) {
  var apiGatewayUrl = 'http://10.99.0.100:5200/persona/persona'
}

const apiGatewayClient = client(apiGatewayUrl)

export default {
  getPersonas(companyGuid) {
    return apiGatewayClient
      .get(`?${companyGuid}`)
      .then(response => {
        return response.data
      })
  },
  updateFeatures(personaGuid) {
    return apiGatewayClient.put('/', personaGuid)
  },
  getCustomFieldsByPersonaID(personaId){
    console.log(`servis CustomFields objekta ${personaId}`)
    return apiGatewayClient.get(`/${personaId}/fields`)
  },
  getSelectedPersonaByPersonaId(personaId){
    console.log(`servis pesona objekta ${personaId}`)
    return apiGatewayClient.get(`/${personaId}` )
  }
}
