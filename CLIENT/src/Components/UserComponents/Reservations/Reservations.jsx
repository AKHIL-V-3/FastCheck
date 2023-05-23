import React from 'react'
import jwtInterceptor from '../../helpers/jwtInterceptor'
import { useEffect } from 'react'
import { useState } from 'react'
import Swal from 'sweetalert2'
import { baseUrl } from '../../../Axios/api'
import { useNavigate } from 'react-router-dom'

function Reservations() {
    const [reservations, setReservations] = useState([])
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const formattedDate = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
        return formattedDate
    }
    reservations.map((hotel) => {
        hotel.BookingDetails.CheckIn = formatDate(hotel?.BookingDetails?.CheckIn)
        hotel.BookingDetails.CheckOut = formatDate(hotel?.BookingDetails?.CheckOut)
    })
    const cancelReservation = async (BookingId) => {
        try {
            Swal.fire({
                title: 'Do you want to cancel the reservation?',
                showDenyButton: true,
                confirmButtonText: 'Yes',
                denyButtonText: `No`,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { data } = await baseUrl.patch("/trips/cancelreservation/" + BookingId, {
                        withCredentials: true
                    })
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Your Reservation Canceled',
                        showConfirmButton: false,
                        timer: 3000
                    })
                    setTimeout(() => {
                        window.location.reload()
                    }, 3100)
                }
            })

        } catch (error) {

        }
    }
    useEffect(() => {
        const getReservations = async () => {
            const { data } = await jwtInterceptor.get("http://localhost:5000/trips", {
                withCredentials: true
            })
            setReservations(data.response)
        }
        getReservations()
    }, [])

    const filterReservation = async (e) => {
        const value = e.target.value
        const { data } = await jwtInterceptor.get("http://localhost:5000/filteredtrips/" + value, {
            withCredentials: true
        })

        setReservations(data.response)
    }

    const navigate = useNavigate()

    return (
        <section>
            <div className='bg-white text-black h-full pt-24 flex justify-center pb-20 '>


                <div className='w-11/12'>
                    <div className='flex justify-between'>
                        <div className='mb-12'>
                            <h1 className='text-3xl font-bold'>Reservations</h1>
                        </div>

                        <div className='flex items-center space-x-5'>
                            <div>
                                <button onClick={()=> navigate("/paymenthistory")} className='px-3 py-2 border border-gray-300'>Payment history</button>
                            </div>

                            <div className='flex space-x-6 items-center'>

                                <div className='border-gray-300 border pe-2'>
                                    <select id="countries" onChange={filterReservation} className=" border-none outline-none  text-sm  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                                        <option selected >Filter</option>
                                        <option value="Booked" >Booked</option>
                                        <option value="All">All</option>
                                        <option value="Canceled">Canceled</option>
                                    </select>
                                </div>
                                
                            </div>
                        </div>
                    </div>

                    {
                        reservations?.length > 0 ?


                            <div className='xl:grid xl:grid-cols-4 xl:gap-10 space-y-10 xl:space-y-0'>
                                {
                                    reservations.map((Hotel) => (
                                        <div>
                                            <div className='xl:w-80 w-full h-72 flex justify-end rounded-lg bg-slate-400 bg-cover duration-200' style={{ backgroundImage: `url("${Hotel?.HotelDetails?.HotelImage}")` }} >
                                            </div>
                                            <div className='flex flex-col space-y-1 mt-3'>
                                                <h1 className='font-semibold text-base'>{Hotel?.HotelDetails?.HotelName}</h1>
                                                <p className='opacity-70'>{Hotel.BookingDetails.CheckIn} - {Hotel.BookingDetails.CheckOut}</p>
                                                <p className='font-semibold'>₹ {Hotel.BookingDetails.totalCost}</p>
                                                {Hotel.Booking === "Booked" ? <button onClick={() => cancelReservation(Hotel._id)} className='bg-black text-white  font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all duration-150'>Cancel Reservation</button> : <button className='bg-gray-400 text-gray-800  font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all duration-150'>Cancel Reservation</button>}
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            :

                            <div className='w-full bg-white text-gray-400 h-full flex justify-center items-center pb-96'>
                                <h1 className='font-bold text-8xl mt-6'>No Reservations</h1>
                            </div>
                    }
                </div>

            </div>
        </section>
    )
}

export default Reservations