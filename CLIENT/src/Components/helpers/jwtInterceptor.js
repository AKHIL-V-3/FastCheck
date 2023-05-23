
import axios from 'axios'


console.log('process',process.env.BASE_URL);

const jwtInterceptor = axios.create({
  baseURL: "https://server.fastcheck.live"
})
const HostjwtInterceptor = axios.create({
  baseURL: "https://server.fastcheck.live"
})


jwtInterceptor.interceptors.response.use(
    (response) =>{
          return response
    },
    async (error)=>{
           if(error.response.status === 401){
             await axios.get("https://server.fastcheck.live/refresh", {
                withCredentials: true
              }).catch(async(err) => {
                  if(err) {
                   await axios.post("https://server.fastcheck.live/logout",null,{withCredentials:true})    
                  }
                   return Promise.reject(err)
              }) 
              return jwtInterceptor(error.config)
           }
           Promise.reject(error)
    }
)


 HostjwtInterceptor.interceptors.response.use(
  (response) =>{

        return response
  },

  async (error)=>{

         if(error.response.status === 401){

           await axios.get("https://server.fastcheck.live/host/refreshhost", {
              withCredentials: true
        
            }).catch(async(err) => {
                if(err) {
                  await axios.post("https://server.fastcheck.live/host/logout",null,{withCredentials:true})
                  
                }
                 return Promise.reject(err)
            })
            
            return jwtInterceptor(error.config)
           
         }

         Promise.reject(error)
  }
)




export const hostInterceptor =  HostjwtInterceptor
export default jwtInterceptor;