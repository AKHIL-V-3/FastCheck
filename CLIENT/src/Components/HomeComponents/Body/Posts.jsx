import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector, } from 'react-redux';
import { authactions } from '../../../Redux/Auth/authSlice';
import Pagination from './Pagination'
import { baseUrl } from '../../../Axios/api'


function Posts() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setpostsPerPage] = useState(12)
  const [rating,setRating] = useState([])
  const searchHotels = useSelector(state => state.user.searchHotels)
 
  const GetAllHotels = async () => {
    const { data } = await baseUrl.get("/getallhotels", {
      withCredentials: true
    }).catch((err) => {
      console.log(err);
      console.log(err.message);
    })
    return data
  }

  const [hotels, setHotels] = useState([])

  const getHotelData = async (hotelId) => {

    const { data } = await baseUrl.get("/getonehotel/" + hotelId, {
      withCredentials: true
    }).catch((err) => {
      console.log(err,);
      console.log(err.message);
    })

    if (data) {
      navigate("/singlepage")
      dispatch(authactions.removeHotelData())
      dispatch(authactions.setHotelData(data.response))
    }
  }

  useEffect(() => {
    GetAllHotels().then((data) => {
      setHotels(data.response)
      dispatch(authactions.setHomeHotels(data.response))
      dispatch(authactions.setsearchHotels(data.response))

    })

    return () => {

      dispatch(authactions.removesearchHotels())
    }

  }, [dispatch])

  const lastpostIndex = currentPage * postsPerPage
  const firstPostIndex = lastpostIndex - postsPerPage
  const currentPosts = searchHotels?.slice(firstPostIndex, lastpostIndex)

  useEffect(() => {

    const getAllRating = async () => {

      const ratingArray = await Promise.all(currentPosts?.map(async (hotel) => {
        try {
          const { data } = await baseUrl.get("/review/rating/" + hotel._id, {
            withCredentials: true
          })

          return data

        } catch (err) {
          console.log(err);
        }
      }))
      setRating(ratingArray)
    }

    getAllRating()

  }, [])


  return (

    <section>
      <div className='bg-white text-black h-full flex flex-col items-center'>
        <div className='w-11/12 mt-20 items-center flex flex-col  space-y-10'>
          <div className='space-y-4 xl:w-full md:w-full'>
            <h1 className='text-3xl font-semibold'>Property Listing</h1>
            <hr className='h-1 bg-black w-64' />
          </div>
          <div className='grid grid-cols-1 xl:grid-cols-4 w-full  md:grid-cols-2 md:gap-6 xl:gap-12 space-y-6 md:space-y-0 xl:space-y-0'>

            {
              currentPosts?.map((hotel, index) => (

                <div onClick={() => getHotelData(hotel._id)}>
                  <div className='xl:w-80 w-full h-72 flex justify-end rounded-lg bg-slate-400 bg-cover duration-200' style={{ backgroundImage: `url(${hotel?.HotelImages[0]})` }} >
                    <FontAwesomeIcon icon="heart" className='me-3 mt-3 w-5 h-5 text-gray-800' />
                  </div>
                  <div className='flex flex-col space-y-1 mt-2'>
                    <div className='flex justify-between'>
                      <h1 className='font-semibold text-sm'>{hotel?.HotelName}</h1>
                      <div className='flex items-center space-x-1'>
                        <FontAwesomeIcon icon="star" />
                        <p key={hotel?._id}>{rating[index]?.rating}</p>
                      </div>
                    </div>
                    {/* <p className='opacity-70'>25 Apr - 1 May</p> */}
                    <p className='font-semibold'>₹ {hotel?.Price}<span className='font-semibold opacity-80 ml-2'>night</span></p>
                  </div>
                </div>

              ))

            }





          </div>

          <div className='pt-20'>
            <Pagination totalPosts={searchHotels?.length} postPerPage={postsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} />
          </div>


        </div>

        <div className='bg-red-500 w-full h-96 mt-20 flex items-center justify-center bg-cover' style={{ backgroundImage: 'url("https://heavensportfolio.com/uploads/asia-me/tajm01.jpg")' }}>
          <div className='flex flex-col w-11/12 space-y-8 text-white '>
            <h1 className='text-3xl font-semibold'>Try Hosting With Us</h1>
            <p className='xl:w-1/2'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit pariatur et illum incidunt asperiores tempora! Labore, quod eligendi voluptatem quas maxime eius, repellendus adipisci placeat ipsum fugit, suscipit sed minus.</p>
            <div className='bg-white w-40 h-10 rounded-3xl text-black  flex justify-center items-center cursor-pointer'>
              <p className='font-medium'>Become a Host</p>
            </div>

          </div>

        </div>

      </div>
    </section>


  )
}

export default Posts