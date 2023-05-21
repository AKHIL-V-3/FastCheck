import React,{useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom';
import {  useSelector,useDispatch } from 'react-redux';
import axios from 'axios';
import { authactions } from '../../../Redux/Auth/authSlice';
import { hostInterceptor } from '../../helpers/jwtInterceptor';
import { baseUrl } from '../../../Axios/api';

let firstRender = true


function HostHeader() {

    const [toggle, setToggle] = useState(false)
    
    const handleToggle = () => {
      setToggle(!toggle)
    }
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoggedIn = useSelector((state) => state.user.ishostLoggedIn)
  const Host = useSelector((state) => state.user.host)
  
    const apiCall = async () => {
      const { data } = await baseUrl.get("http://localhost:8000/host", {
        withCredentials: true
      }).catch((err) => {
        console.log(err.message);
      })
      return data
    }

  
  const sendLogoutReq =async()=>{

    const response = await hostInterceptor.post("http://localhost:8000/host/logout",null,{
      withCredentials: true
    })
    if (response.status === 200) return response
    return new Error("Unable to logout please try again")
  }



  const handleLogout = ()=>{

    sendLogoutReq().then((response) => {                                                                 
      if (response) {
        dispatch(authactions.hostLogOut())
        dispatch(authactions.removeHost())
        navigate('/host/hostlogin')
     
      }
      
    }).catch(err => console.log(err));
  }



  useEffect(()=>{

    if(firstRender){ 
        firstRender = false
       apiCall().then(data => {
         if (data) {

          console.log(data,'hostdataaaa');

           dispatch(authactions.hostLogin())
           dispatch(authactions.setHost(data))
         }
       }).catch((err)=>console.log(err))
     }
 
     if(!isLoggedIn) navigate('/host/hostlogin')
           
         
  },[dispatch,isLoggedIn,navigate])

    return (
    <section className='sticky top-0 z-40 '>
      <nav className='bg-white text-black h-auto shadow-md shadow-gray-400'>
        <div className='flex items-center justify-start h-20 xl:ml-10 ml-5 relative'>
          <div className='font-extrabold text-3xl xl:text-4xl'>LOGO</div>
          <div className='xl:flex justify-evenly items-center w-4/12 hidden'>
            <p className='cursor-pointer' onClick={()=>navigate("/host/reservationlist")}>Reservations</p>
            { isLoggedIn && <p className='cursor-pointer'onClick={()=>navigate("/host/messages")} >Messages</p>}
            {isLoggedIn && <p>{Host.HostName}</p>}
            
          </div>
          <div className='flex absolute xl:right-16 right-8'>
            <div  className='bg-black w-40 h-10 rounded-3xl text-white xl:flex justify-center items-center cursor-pointer hidden'>
              <p className='font-medium '>Become a Host</p>
            </div>

            <div className='flex flex-col items-end'>
              <div>
                <button onClick={handleToggle} type="button" aria-expanded="false" className='bg-black  w-20 h-10 xl:w-24 xl:h-10 ml-5 rounded-3xl text-white flex items-center justify-center'>
                  <FontAwesomeIcon icon="bars" className='xl:h-5 xl:w-5 w-4 h-4 me-3' />
                  <div className='text-white bg-black w-6 h-6 xl:w-7 xl:h-7 flex justify-center items-center rounded-full'>
                    <FontAwesomeIcon icon="user" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {
          toggle ? (

            <div className='bg-gray-900 w-24 h-28 hidden absolute right-16 xl:flex flex-col space-y-2 items-center'>

              <div className='flex flex-col items-start space-y-2 p-2'>
                <p  className='cursor-pointer' >My Profile</p>
                {
                  !isLoggedIn ?
                    (<div className='flex flex-col item-start space-y-2'>
                      <p onClick={()=>navigate("/host/hostlogin")}>Login</p>
                      <p onClick={()=>navigate("/host/hostsignup")}>Signup</p>

                    </div>)
                    :
                    <div className='flex flex-col item-start space-y-2'>
                      <p>About</p>
                      <p className='cursor-pointer' onClick={handleLogout}>LogOut</p>
                    </div>

                }
              </div>
            </div>

          ) : null
        }

        {

          toggle ? (

            <div className='bg-gray-900 w-full xl:hidden h-36 flex items-start justify-between  shadow-white'>
              <div className='flex flex-col justify-start space-y-3 p-3'>
                <p>Share Stories</p>
                <p>Reservations</p>
                <p>Find a property</p>
                {isLoggedIn && <h5>{Host.HostName}</h5>}
              </div>

              <div className='p-3 me-3 flex flex-col items-center space-y-3'>
                <div onClick={() => navigate('/host/hostsignup')} className='bg-white w-36 h-10 rounded-3xl text-black xl:flex flex justify-center items-center cursor-pointer'>
                  <p className='font-medium '>Become a Host</p>
                </div>

                <div className='flex flex-col items-start space-y-2'>
                  <p>My Profile</p>
                  {!isLoggedIn ? <p>Login / Signup</p> :<p>LogOut</p>}
                    
                </div>
              </div>
            </div>

          ) : null
        }
      </nav>
    </section>
    )
}

export default HostHeader