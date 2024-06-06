import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { authactions } from '../../../Redux/Auth/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import jwtInterceptor from '../../helpers/jwtInterceptor';
import { baseUrl } from '../../../Axios/api';


function Header() {

  const [toggle, setToggle] = useState(false)
  const handleToggle = () => {
    setToggle(!toggle)
  }
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const apiCall = async () => {
     baseUrl.get("/", {
      withCredentials: true
    })
    .then((res)=>{
       return res.data
    })
    .catch((err) => {
      console.log(err.message);
    })
    
  }
  const sendLogoutReq = async () => {
    const response = await baseUrl.get("/logout",  {
      withCredentials: true
    })
    return response
  }
  const handleLogout = () => {
    sendLogoutReq().then((response) => {
      if (response) {
        dispatch(authactions.louOut())
        dispatch(authactions.removeUser())
        dispatch(authactions.removeUserImage())
        dispatch(authactions.removetemporaryUser())
        navigate('/userlogin')
      }
    }).catch(err => {
      console.log(err)
    });
  }
  const userProfile = async () => {
    const { data } = await jwtInterceptor.get("/userprofile", {
      withCredentials: true
    }).catch((err) => {
      console.log(err.message);
      console.log(err.code);
      navigate("/userlogin")
    })
    
    if (data) {
      dispatch(authactions.setUser(data.user))
      navigate("/userprofile")
    } else {
      navigate("/userlogin")
    }
  }
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)
  const user = useSelector((state)=>state.user.user)

  useEffect(() => {
    apiCall().then(data => {
      if (data) {
        dispatch(authactions.logIn())
        dispatch(authactions.setUser(data.user))
      }
    })

  }, [dispatch])

  return (

    <section className='sticky top-0 z-50'>
      <nav className='bg-white text-black h-auto shadow-md shadow-gray-400'>
        <div className='flex items-center justify-start h-20 xl:ml-10 ml-5 relative'>
          <div className='font-extrabold text-3xl xl:text-4xl flex' onClick={() => navigate("/")}>
          <div className='font-extrabold text-3xl xl:text-4xl cursor-pointer'>Fastcheck-in</div>
          </div>
          <div className='xl:flex justify-evenly items-center w-9/12 hidden'>

          </div>
          <div className='flex absolute xl:right-16 right-8'>
            <div onClick={() => navigate('/host/hostlogin')} className=' w-40 h-10 rounded-3xl border border-gray-900 shadow-md xl:flex justify-center items-center cursor-pointer hidden'>
              <p className='font-medium '>Become a Host</p>
            </div>

            <div className='flex flex-col items-end'>
              <div>
                <button onClick={handleToggle} type="button" aria-expanded="false" className='w-20 h-10 xl:w-24 xl:h-10 ml-5 rounded-3xl border border-gray-900 hover:shadow-lg shadow-gray-900 flex items-center justify-center'>
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
            <div className='w-44 h-auto pb-5 hidden absolute right-16 text-md font-semibold xl:flex flex-col space-y-2 items-center rounded-md bg-white mt-1 shadow-md shadow-gray-400'>
              <div className='space-y-3 mt-2  w-full'>
                {
                  !isLoggedIn ?
                    (<div className='flex flex-col item-start w-full space-y-2'>
                      <div onClick={() => navigate("/userlogin")} className='cursor-pointer hover:bg-slate-300 w-full h-10 pl-3 flex items-center'>
                        <p className='cursor-pointer'>Login</p>
                      </div>
                      <div onClick={() => navigate("/usersignup")} className='cursor-pointer hover:bg-slate-300 w-full h-10 pl-3 flex items-center'>
                        <p className='cursor-pointer'> Signup</p>
                      </div>
                    </div>)
                    :
                    <div className='flex flex-col item-start space-y-2'>
                      <div  onClick={() => navigate("/chat/messages")} className='hover:bg-slate-300 w-full h-10 pl-3 flex items-center'>
                        <p className='cursor-pointer'  >Messages</p>
                      </div>
                      <div  onClick={() => navigate("/trips")} className='hover:bg-slate-300 w-full h-10 pl-3 flex items-center'>
                        <p className='cursor-pointer' >Reservations</p>
                      </div>
                    </div>
                }
              </div>

              {isLoggedIn &&

                <hr className='w-full bg-red-700 text-gray-700' />
              }

              {

                isLoggedIn &&
                <div className='w-full space-y-2'>
                  <div  onClick={() => userProfile()} className='cursor-pointer hover:bg-slate-300 w-full h-10 pl-3 flex items-center'>

                    {  
                     
                     isLoggedIn ?  <p className=''  >{user.UserName}</p>  
                     :
                      <p className=''  >Account</p>}

                  </div>
                </div>}

              <hr className='w-full' />

              <div className='w-full space-y-2'>
                <div className='cursor-pointer  hover:bg-slate-300 w-full h-10 pl-3 flex items-center'>
                  <p className='cursor-pointer' >Help</p>
                </div>

                {isLoggedIn &&
                  <div onClick={handleLogout} className='cursor-pointer  hover:bg-slate-300 w-full h-10 pl-3 flex items-center'>
                    <p  className='cursor-pointer'>Log out</p>
                  </div>
                }

              </div>

            </div>

          ) : null
        }

        {

          toggle ? (

            <div className=' w-44 absolute right-9 top-20  text-md font-semibold xl:hidden h-auto shadow-md flex items-start justify-between  shadow-stone-400 bg-white mt-1'>

              <div className='flex flex-col w-full justify-start space-y-3 p-3'>
                <div onClick={() => navigate('/host/hostlogin')} className=' w-36 h-10 rounded-3xl text-black xl:flex flex justify-center shadow-md shadow-stone-400 border border-gray-400 items-center cursor-pointer'>
                  <p className='font-medium '>Become a Host</p>
                </div>


                <div className='flex flex-col w-full items-start space-y-2'>

                  {isLoggedIn ?

                    <>
                      < div  onClick={() => navigate("/chat/messages")} className='cursor-pointer hover:bg-slate-300 w-full h-10 pl-3 flex items-center' >
                        <p >Messages</p>
                      </div>

                      <div onClick={() => navigate("/trips")} className='cursor-pointer hover:bg-slate-300 w-full h-10 pl-3 flex items-center'>
                        <p  >Reservations</p>
                      </div>
                      <div onClick={() => userProfile()} className='cursor-pointer hover:bg-slate-300 w-full h-10 pl-3 flex items-center'>
                        <p >Account</p>
                      </div>

                      <div onClick={handleLogout} className='cursor-pointer hover:bg-slate-300 w-full h-10 pl-3 flex items-center'>
                        <p >Log out</p>
                      </div>

                    </>

                    :

                    <>

                      <div onClick={() => navigate("/userlogin")} className='hover:bg-slate-300 w-full h-10 pl-3 flex items-center'>
                        <p >Login</p>
                      </div>

                      <div onClick={() => navigate("/usersignup")} className='hover:bg-slate-300 w-full h-10 pl-3 flex items-center'>
                        <p >Signup</p>
                      </div>

                    </>

                  }

                </div>


              </div>
            </div>

          ) : null
        }
      </nav>
    </section >

  )
}

export default Header