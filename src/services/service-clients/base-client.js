import axios from 'axios'
import NProgress from 'nprogress'

function setupInterceptors(client) {
    client.interceptors.request.use(config => {
        // Called on request
        NProgress.start()
        return config
      })
      
    client.interceptors.response.use(response => {
        // Called on response
        NProgress.done()
        return response
      })

}

export default function(url) {
    var client =  axios.create({
        baseURL: url,
        withCredentials: false,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 5000})
        
    setupInterceptors(client)
    
     return client 
      
}
