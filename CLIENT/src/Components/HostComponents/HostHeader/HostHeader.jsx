import React,{useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom';
import {  useSelector,useDispatch } from 'react-redux';
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
      const { data } = await baseUrl.get("/host", {
        withCredentials: true
      }).catch((err) => {
        console.log(err.message);
      })
      return data
    }

  const sendLogoutReq =async()=>{
    const response = await hostInterceptor.post("/host/logout",null,{
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
          </div>
          <div className='flex absolute xl:right-16 right-8'>
          {/* <div onClick={() => navigate('/host/hostlogin')} className=' w-40 h-10 rounded-3xl border border-gray-900 shadow-md xl:flex justify-center items-center cursor-pointer hidden'>
              <p className='font-medium '>Become a Host</p>
            </div> */}

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

            <div className='bg-white w-40 h-auto border-stone-200 border-2 absolute right-8 xl:right-16 xl:flex flex-col space-y-2 items-center mt-1 rounded-md pt-1 shadow-md shadow-gray-400'>

              <div className='flex flex-col items-start space-y-2 w-full pb-2'>

                    <div className='flex flex-col item-start space-y-2 w-full'>
                    <div className='hover:bg-slate-300 w-full h-10 pl-3 flex items-center'>
                      <p className='cursor-pointer' onClick={()=>navigate("/host/messages")} >Messages</p>
                    </div>
                    <div className='hover:bg-slate-300 w-full h-10 pl-3 flex items-center'>
                      <p className='cursor-pointer' onClick={()=>navigate("/host/reservationlist")}>Reservations</p>
                    </div>
                    <div className='hover:bg-slate-300 w-full h-10 pl-3 flex items-center'>
                    <p className='cursor-pointer' >Account</p>
                  </div>

                  <div className='hover:bg-slate-300 w-full h-10 pl-3 flex items-center'>
                    <p onClick={handleLogout} className='cursor-pointer'>Log out</p>
                  </div>


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