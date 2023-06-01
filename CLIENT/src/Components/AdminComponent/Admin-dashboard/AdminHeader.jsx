import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { baseUrl } from '../../../Axios/api'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { authactions } from '../../../Redux/Auth/authSlice'

function AdminHeader() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isLoggedIn = useSelector((state) => state.user.isadminLoggedIn)
  const admin = useSelector((state) => state.user.admin)
 
  const adminLogout = async (e) => {
    try {
      const { data } = await baseUrl.get("/admin/logout", {
        withCredentials: true
      })

      if (data) {
        dispatch(authactions.adminLogOut())
        dispatch(authactions.removeAdmin())
        navigate("/admin/login")
      }

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(()=>{
    if(!isLoggedIn) navigate("/admin/login")
  },[navigate,dispatch,isLoggedIn])

  return (
    <section>
      <section>
        <div className='w-full h-24 pl-80 shadow-md shadow-stone-300 bg-white text-black stone-500 fixed top-0'>
          <div className='absolute right-10 h-full top-10  space-y-4'>

            {
              isLoggedIn &&
              <div onClick={adminLogout} className='flex items-center  cursor-pointer hover:text-red-600 font-bold text-md'>
                <FontAwesomeIcon icon="power-off" className='w-4 h-4  mr-2 mt-0.5' />
                Log out
              </div>
            }

          </div>
        </div>
      </section>
    </section>
  )
}

export default AdminHeader