import axiosClient from './service-clients/base-client'

if (typeof window.adminUrl === 'undefined') {
   window.adminUrl = 'http://dev-admin.deluxebrand.com/'
}

//Povezivanje preko json-servera
const client = axiosClient(window.adminUrl)

export default {
  getAllActivePortals() {
    var portalUrl = "api/portals?siteId=57";
    return client.get(portalUrl)
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
    return client.get('api/masks')
  }
}
