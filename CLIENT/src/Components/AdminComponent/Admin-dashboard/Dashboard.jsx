import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { baseUrl } from '../../../Axios/api'

function Dashboard() {


  const [userCount,setUserCount] =useState(0)
  const [hostCount,setHostCount] =useState(0)
  const [bookingCount,setBookingCount] =useState(0)
    

  useEffect(() => {
    const getAdmin = async () => {
        try {
            const UserCount = await baseUrl.get("/admin/getusercount", {
                withCredentials: true
            })
            const HostCount= await baseUrl.get("/admin/gethostcount", {
              withCredentials: true
          })
          const BookingCount = await baseUrl.get("/admin/getbookingcount", {
            withCredentials: true
        })

            setUserCount(UserCount?.data?.userCount)
            setHostCount(HostCount?.data?.hostCount)
            setBookingCount(BookingCount?.data?.bookingCount)

        } catch (err) {
            console.log(err);
        }
    }
    getAdmin()
}, [])

  return (
    <section>
        <div className='h-screen text-black pl-80 pt-24'>
              <div className='w-full h-full flex justify-center'>

                <div className='w-full '>

                    <div className='flex justify-between gap-5 p-10'>

                        <div className='w-80 h-52 bg-white relative  z-10 shadow-lg shadow-stone-400'>

                           <div className='flex justify-between items-center'>

                           <div>
                           <h1 className='text-5xl font-semibold ml-5 mt-5'>{userCount}</h1>
                            
                            <div className='ml-5 mt-3'>
                            <p className='text-lg font-semibold'>Total number of Users</p>
                            </div>
                           </div>

                             <FontAwesomeIcon icon="user" className='w-6 h-6 mr-5'/>

                            </div> 


                            <div className='bg-blue-400 absolute bottom-0 right-0 left-0 w-full h-16'>

                            </div>


                        </div>

                        <div className='w-80 h-52 bg-white relative  z-10 shadow-lg shadow-stone-400'>

                           <div className='flex justify-between items-center'>

                           <div>
                           <h1 className='text-5xl font-semibold ml-5 mt-5'>{hostCount}</h1>
                            
                            <div className='ml-5 mt-3'>
                            <p className='text-lg font-semibold'>Total number of Hosts</p>
                            </div>
                           </div>

                             <FontAwesomeIcon icon="hotel" className='w-6 h-6 mr-5'/>

                            </div> 


                            <div className='bg-blue-400 absolute bottom-0 right-0 left-0 w-full h-16'>

                            </div>


                        </div>


                        <div className='w-80 h-52 bg-white relative  z-10 shadow-lg shadow-stone-400'>

                           <div className='flex justify-between items-center'>

                           <div>
                           <h1 className='text-5xl font-semibold ml-5 mt-5'>{bookingCount}</h1>
                            
                            <div className='ml-5 mt-3'>
                            <p className='text-lg font-semibold'>Total number of Booking</p>
                            </div>
                           </div>

                             <FontAwesomeIcon icon="bar-chart" className='w-6 h-6 mr-5'/>

                            </div> 


                            <div className='bg-blue-400 absolute bottom-0 right-0 left-0 w-full h-16'>

                                <div className='w-10/12 text-white'>

                                </div>

                            </div>


                        </div>



                    </div>

                </div>

              </div>
        </div>
    </section>
  )
}

export default Dashboard