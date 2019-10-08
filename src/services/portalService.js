import axiosClient from './service-clients/base-client'

if (appUrl == null) {
  var appUrl = 'http://dev-admin.deluxebrand.com/'
}

//Povezivanje preko json-servera
const client = axiosClient(appUrl)

export default {
  getAllActivePortals() {
    return client.get('api/portals?siteId=57'
    )
  },
  getPortalUserGroups(portalId) {
    let searchCriteria = {
      searchGroupCritera: {
        CompanyId: portalId,
        OnlyActive: true
      }
    }
    return client.get(
      `api/userGroup?companyId=${searchCriteria.searchGroupCritera.CompanyId}`
    )
  },
  getMasks(){
    console.log(`servis za maske`)
    return client.get('api/masks')
  }
}
