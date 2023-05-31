import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { baseUrl } from '../../../Axios/api'
import {  useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Sidebar() {

    const navigate = useNavigate()

    const admin = useSelector(state=> state.user.admin)


    console.log(admin);

   
    const adminName = admin?.Email?.split('@')[0].toUpperCase()

    return (
        <section>
            <div className='bg-white h-screen w-80 shadow-lg fixed z-10 shadow-stone-500'>
                <nav>
                    <div className='h-32 w-full flex justify-center items-center border border-b-stone-100'>
                        <div>
                            <div className='w-20 h-20 rounded-full bg-black'></div>
                            <h1 className='ml-3 font-bold text-lg'>{adminName}</h1>
                        </div>
                    </div>
                </nav>
                <div className='w-full h-full'>
                    <div className='mt-6'>
                        <div className=' border border-stone-300 py-8 h-14 pl-8 cursor-pointer w-full flex items-center justify-start space-x-6 hover:bg-stone-200'>
                            <FontAwesomeIcon icon="home" className='w-6 h-6' />
                            <h1 className='text-xl font-bold'>Dashboard</h1>
                        </div>
                        {/* <div className=' border border-stone-300 py-8 h-14 pl-8 cursor-pointer w-full flex items-center justify-start space-x-6 hover:bg-stone-200'>
                            <FontAwesomeIcon icon="user" className='w-6 h-6' />
                            <h1 className='text-xl font-bold'>Users</h1>
                        </div>

                        <div className=' border border-stone-300 py-8 h-14 pl-8 cursor-pointer w-full flex items-center justify-start space-x-6 hover:bg-stone-200'>
                            <FontAwesomeIcon icon="hotel" className='w-6 h-6' />
                            <h1 className='text-xl font-bold'>Hosts</h1>
                        </div> */}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Sidebar