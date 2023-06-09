import React,{useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom';
import {  useSelector,useDispatch } from 'react-redux';
import { authactions } from '../../../Redux/Auth/authSlice';
import { baseUrl } from '../../../Axios/api';


function HostHeader() {

    const [toggle, setToggle] = useState(false)
    const handleToggle = () => {
      setToggle(!toggle)
    }
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoggedIn = useSelector((state) => state.user.ishostLoggedIn)
  
    const apiCall = async () => {
      const { data } = await baseUrl.get("/host", {
        withCredentials: true
      }).catch((err) => {
        console.log(err.message);
      })
      console.log(data);
      return data
    }

  const sendLogoutReq = async()=>{
    try{
      const response = await baseUrl.get("/host/logout",{
        withCredentials: true
      })

       return response
      
    }catch(err){
       console.log(err);
    } 
  }

  const handleLogout = async()=>{
 
    sendLogoutReq().then((response) => {
      if (response) {
        dispatch(authactions.hostLogOut())
        dispatch(authactions.removeHost())
        navigate('/host/hostlogin')
      }
    }).catch(err => {
      console.log(err)
    });
  }
  useEffect(()=>{
       apiCall().then(data => {
         if (data) {
           dispatch(authactions.hostLogin())
           dispatch(authactions.setHost(data))
         }
       }).catch((err)=>console.log(err))
     if(!isLoggedIn) navigate('/host/hostlogin')      
  },[dispatch,isLoggedIn,navigate])

    return (
    <section className='sticky top-0 z-40 '>
      <nav className='bg-white text-black h-auto shadow-md shadow-gray-400'>
        <div className='flex items-center justify-start h-20 xl:ml-10 ml-5 relative'>
          <div onClick={()=> navigate("/host")} className='font-extrabold cursor-pointer text-3xl xl:text-4xl'>Fastcheck-in</div>
          <div className='xl:flex justify-evenly items-center w-4/12 hidden'>            
          </div>
          <div className='flex absolute xl:right-16 right-8'>
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
                    <div  onClick={()=>navigate("/host/messages")} className='cursor-pointer hover:bg-slate-300 w-full h-10 pl-3 flex items-center'>
                      <p className='cursor-pointer' >Messages</p>
                    </div>
                    <div onClick={()=>navigate("/host/reservationlist")} className='cursor-pointer hover:bg-slate-300 w-full h-10 pl-3 flex items-center'>
                      <p className='cursor-pointer' >Reservations</p>
                    </div>
                    <div className='hover:bg-slate-300 w-full h-10 pl-3 flex cursor-pointer items-center'>
                    <p className='cursor-pointer' >Account</p>
                  </div>

                  <div onClick={handleLogout} className=' cursor-pointer hover:bg-slate-300 w-full h-10 pl-3 flex items-center'>
                    <p  className='cursor-pointer'>Log out</p>
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