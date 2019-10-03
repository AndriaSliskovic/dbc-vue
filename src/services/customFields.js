import client from './service-clients/base-client'


if (apiGatewayUrl == null) {
  var apiGatewayUrl = 'http://10.99.0.100:5200'
  //var apiGatewayUrl = 'http://localhost:5200'
}

const personaId=function(personaId){
    return personaId
}

const apiGatewayClient = client(apiGatewayUrl + "/persona/persona")

export default{
    createNewCustomField(personaId){

    }
}