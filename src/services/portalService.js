import axiosClient from './service-clients/base-client'

if (appUrl == null) {
  var appUrl = 'http://dev-admin.deluxebrand.com/'
}

//Povezivanje preko json-servera
const client = axiosClient(appUrl)

export default {
  getAllActivePortals() {
    return client.post('Services/WarehouseService.svc/GetSiteCustomers',
    {siteId:57}
    )
  },
  getPortalUserGroups(portalId) {
    let searchCriteria = {
      searchGroupCritera: {
        COMP_ID: portalId,
        ISACTIVE: true
      }
    }
    return client.post(
      'Services/CompanyService.svc/GetUsergroupsForCompany',
      searchCriteria
    )
  }
}
