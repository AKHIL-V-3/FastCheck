
import axios from 'axios'


console.log('process',process.env.BASE_URL);

const jwtInterceptor = axios.create({
  baseURL: "http://localhost:5000"
})
const HostjwtInterceptor = axios.create({
  baseURL: "http://localhost:5000"
})


jwtInterceptor.interceptors.response.use(
    (response) =>{
          return response
    },
    async (error)=>{
           if(error.response.status === 401){
             await axios.get("http://localhost:5000/refresh", {
                withCredentials: true
              }).catch(async(err) => {
                  if(err) {
                   await axios.post("http://localhost:5000/logout",null,{withCredentials:true})    
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

           await axios.get("http://localhost:5000/host/refreshhost", {
              withCredentials: true
        
            }).catch(async(err) => {
                if(err) {
                  await axios.post("http://localhost:5000/host/logout",null,{withCredentials:true})
                  
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