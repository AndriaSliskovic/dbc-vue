import axiosClient from './service-clients/base-client'

if (typeof window.adminUrl === 'undefined') {
   window.adminUrl = 'http://dev-admin.deluxebrand.com/'
}

//Povezivanje preko json-servera
const client = axiosClient( window.adminUrl)

export default {
    getAllCompanies() {
      var portalUrl = "api/portals?siteId=57";
      return client.get(portalUrl)
    }
}