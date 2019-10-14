import axiosClient from './service-clients/base-client'

if (appUrl == null) {
  var appUrl = 'http://dev-admin.deluxebrand.com/'
}

//Povezivanje preko json-servera
const client = axiosClient(appUrl)

export default {
    getAllCompanies(){
        return client.get('api/portals?siteId=57')
    }
}