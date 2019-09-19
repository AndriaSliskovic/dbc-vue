import client from './service-clients/base-client'


if (apiGatewayUrl == null) {
  var apiGatewayUrl = 'http://10.99.0.100:5200'
  //var apiGatewayUrl = 'http://localhost:5200'
}

const apiGatewayClient = client(apiGatewayUrl + "/persona/persona")

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
    console.log(`servis persona objekta ${personaId}`)
    return apiGatewayClient.get(`/${personaId}` )
  },
  editPersonaData(object){
    console.log(`servis edit persona objekta ${object.personaId}`)
    const data={
      companyId:object.companyId,
      name:object.name
    }    
    return apiGatewayClient.put(`/${object.personaId}`,data)
  },
  setPersonaStaus(element){
    console.log(`servis edit statusa persona objekta ${element}`)
    const data={
      companyId:element.companyId,
      name:element.name
    } 
    return apiGatewayClient.put(`/${element.id}`,data)

  },
  deactivateStatusById(personaUrlString){
    return apiGatewayClient.patch(`/deactivate?${personaUrlString}`)
},
activateStatusById(personaUrlString){
    return apiGatewayClient.patch(`/activate?${personaUrlString}`)
},
}
