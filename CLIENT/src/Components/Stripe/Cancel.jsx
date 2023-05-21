import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'

function Cancel() {

  const navigate = useNavigate()
  return (
    <section>
      <div className='text-black bg-white w-full h-screen flex justify-center items-center'>

        <div className='w-10/12 xl:w-1/2 h-1/2 border-gray-800 border-2 rounded-md'>
           
           <div className='flex  space-x-5 justify-center items-center w-full h-1/2'>
          <FontAwesomeIcon icon="window-close" className='xl:w-20 xl:h-20 h-10' />
          <h1 className='xl:text-4xl text-lg font-semibold'> Your Payment Cancelled</h1>
           </div>
           
           <hr  className='bg-white'/>

          <div className='w-full h-1/2 flex justify-center items-center space-x-5'>
                <button className='w-40 rounded-md text-base font-semibold h-12 bg-black text-white' onClick={()=> navigate("/requesttobook")}>Back to Booking</button>
                <button className='w-40 rounded-md text-base font-semibold h-12 bg-black text-white' onClick={()=> navigate("/")}>Back to Home</button>
          </div>

        </div>



      </div>
    </section>
  )
}

export default Cancel