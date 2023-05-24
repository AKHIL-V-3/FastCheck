
import axios from 'axios'


console.log('process',process.env.BASE_URL);

const jwtInterceptor = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL
})
const HostjwtInterceptor = axios.create({
  baseURL:process.env.REACT_APP_BASE_URL
})


jwtInterceptor.interceptors.response.use(
    (response) =>{
          return response
    },
    async (error)=>{
           if(error.response.status === 401){
             await axios.get(`${process.env.REACT_APP_BASE_URL}/refresh`, {
                withCredentials: true
              }).catch(async(err) => {
                  if(err) {
                   await axios.post(`${process.env.REACT_APP_BASE_URL}/logout`,null,{withCredentials:true})    
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

           await axios.get(`${process.env.REACT_APP_BASE_URL}/host/refresh`, {
              withCredentials: true
        
            }).catch(async(err) => {
                if(err) {
                  await axios.post(`${process.env.REACT_APP_BASE_URL}/host/logout`,null,{withCredentials:true})
                  
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