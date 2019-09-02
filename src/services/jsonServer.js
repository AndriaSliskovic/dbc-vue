import axios from 'axios'
import NProgress from 'nprogress'

const BASE_URL=`http://localhost:3000`

//Povezivanje preko json-servera
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  timeout:10000
})

apiClient.interceptors.request.use(config => { // Called on request
  NProgress.start()
  return config
})

apiClient.interceptors.response.use(response => { // Called on response
  NProgress.done()
  return response
})

export default {
  getEvents(perPage, page) {
    return apiClient.get('/events?_limit=' + perPage + '&_page=' + page)
  },
  getEvent(id) {
    return apiClient.get('/events/' + id)
  },
  postEvent(event) {
    return apiClient.post('/events', event)
  },

  getCompanies(){
    return apiClient.post("/SiteCustomersList",
    {siteId:57}
    )
  },

getFeatures(){
  return apiClient.get('/features')
},

getSelectedFeatures(guid){
  return apiClient.get(`/features/${guid}`)
},

getCompanyGroups(companyId){
  //console.log(companyId)
  let searchCriteria= {
      searchGroupCritera : {
      COMP_ID : companyId, 
      ISACTIVE : true
    }
  }
  return apiClient.post('/d',searchCriteria)
},

  editFeatures(dataObject){
    alert(dataObject)
    return apiClient.put('/features',dataObject)
  }
}
