import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch, useSelector } from 'react-redux'
import { authactions } from '../../../Redux/Auth/authSlice'
import searchHotel from './Posts'
import { useState } from 'react'
import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

function Banner() {

    const dispatch = useDispatch()
    const [input,setInput] = useState("")
    const [serachhotels,setSearchHotels] = useState([])
     const navigate = useNavigate()
    const hotels = useSelector(state=> state.user.homeHotels)
    
const search = (e)=>{
     const searchInput = e.target.value
     setInput(searchInput) 
}

const searchHotel = ()=>{
    dispatch(authactions.setSearchInput(input))
    setSearchHotels(hotels?.filter(hotel => {
      if (hotel.HotelName.toLowerCase().includes(input.toLowerCase())) {
          return hotel
      }
  })) 
  dispatch(authactions.setsearchHotels(serachhotels))
   navigate("/")
}
 
// https://heavensportfolio.com/uploads/asia-me/tajm01.jpg
// https://sayajihotels.com/images/innerBanner/sayaji-pune-overview/banner3.jpg

    return (

        <section className='h-96' >
            <div className='h-full  w-full max-w-full text-black relative bg-cover' style={{ backgroundImage:'url("https://sayajihotels.com/images/innerBanner/sayaji-pune-overview/banner3.jpg")' }}>
                <div className='flex justify-center items-end h-full pb-12' >
                    <div className='flex flex-col justify-between h-24'>
                    <h1 className='text-4xl font-bold text-white'>Find</h1>
                    <div className='bg-white w-96 h-12 rounded-2xl relative flex items-center'>
                        <input type="text" onChange={search} placeholder='Search Here . . . . .' className='h-full w-11/12 outline-none rounded-2xl bg-white border-none text-black p-4 relative flex items-center' />
                        <FontAwesomeIcon icon="search" className='absolute right-3' onClick={searchHotel} />
                    </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner