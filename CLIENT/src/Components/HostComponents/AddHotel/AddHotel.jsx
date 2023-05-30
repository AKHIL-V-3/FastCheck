import React, { useState } from 'react'
import { useFormik } from 'formik'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Yup from 'yup'
import { useEffect } from 'react';
import { useRef } from 'react';
import { baseUrl } from '../../../Axios/api';
import { Rings } from 'react-loader-spinner'
function AddHotel() {

  const navigate = useNavigate()

  const HotelImgaeUpload = async (images) => {

    const HotelImgaeUrls = []

    for (let key in images) {
      const image = images[key]

      try {
        const formData = new FormData()
        formData.append("file", image)
        formData.append("upload_preset", "HotelImages")
        formData.append("cloud_name", "dllnmynn6")
        const res = await axios.post("https://api.cloudinary.com/v1_1/dllnmynn6/image/upload", formData)

        HotelImgaeUrls.push(res.data.secure_url)

      } catch (err) {

        console.log(err);
      }

    }
    return HotelImgaeUrls

  }

  const RoomImgaeUpload = async (images) => {
    const ImgaeUrls = []
    for (let key in images) {
      const image = images[key]
      try {
        const formData = new FormData()
        formData.append("file", image)
        formData.append("upload_preset", "RoomImages")
        formData.append("cloud_name", "dllnmynn6")
        const res = await axios.post("https://api.cloudinary.com/v1_1/dllnmynn6/image/upload", formData)
        ImgaeUrls.push(res.data.secure_url)
      } catch (err) {
        console.log(err);
      }
    }
    return ImgaeUrls
  }

  const [isLoading, setIsLoading] = useState(false);
  const [roomimageUrl, setroomImageUrl] = useState([]);
  const [hotelimageUrl, sethotelimageUrl] = useState([]);

  const handleroomImage = (e) => {
    const imgs = e.target.files
    const newImages = []
    for (let i = 0; i < imgs.length; i++) {
      const file = imgs[i];
      const url = URL.createObjectURL(file);
      newImages.push(url);
    }
    setroomImageUrl(newImages)
    formik.setFieldValue("roomImages", e.target.files)
  }


  const handlehotelImage = (e) => {
    const imgs = e.target.files
    const newImages = []
    for (let i = 0; i < imgs.length; i++) {
      const file = imgs[i];
      const url = URL.createObjectURL(file);
      newImages.push(url);
    }
    sethotelimageUrl(newImages)
    formik.setFieldValue("hotelImages", e.target.files)
  }




  const handleSubmit = async () => {
    setIsLoading(true)
    const { hotelImages, roomImages, HotelName, noOfRooms, RoomType, Address, price, Television, Wifi, Parking, Ac, FireThrower, Smokedetector, DailyCleaner, sanitizer } = formik.values
    const HotelImg = await HotelImgaeUpload(hotelImages)
    const RoomImg = await RoomImgaeUpload(roomImages)

    const safety = {
      FireThrower,
      Smokedetector,
      DailyCleaner,
      sanitizer
    }
    const amenities = {
      Television,
      Wifi,
      Parking,
      Ac
    }
    const HotelFacilities = { amenities, safety }
    const HotelData = {
      HotelName,
      NumberofRooms: noOfRooms,
      RoomType: RoomType,
      HotelAddress: address,
      Price: price,
      HotelFacilities,
      HotelImages: HotelImg,
      RoomImages: RoomImg
    }
    try {
      const { data } = await baseUrl.post("/host/addhotel", HotelData, {
        withCredentials: true,
      }
      )
      if (data) {
        setIsLoading(false)
        navigate("/host")
      }
    } catch (err) {
    }
  }

  const [address, setAddress] = useState({})

  const formik = useFormik({
    initialValues: {
      HotelName: "",
      noOfRooms: "",
      RoomType: null,
      price: "",
      hotelImages: [],
      roomImages: [],
      Television: false,
      Wifi: false,
      Parking: false,
      Ac: false,
      sanitizer: false,
      FireThrower: false,
      Smokedetector: false,
      DailyCleaner: false

    },

    validationSchema: Yup.object({
      HotelName: Yup.string().max(60, "Must be 60 Characters or less").required("Required"),
      noOfRooms: Yup.number().max(50, "Must be 50 rooms or less").required("Required"),
      price: Yup.number().max(50000, "Enter the amount for one night").required("Required"),
      RoomType: Yup.string().max(20, "Must be 50 rooms or less").required("Required"),

    }),

    onSubmit: (values) => {
      handleSubmit()
    }
  })

  const [place, setPlace] = useState([])
  const [suggessions, setSuggessions] = useState(false)

  const searchInput = useRef(null)
  const getPlace = async (e) => {
    const places = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchInput.current.value}.json?proximity=ip&access_token=pk.eyJ1IjoiYWtoaWx2MDMzIiwiYSI6ImNsaDdnaGM0dzA5OGkzZ3BpaDdlejZuanYifQ.-FRRw7jUSm6r0TwReFdTTw`)
    console.log(places);
    setPlace(places.data.features)
    setSuggessions(true)
  }

  const assignValue = (index) => {
    setAddress(place[index])
    searchInput.current.value = place[index].place_name
    setSuggessions(false)
  }

  useEffect(() => {
  }, [])

  return (

    <section>
     
    {

      isLoading ? 

      <div className='w-full h-screen flex justify-center items-center'>
        <Rings
        height="80"
        width="80"
        color="#4fa94d"
        radius="6"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="rings-loading"
      />
      </div>


      :
      
      
      
      <div className='bg-white w-full h-auto p-8 text-black items-start xl:flex  justify-center space-x-3'>

      <div className='bg-white h-auto w-full  flex-col items-center justify-center xl:w-1/2 xl:border-black xl:border-2 rounded-md'>

        <form action="" onSubmit={formik.handleSubmit} encType="multipart/form-data" className='space-y-8 xl:space-y-6' >

          <div className='xl:m-8 rounded-xl xl:flex  justify-between items-center'>

            <label htmlFor="">Enter Hotelname</label>

            <div>
              <input type="text" name='HotelName' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.HotelName} className="mt-3 xl:mt-0 w-full xl:w-80 h-11 bg-white border border-black text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Hotel Name" required ></input>
              {formik.touched.HotelName && formik.errors.HotelName ? <p className='text-red-600 text-sm'>{formik.errors.HotelName}</p> : null}
            </div>
          </div>

          <div className='xl:m-8 rounded-xl xl:flex justify-between items-center'>
            <label htmlFor="">Enter Total Rooms</label>
            <div>
              <input type="Number" name='noOfRooms' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.noOfRooms} className=" mt-3 xl:mt-0 w-full xl:w-80 h-11 bg-white border border-black text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Number of rooms available in your Hotel" required ></input>
              {formik.touched.noOfRooms && formik.errors.noOfRooms ? <p className='text-red-600 text-sm'>{formik.errors.noOfRooms}</p> : null}
            </div>
          </div>


          <div className='xl:m-8 rounded-xl xl:flex justify-between items-center'>
            <label htmlFor="">Room Type</label>
            <div>
              <select name='RoomType' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.RoomType} className=' mt-3 xl:mt-0 w-full xl:w-80 h-11 bg-white border border-black text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 '>
                <option value="Ac">Ac</option>
                <option value="Non Ac">Non Ac</option>
              </select>
              {formik.touched.RoomType && formik.errors.RoomType ? <p className='text-red-600 text-sm'>{formik.errors.RoomType}</p> : null}
            </div>

          </div>

          <div className='xl:m-8 rounded-xl xl:flex justify-between items-center'>

            <label htmlFor="">Enter Price</label>

            <div>
              <input type="Number" name='price' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.price} className=" mt-3 xl:mt-0 w-full xl:w-80 h-11 bg-white border border-black text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter the price for one night" required ></input>
              {formik.touched.price && formik.errors.price ? <p className='text-red-600 text-sm'>{formik.errors.price}</p> : null}
            </div>
          </div>

          <div className='xl:ml-8 xl:mt-8 xl:me-8 rounded-xl xl:flex justify-between items-center'>
            <div>
              <label htmlFor="">Enter Hotel Address</label>
            </div>

            <div className='xl:w-80 w-full bg-white text-black rounded-md border-black'>

              <div className='mt-3 xl:mt-0 w-full xl:w-full h-11 border border-black rounded-lg flex justify-between items-center'>
                <input ref={searchInput} onKeyUp={getPlace} type="text" name='Address' className="w-11/12 outline-none h-full  p-2 bg-white text-black text-sm rounded-lg  dark:text-white" placeholder={`Type the address here......  `} required />
                <FontAwesomeIcon icon="location" className='w-4 h-4 me-3' />
              </div>

            </div>
          </div>
          <div className='w-full justify-end flex mt-1'>
            {
              suggessions &&
              <div className='xl:w-80 w-full h-auto bg-white text-black rounded-bl-md rounded-br-md border-2 border-gray-800 z-50  justify-center xl:me-8'>
                <div className='space-y-3 w-auto h-auto m-3'>
                  {
                    place.map((value, index) => (
                      <div key={index} onClick={() => assignValue(index)} className='flex items-center space-x-2 hover:bg-gray-100 cursor-pointer'>
                        <FontAwesomeIcon icon="location" className='w-3 h-3 pl-2' />
                        <p >{value?.place_name}</p>
                      </div>
                    ))
                  }
                </div>
              </div>
            }
          </div>

          <div className='xl:m-8 rounded-xl xl:flex justify-between items-center'>
            <label htmlFor="">Upload Hotel Images</label>
            <input type="file" name='hotelImages' onChange={handlehotelImage} className="mt-3 xl:mt-0 w-full xl:w-80 h-11  border border-black text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="upload Hotel Images(minimum 6)" multiple required />
          </div>
          <div className='xl:m-8 rounded-xl xl:flex justify-between items-center'>
            <label htmlFor="">Upload Room Images</label>
            <input type="file" name='roomImages' onChange={handleroomImage} className="mt-3 xl:mt-0 w-full xl:w-80 h-11  border border-black text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="upload Hotel Images(minimum 6)" multiple required />
          </div>
          <div className='xl:flex justify-around items-center w-full space-y-6 xl:space-y-0'>
            <div className='xl:m-8 m-2 w-full'>
              <h3 class="mb-4 font-semibold text-black dark:text-black">Amenities</h3>
              <ul class="xl:w-48  w-full text-sm font-medium text-black bg-white border-2 border-black rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-900">
                  <div class="flex items-center pl-3">
                    <input id="Television" name='Television' type="checkbox" onChange={formik.handleChange} value={formik.values.Television} class="w-4 h-4   text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                    <label for="vue-checkbox" class="w-full py-3 ml-2 text-sm font-medium  dark:text-gray-300">Television</label>
                  </div>
                </li>
                <li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  <div class="flex items-center pl-3">
                    <input id="Wifi" name='Wifi' type="checkbox" onChange={formik.handleChange} value={formik.values.Wifi} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                    <label for="react-checkbox" class="w-full py-3 ml-2 text-sm font-medium  dark:text-gray-300">Wifi</label>
                  </div>
                </li>
                <li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  <div class="flex items-center pl-3">
                    <input id="Parking" name='Parking' type="checkbox" onChange={formik.handleChange} value={formik.values.Parking} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                    <label for="angular-checkbox" class="w-full py-3 ml-2 text-sm font-medium  dark:text-gray-300">Parking</label>
                  </div>
                </li>
                <li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  <div class="flex items-center pl-3">
                    <input id="Ac" name='Ac' onChange={formik.handleChange} value={formik.values.Ac} type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                    <label for="laravel-checkbox" class="w-full py-3 ml-2 text-sm font-medium  dark:text-gray-300">Ac</label>
                  </div>
                </li>
              </ul>
            </div>

            <div className='xl:m-8 m-2 w-full'>
              <h3 class="mb-4 font-semibold text-black dark:text-black">Safety</h3>
              <ul class="xl:w-48  w-full  text-sm font-medium text-black bg-white border-2 border-black rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  <div class="flex items-center pl-3">
                    <input id="sanitizer" name='sanitizer' type="checkbox" onChange={formik.handleChange} value={formik.values.sanitizer} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                    <label for="vue-checkbox" class="w-full py-3 ml-2 text-sm font-medium  dark:text-gray-300">Sanitizer</label>
                  </div>
                </li>
                <li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  <div class="flex items-center pl-3">
                    <input id="FireThrower" name='FireThrower' type="checkbox" onChange={formik.handleChange} value={formik.values.FireThrower} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                    <label for="react-checkbox" class="w-full py-3 ml-2 text-sm font-medium  dark:text-gray-300">FireThrower</label>
                  </div>
                </li>
                <li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  <div class="flex items-center pl-3">
                    <input id="angular-checkbox" name='Smokedetector' type="checkbox" onChange={formik.handleChange} value={formik.values.Smokedetector} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                    <label for="angular-checkbox" class="w-full py-3 ml-2 text-sm font-medium  dark:text-gray-300">Smoke detector</label>
                  </div>
                </li>
                <li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  <div class="flex items-center pl-3">
                    <input id="laravel-checkbox" name='DailyCleaner' type="checkbox" onChange={formik.handleChange} value={formik.values.DailyCleaner} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                    <label for="laravel-checkbox" class="w-full py-3 ml-2 text-sm font-medium  dark:text-gray-300">Daily cleaner</label>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className='flex justify-center w-full'>
            <button type='submit' className='bg-black    text-white p-2 rounded-3xl w-full xl:w-3/4 font-semibold mb-10'>Submit</button>
          </div>
        </form>
        
        
      </div>
      <div className='flex flex-col xl:w-1/2 w-full'>
        <h1 className='font-bold text-lg ml-2'>Hotel Images</h1>
        <div className='bg-white  h-full border-white border-2 xl:flex xl:flex-wrap p-2 m-2 justify-between space-y-2'>
          {
            hotelimageUrl.map((image, index) => (
              <React.Fragment>
                <div className='bg-yellow-900 w-56'>
                  <img src={image} className='w-full h-full' alt="" />
                </div>

              </React.Fragment>
            ))
          }
        </div>
        <h1 className='font-bold text-lg ml-2'>Room Images</h1>
        <div className='bg-white  h-full border-white border-2 xl:flex flex-wrap p-2 m-2 justify-between space-y-2'>
          {
            roomimageUrl.map((image, index) => (
              <React.Fragment>
                <div className='bg-yellow-900 w-56'>
                  <img src={image} className='w-full h-full' alt="" />
                </div>

              </React.Fragment>
            ))
          }
        </div>
      </div>
    </div>}
    </section>
  )
}

export default AddHotel