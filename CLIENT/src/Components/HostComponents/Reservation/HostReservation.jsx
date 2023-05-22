import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { baseUrl } from '../../../Axios/api'
import HostHeader from '../HostHeader/HostHeader'

function HostReservation() {

    const [reservation, setReservation] = useState([])
    const [paymentHistory, setPaymentHistory] = useState([])
    const host = useSelector(state => state.user.host)

    const navigate = useNavigate()


    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const formattedDate = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
        return formattedDate
    }
    reservation.map((hotel) => {
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

        const hostId = host?.host?._id

        const getReservations = async () => {
            const { data } = await baseUrl.get("/host/reservations/" + hostId, {
                withCredentials: true
            })
            setReservation(data)
        }
        getReservations()

    }, [host?.host?._id])


    const getPaymentHistory = async () => {
        const hostId = host?.host?._id
        try {
            const { data } = await baseUrl.get("/host/paymenthistory/" + hostId, {
                withCredentials: true
            })

            console.log(data, 'ooooooooooooooooooooo');
            setPaymentHistory(data)

        } catch (err) {


        }

    }



    return (
        <section>
            <div className={`bg-white text-black w-full ${paymentHistory.length !== 0 ? "h-auto" : "h-screen"}`}>

                <HostHeader />

                <div className='w-full flex justify-center mt-12'>
                    <div className='w-11/12 h-full'>
                        <div className='w-full h-full' >

                            <div className='flex justify-between'>
                                <div className='mb-12'>
                                    {<h1 className='text-3xl font-bold'>Reservations</h1>

                                        // <div className='flex items-center space-x-4'>
                                        // <button onClick={()=>setPaymentHistory([])} className='flex items-center text-lg border-2 border-gray-600 px-2 rounded-md'>
                                        // <FontAwesomeIcon icon="fa-arrow-left" className='me-2' />
                                        //     Back
                                        // </button>
                                        // <h1 className='text-3xl font-bold'>PaymentHistory</h1>
                                        // </div>


                                    }
                                </div>

                                <div>
                                    <button onClick={getPaymentHistory} className='px-3 py-2 rounded-md border-2 border-gray-600'>Payment History</button>
                                </div>

                            </div>

                            {
                                paymentHistory.length === 0 ?

                                    <div className='space-y-2 '>
                                        <div className='w-full  h-12 border-b-2 border-gray-800 flex'>
                                            <div className='pl-3 pt-2 w-1/12 flex justify-center border-gray-800'>NO</div>
                                            <div className='pl-5 pt-2 w-3/12 flex  justify-center border-gray-800'>HotelName</div>
                                            <div className='pl-5 pt-2 w-3/12   flex justify-center  border-gray-800'>Total Price</div>
                                            <div className='pl-5 pt-2 w-3/12   flex justify-center border-gray-800'>Image</div>
                                            <div className='pl-5 pt-2 w-3/12   flex justify-center  border-gray-800'>Status</div>
                                            <div className='pl-5 pt-2 w-3/12   flex justify-center  border-gray-800'>Change Status</div>
                                        </div>
                                        {
                                            reservation.map((Hotel, index) => (

                                                <div className='w-full h-28 border-b-2 border-gray-800 flex'>
                                                    <div className='w-1/12 h-full flex justify-center items-center '>{index + 1}</div>
                                                    <div className='w-3/12 h-full flex justify-start items-center '>{Hotel.HotelDetails.HotelName}</div>
                                                    <div className='w-3/12 h-full flex justify-center items-center '>{Hotel.BookingDetails.totalCost}</div>
                                                    <div className='w-3/12 h-full flex justify-center items-center '>
                                                        <div className=' w-20 h-20 bg-cover' style={{ backgroundImage: `url("${Hotel?.HotelDetails?.HotelImage}")` }} >

                                                        </div>
                                                    </div>
                                                    <div className='w-3/12 h-full flex justify-center items-center '>{Hotel?.Booking}</div>
                                                    <div className='w-3/12 h-full flex justify-center items-center '>
                                                        <button onClick={() => cancelReservation(Hotel?._id)} className='border-2 border-gray-700 rounded-sm text-sm font-bold px-2 py-1'>Cancel Reservation</button>
                                                    </div>
                                                </div>

                                            ))

                                        }

                                    </div>

                                    :

                                    <div className='space-y-2 h-auto'>
                                        <div className='w-full  h-12 border-b-2 border-gray-800 flex'>
                                            <div className='pl-3 pt-2 w-1/12 flex justify-center border-gray-800'>NO</div>
                                            <div className='pl-5 pt-2 w-3/12 flex  justify-center border-gray-800'>HotelName</div>
                                            <div className='pl-5 pt-2 w-3/12   flex justify-center border-gray-800'>paymentStatus</div>
                                            <div className='pl-5 pt-2 w-3/12   flex justify-center  border-gray-800'>Amount Paid</div>
                                            <div className='pl-5 pt-2 w-3/12   flex justify-center  border-gray-800'>UserEmailAddress</div>
                                            <div className='pl-5 pt-2 w-3/12   flex justify-center  border-gray-800'>Booking Status</div>
                                        </div>
                                        {
                                            paymentHistory.map((Hotel, index) => (

                                                <div className={`w-full h-28 border-b-2 ${Hotel.Booking === "Canceled" && "bg-red-400"} border-gray-800 flex`}>
                                                    <div className='w-1/12 h-full flex justify-center items-center '>{index + 1}</div>
                                                    <div className='w-3/12 h-full flex justify-center items-center '>{Hotel.HotelDetails.HotelName}</div>
                                                    <div className='w-3/12 h-full flex justify-center items-center '> {Hotel.paymentStatus}</div>
                                                    <div className='w-3/12 h-full flex justify-center items-center '>{Hotel.BookingDetails.totalCost}</div>
                                                    <div className='w-3/12 h-full flex justify-center items-center '>{Hotel?.customerEmail}</div>
                                                    <div className='w-3/12 h-full flex justify-center items-center '>
                                                        {Hotel.Booking}
                                                    </div>
                                                </div>

                                            ))

                                        }

                                    </div>


                            }




                        </div>

                    </div>

                </div>


            </div>
        </section>
    )
}

export default HostReservation