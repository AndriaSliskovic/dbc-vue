import client from './service-clients/base-client'


if (typeof window.apiGatewayUrl === 'undefined') {
  window.apiGatewayUrl = 'http://10.99.0.100:5200'
}

const apiGatewayClient = client(apiGatewayUrl + "/persona/persona")

export default {
  getPersonas(companyGuidString) {
    console.log(`servis za string ${companyGuidString}`)
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
    console.log(`servis persona objekta ${personaId}`)
    return apiGatewayClient.get(`/${personaId}` )
  },
  editPersonaData(object){
    console.log(`servis edit persona objekta ${object.personaId}`)
    const data={
      companyId:object.companyId,
      name:object.name,
      allowShare:object.allowShare,
      activeLimit:object.activeLimit
    }
    console.log("edited object",data)    
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
  createNewPersona(dataObject){
    return apiGatewayClient.post('/',dataObject)
  },
  deleteSelectedPersona(personaIdString){
    console.log(`servis delete ${personaIdString}`)
    return apiGatewayClient.patch(`/delete?${personaIdString}`)
  },
  //Custom fields
  getCustomFieldsByPersonaID(personaId){
    console.log(`servis CustomFields objekta ${personaId}`)
    return apiGatewayClient.get(`/${personaId}/fields`)
  },
  createNewCustomField(cField){
    console.log(`servis za new custom field ${cField.personaId}`)

    return apiGatewayClient.post(`/${cField.personaId}/fields`,cField)
  },
  updateCustomField(cField){
    console.log(`servis za edit peronu ${cField.personaId}`,cField.id)
    return apiGatewayClient.put(`/${cField.personaId}/fields/${cField.id}`,cField)
  },
  deleteSelectedCustomField(params){
    const cFieldIdString=`fieldIds=${params.cFieldId}`
    console.log(`servis za delete custom field`,params,cFieldIdString)
    console.log(apiGatewayClient.patch(`/${params.personaId}/fields/delete?${cFieldIdString}`))
    return apiGatewayClient.patch(`/${params.personaId}/fields/delete?${cFieldIdString}`)
  }
}
