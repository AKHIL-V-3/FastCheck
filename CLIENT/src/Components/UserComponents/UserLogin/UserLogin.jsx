import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch ,useSelector} from 'react-redux';
import { authactions } from '../../../Redux/Auth/authSlice';
import { auth, provider } from "../../../GoogleSignIn/Config"
import { signInWithPopup } from "firebase/auth"
import { baseUrl } from '../../../Axios/api';



function UserLogin() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)

  const [googledata, setGoogledata] = useState('')
  const [user, setUser] = useState()

  const [userData, setUserdata] = useState({

    Email: "",
    Password: "",
  })

  const generateError = (err) => {

    toast.error(err, {
      position: "top-right"
    })

  }

  const sendRequest = async () => {

    const { data } = await baseUrl.post("/userlogin", userData, {
      withCredentials: true
    })

    if (data.errors) {

      const { email, password } = data.errors
      if (email) generateError(email)
      else if (password) generateError(password)

    } else {

      return data
    }

  }

  const handleSubmit = async (e) => {

    e.preventDefault()
    sendRequest().then((data) => {
       setUser(data.user)
      dispatch(authactions.logIn())
      dispatch(authactions.setUser(data.user))
      navigate("/")
    })

  }


  const googleSignIn = () => {

    signInWithPopup(auth, provider).then(async (data) => {

      setGoogledata(data.user.email)

      const user = {

        Email: data.user.email,
        Password: data.user.uid
      }

      try {

        const { data } = await baseUrl.post("/userlogin", user, {
          withCredentials: true
        })
        if (data.errors) {

          const { email, password } = data.errors
          if (email) generateError(email)
          else if (password) generateError(password)
    
        } else {
          dispatch(authactions.setUser(user))
          dispatch(authactions.logIn())
          localStorage.setItem('email', data.user.email)
          localStorage.setItem('username', data.user.displayName)
          navigate('/')  
        }

      } catch (err) {

        console.log(err);
      }

    })
  }

  useEffect(() => {

    setGoogledata(localStorage.getItem('email'))
    const username = setGoogledata(localStorage.getItem('username'))
    console.log(username);
    // if(isLoggedIn) navigate('/')


  }, [])

  return (
    <section>
      <div className='bg-white w-full h-screen text-black flex items-center justify-center'>

        <div className=' h-3/4 w-80 flex-col items-center justify-center border-gray-500 border shadow-md shadow-stone-300 rounded-md  xl:w-96'>

          <h1 className='text-lg font-bold mt-3 ml-5 '>Login Or SignUp</h1>

          <hr className='bg-black m-5' />

          <div className='flex-col w-full h-3/4'>
            <form action="" onSubmit={(e) => handleSubmit(e)}>
              <div className='mt-12 ml-8 rounded-xl'>
                
                <input type="email" name='Email' onChange={(e) => setUserdata({ ...userData, [e.target.name]: e.target.value })} className=" w-64 xl:w-80 h-11  border border-gray-900  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Your EmailAddress" required></input>
              </div>

              <div className='mt-12 ml-8 rounded-xl'>
                
                <input type="password" name='Password' autocomplete="on" onChange={(e) => setUserdata({ ...userData, [e.target.name]: e.target.value })} className=" w-64 xl:w-80 h-11  border border-gray-900   text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Your Password" required></input>
              </div>

              <button className='bg-black mt-12 ml-8 text-white p-2 rounded-3xl w-28 font-semibold'>Continue</button>
            </form>

            <div className='flex justify-center mt-8'>
              <hr className='bg-white w-16 ml-2 mt-3' />
              <span className='mx-2'>Or Continue With</span>
              <hr className='bg-white w-16 ml-2 mt-3' />
            </div>

            <div onClick={googleSignIn} className='bg-black mt-12 ml-8 text-white p-2 rounded-3xl w-3/4 font-extrabold flex justify-center items-center'>
              <svg class="h-5 w-5 text-white" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M17.788 5.108A9 9 0 1021 12h-8" /></svg>
              <button className='ml-2'>Google</button>
            </div>


            <div className='ml-12 mt-5'>
              <p>New Here ?<span onClick={() => navigate("/usersignup")} className='ms-3 underline cursor-pointer'>Signup</span></p>
            </div>

          </div>

        </div>


      </div>
      <ToastContainer />
    </section>
  )
}

export default UserLogin