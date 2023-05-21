import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Swal from 'sweetalert2'
function Success() {

    const navigate = useNavigate()

    useEffect(()=>{

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Payment Successful',
            showConfirmButton: true,
          })
          .then((result)=>{

               if(result.isConfirmed){
                 
                    navigate("/trips")
               }
          })
    },[])
  return (
    <div className='bg-white'>

        
        
    </div>
  )
}

export default Success