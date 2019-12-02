import client from './service-clients/base-client'


if (typeof window.apiGatewayUrl === 'undefined') {
  window.apiGatewayUrl = 'http://app.quadro.local:80'
}

const apiGatewayClient = client(apiGatewayUrl + "/persona/persona")

export default {
  getPersonas(companyGuidString) {
    return apiGatewayClient
      .get(`?${companyGuidString}`)
      .then(response => {
        return response.data
      })
  },
  updateFeatures(personaGuid) {
    return apiGatewayClient.put('/', personaGuid)
  },

  getSelectedPersonaByPersonaId(personaId){
    return apiGatewayClient.get(`/${personaId}` )
  },
  editPersonaData(object){
    const data={
      companyId:object.companyId,
      name:object.name,
      allowShare:object.allowShare,
      activeLimit:object.activeLimit
    }
    return apiGatewayClient.put(`/${object.id}`,data)
  },
  setPersonaStaus(element){
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
  createNewPersona(dataObject){
    return apiGatewayClient.post('/',dataObject)
  },
  deleteSelectedPersona(personaIdString){
    return apiGatewayClient.patch(`/delete?${personaIdString}`)
  },
  //Custom fields
  getCustomFieldsByPersonaID(personaId){
    return apiGatewayClient.get(`/${personaId}/fields`)
  },
  createNewCustomField(cField){

    return apiGatewayClient.post(`/${cField.personaId}/fields`,cField)
  },
  updateCustomField(cField){
    return apiGatewayClient.put(`/${cField.personaId}/fields/${cField.id}`,cField)
  },
  deleteSelectedCustomField(params){
    const cFieldIdString=`fieldIds=${params.cFieldId}`
    return apiGatewayClient.patch(`/${params.personaId}/fields/delete?${cFieldIdString}`)
  }
}
