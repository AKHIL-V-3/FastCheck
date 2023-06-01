import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { baseUrl } from '../../../Axios/api'

function Dashboard() {


  const [userCount, setUserCount] = useState(0)
  const [hostCount, setHostCount] = useState(0)
  const [bookingCount, setBookingCount] = useState(0)
  const [revenue, setRevenue] = useState(0)


  useEffect(() => {
    const getAdmin = async () => {
      try {
        const UserCount = await baseUrl.get("/admin/getusercount", {
          withCredentials: true
        })
        const HostCount = await baseUrl.get("/admin/gethostcount", {
          withCredentials: true
        })
        const BookingCount = await baseUrl.get("/admin/getbookingcount", {
          withCredentials: true
        })

        const Revenue = await baseUrl.get("/admin/getrevenue", {
          withCredentials: true
        })

        setUserCount(UserCount?.data?.userCount)
        setHostCount(HostCount?.data?.hostCount)
        setBookingCount(BookingCount?.data?.bookingCount)

        console.log(Revenue);
        setRevenue(Revenue?.data?.Revenue)
        


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
            <div className='flex justify-between  p-10'>
              <div className='w-80 h-44 bg-white relative p-2 rounded-md  z-10 shadow-lg shadow-stone-400'>
                <div className='flex justify-between items-start'>
                  <div>
                   <h1 className='text-3xl font-bold ml-2 mt-2'>Users</h1>
                    <h1 className='text-5xl font-semibold ml-5 mt-4'>{userCount}</h1>
                    <div className='ml-5 mt-3'>
                      <p className='text-lg font-semibold'>Total number of Users</p>
                    </div>
                  </div>
                  <FontAwesomeIcon icon="user" className='w-6 h-6 mr-5 mt-5' />
                </div>
              </div>

              <div className='w-80 h-44 bg-white relative p-2 rounded-md  z-10 shadow-lg shadow-stone-400'>
                <div className='flex justify-between items-start'>
                  <div>
                  <h1 className='text-3xl font-bold ml-2 mt-2'>Hosts</h1>
                    <h1 className='text-5xl font-semibold ml-4 mt-4'>{hostCount}</h1>

                    <div className='ml-5 mt-3'>
                      <p className='text-lg font-semibold'>Total number of Hosts</p>
                    </div>
                  </div>
                  <FontAwesomeIcon icon="hotel" className='w-6 h-6 mr-5 mt-5' />
                </div>
              </div>


              <div className='w-80 h-44 bg-white relative p-2 rounded-md z-10 shadow-lg shadow-stone-400'>
                <div className='flex justify-between items-start'>
                  <div>
                  <h1 className='text-3xl font-bold ml-2 mt-2'>Booking</h1>

                    <h1 className='text-5xl font-semibold ml-5 mt-4'>{bookingCount}</h1>

                    <div className='ml-5 mt-3'>
                      <p className='text-lg font-semibold'>Total number of Booking</p>
                    </div>
                  </div>
                  <FontAwesomeIcon icon="bar-chart" className='w-6 h-6 mr-5 mt-5' />
                </div>
              </div>
            </div>


            <div className='flex justify-between  p-10'>
              <div className='w-80 h-44 bg-white relative rounded-md p-2 z-10 shadow-lg shadow-stone-400'>
                <div className='flex justify-between items-start'>
                  <div>
                    <h1 className='text-3xl font-bold ml-5 mt-2'>Revenue</h1>
                    <h1 className='text-3xl font-bold ml-5 mt-4'>₹ {revenue}</h1>
                    <div className='ml-5 mt-3'>
                      <p className='text-lg font-semibold'>Total Revenue</p>
                    </div>
                  </div>
                  <FontAwesomeIcon icon="money-check" className='w-6 h-6 mr-5 mt-5' />
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