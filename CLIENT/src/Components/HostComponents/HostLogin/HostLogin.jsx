import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import {ToastContainer,toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { authactions } from '../../../Redux/Auth/authSlice';
import { baseUrl } from '../../../Axios/api';


function HostLogin() {
     
  const dispatch = useDispatch()
   const navigate = useNavigate()
  
   const [userData,setUserdata] = useState({
     
        Email:"",
        Password:"",
   })

   const generateError = (err)=>{
        
    toast.error(err,{
       position:"top-center"
    })
    
 }

 const sendRequest =async()=>{
      
  const { data } = await baseUrl.post("/host/login",userData,{
    withCredentials:true
  })
     
  if(data.errors){
    const {email,password} = data.errors            
       if(email) generateError(email)
       else if(password) generateError(password)

  }else{
   return data 
  }
     
 }

   const handleSubmit =async(e)=>{

    e.preventDefault()
      
   const data = await sendRequest()

       if(data){
         dispatch(authactions.hostLogin())
         dispatch(authactions.setHost(data.user))
         navigate('/host')

       }

    }


  return (
    <section>
      <div className='bg-white w-full h-screen text-black flex items-center justify-center'>
     
        <div className=' h-auto w-80 flex-col items-center justify-center border-black border-2 rounded-md  xl:w-96'>

           <h1 className='text-lg font-bold mt-3 ml-5 '>Login as Host</h1>


           <hr className='bg-white m-5'/>
          <div className='flex-col w-full h-auto'>
            <form action="" onSubmit={(e)=>handleSubmit(e)}>
          <div className='mt-12 ml-8 rounded-xl'>
         
          <input type="email" name='Email'onChange={(e)=>setUserdata({...userData,[e.target.name]:e.target.value})} className=" w-64 xl:w-80 h-11  border border-black  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Your EmailAddress" required></input>
          </div>

          <div className='mt-12 ml-8 rounded-xl'>
         
          <input type="password" name='Password' autocomplete="on" onChange={(e)=>setUserdata({...userData,[e.target.name]:e.target.value})}  className=" w-64 xl:w-80 h-11  border border-black  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Your Password" required></input>
          </div>


            <button className='bg-black mt-12 ml-8 text-white p-2 rounded-xl w-28 font-semibold'>SignIn</button>

            <div className='w-full flex justify-center pt-7 pb-7'>
            <p>Are you new here ? <span className='underline cursor-pointer' onClick={()=>navigate("/host/hostsignup")}>Signup</span></p>
            </div>
            </form>

            

             {/* <div className='flex justify-center mt-8'>
               <hr className='bg-white w-16 ml-2 mt-3'/>
               <span className='mx-2'>Or Continue With</span>
               <hr className='bg-white w-16 ml-2 mt-3' />
             </div>

             <div  className='bg-white mt-12 ml-8 text-black p-2 rounded-3xl w-3/4 font-extrabold flex justify-center items-center'>
             <svg class="h-5 w-5 text-black"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M17.788 5.108A9 9 0 1021 12h-8" /></svg>
             <button className='ml-2'>Google</button>
              </div>  */}
             

          </div>
          


          

        </div>

       
      </div>
      <ToastContainer/>
    </section>
  )
}

export default HostLogin