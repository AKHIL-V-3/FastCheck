import React, { useState } from 'react'
import { baseUrl } from '../../Axios/api'
import { ToastContainer, toast } from "react-toastify"
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { authactions } from '../../Redux/Auth/authSlice';

function Login() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [adminData, setAdmindata] = useState({
        Email: "",
        Password: "",
      })
      const generateError = (err) => {
        toast.error(err, {
          position: "top-center"
        })
      }

    const handleLogin = async(e)=>{
        e.preventDefault()
        const {data} = await baseUrl.post("/admin/login", adminData, {
            withCredentials: true
          })
          if (data.errors) {
            const { email, password } = data.errors
            if (email) generateError(email)
            else if (password) generateError(password)
          } else {
              if(data){
                dispatch(authactions.adminLogIn())
                dispatch(authactions.setAdmin(data.user))
                navigate("/admin")
              }
          }
    }

  return (
    <section>
      <div className='bg-white w-full h-screen text-black flex items-center justify-center'>
        <div className=' h-auto pb-8 w-80 flex-col items-center justify-center border-gray-500 border shadow-md shadow-stone-300 rounded-md  xl:w-96'>
          <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold mt-3 ml-5 '>Fastcheck-in</h1>
          <h1 className='text-lg font-bold mt-3 mr-5 '>ADMIN SIGN-IN</h1> 
          </div>

          <hr className='bg-black m-5' />

          <div className='flex-col w-full h-3/4'>
            <form action="" onSubmit={(e) => handleLogin(e)}>
              <div className='mt-12 ml-8 rounded-xl'>
                
                <input type="email" name='Email' onChange={(e) => setAdmindata({ ...adminData, [e.target.name]: e.target.value })}  className=" w-64 xl:w-80 h-11  border border-gray-900  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Your EmailAddress" required></input>
              </div>

              <div className='mt-12 ml-8 rounded-xl'>
                
                <input type="password" name='Password' onChange={(e) => setAdmindata({ ...adminData, [e.target.name]: e.target.value })} autocomplete="on"  className=" w-64 xl:w-80 h-11  border border-gray-900   text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Your Password" required></input>
              </div>

              <button type='submit' className='bg-black mt-12 ml-8 text-white p-2 rounded-3xl w-28 font-semibold'>Continue</button>
            </form>

          </div>

        </div>


      </div>

      <ToastContainer />
     
    </section>
  )
}

export default Login