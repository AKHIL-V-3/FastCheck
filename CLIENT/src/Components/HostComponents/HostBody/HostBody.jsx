import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authactions } from '../../../Redux/Auth/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Swal from 'sweetalert2'
import { hostInterceptor } from '../../helpers/jwtInterceptor'
import { baseUrl } from '../../../Axios/api'

// import Footer from "../../HomeComponents/Footer"

function HostBody() {

    const dispatch = useDispatch()

    const navigate = useNavigate()
    const [datas, setDatas] = useState([])

    const ishostLoggedIn = useSelector((state) => state.user.ishostLoggedIn)


    const getHoteldata = async () => {

        try {
            const { data } = await hostInterceptor.get("http://localhost:8000/host/gethoteldata", {
                withCredentials: true,
            })
            return data

        } catch (err) {

            console.log(err);
        }
    }



    const removeHotel = async (hotelId) => {
        try {
            await hostInterceptor.delete("http://localhost:8000/host/removehotel/" + hotelId, {
                withCredentials: true,
            }).then((response) => {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                        navigate("/host")
                    } else {
                        navigate('/host')
                    }
                })

            })

        } catch (err) {

            console.log(err);
        }


    }


    const getHotelData = async (hotelId) => {
        try {
            const { data } = await baseUrl.get("/host/getonehoteldata/" + hotelId, {
                withCredentials: true,
            })
            return data.response;
        } catch (err) {
            console.log(err);
        }
    }

    const editHotel = async (hotelId) => {
        const hotel = await getHotelData(hotelId)
        dispatch(authactions.setHotel(hotel[0]))
        navigate("/host/edithotel")

    }





    useEffect(() => {

        getHoteldata().then((data) => {
            setDatas(data)

        }).catch((err) => {

            console.log(err);
        })

        if (!ishostLoggedIn) navigate('/host/hostlogin')

    }, [ishostLoggedIn, navigate])

    return (
        <section>
            <div className=' bg-white h-full text-black'>
                <div className='flex justify-center pt-8'>
                    <div className=' w-11/12 flex justify-between mt-5 items-center'>

                        <h1 className='xl:text-3xl text-lg font-bold'>Listed Properties</h1>
                        <div onClick={() => navigate('/host/addhotel')} className=''>
                            <button className='xl:w-40 xl:h-12 w-30 h-10 bg-black rounded-md flex justify-center items-center text-white font-semibold text-md p-2  xl:font-semibold xl:text-lg'>Post My Property</button>
                        </div>
                    </div>

                </div>

                <div className='justify-center flex'>
                    <hr className='h-1 w-11/12 mt-6' />
                </div>



                <div className='max-h-full  flex flex-col items-center'>
                    <div className='w-11/12 h-full mt-20 space-y-10'>

                        <div className='xl:grid grid-cols-4 justify-between items-center gap-10 space-y-6 xl:space-y-3'>

                            {

                                datas?.map((item, index) => (

                                    <div>
                                        <div className='xl:w-80 w-full h-72 flex justify-end rounded-lg bg-slate-400 bg-cover' style={{ backgroundImage: `url(${item?.HotelImages[0]})` }} >
                                            {/* <FontAwesomeIcon icon="heart" className='me-3 mt-3 w-5 h-5 text-gray-800' /> */}
                                        </div>

                                        <div className='flex justify-between mt-4'>
                                            <div className='flex flex-col space-y-3'>
                                                <h1 className='font-semibold text-sm'>{item?.HotelName}</h1>
                                                <p className='font-semibold text-sm'>₹ {item.Price}<span className='font-thin ml-2'>night</span></p>


                                            </div>

                                            <div className='flex flex-col space-y-3 mt-1'>
                                                <button onClick={() => editHotel(item._id)} className='bg-black text-white  font-bold uppercase text-xs px-4 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all duration-150'>Modify</button>

                                                <button onClick={() => removeHotel(item._id)} className='bg-black text-white  font-bold uppercase text-xs px-4 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all duration-150'>Remove</button>

                                            </div>

                                        </div>


                                    </div>

                                ))
                            }

                        </div>



                    </div>
                </div>

                <footer>

                    <div className={`w-full h-16 border-t-2 border-gray-700 flex justify-center ${datas.length ===0 ? "mt-96" : "mt-40"}`}>

                        <div className='xl:w-11/12 w-full px-2 xl:px-0 h-full flex justify-between'>

                            <div className='flex items-center h-full xl:space-x-4 text-xs xl:text-base space-x-1'>
                                <p>© 2023 Inc.</p>
                                <p>·Privacy</p>
                                <p>·Terms</p>
                                <p>·Sitemap</p>
                                <p>·Company details</p>
                            </div>

                            <div className='flex items-center h-full xl:space-x-4 text-xs xl:text-base space-x-2'>

                                <FontAwesomeIcon icon="fa-globe" />
                                <p>English (IN)</p>
                                <p>₹  INR</p>


                                <div className='bg-white xl:w-5 xl:h-5 w-3 h-3  flex justify-center items-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16"> <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" fill="#000"></path> </svg>
                                </div>

                                <div className='bg-white xl:w-5 xl:h-5 w-3 h-3  flex justify-center items-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter" viewBox="0 0 16 16"> <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" fill="#000"></path> </svg>
                                </div>

                                <div className='bg-white xl:w-5 xl:h-5 w-3 h-3  flex justify-center items-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16"> <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" fill="#121212"></path> </svg>
                                </div>

                            </div>

                        </div>

                    </div>
                </footer>

            </div>
        </section>
    )
}

export default HostBody