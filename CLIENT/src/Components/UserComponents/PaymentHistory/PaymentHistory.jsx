import React, { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { baseUrl } from '../../../Axios/api'
import jwtInterceptor from '../../helpers/jwtInterceptor'

function PaymentHistory() {

    const [paymentHistory, setPaymentHistory] = useState([])

    const user = useSelector(state => state.user.user)

    useEffect(() => {

        const getPaymentHistory = async () => {

            const userId = user?._id
            try {
                const { data } = await jwtInterceptor.get("/paymenthistory/" + userId, {
                    withCredentials: true
                })
                console.log(data, 'ooooooooooooooooooooo');
                setPaymentHistory(data)

            } catch (err) {


            }

        }

        getPaymentHistory()


    }, [user?._id])



    return (
        <section>

            <div className='space-y-2 h-auto mt-16 p-4'>
                <div className='mb-12 xl:ml-12 xl:text-3xl text-2xl font-bold'>
                    <h1>Payment history</h1>
                </div>


                <div className='w-full h-12 border-b border-gray-800 flex xl:text-base text-xs'>
                    <div className='xl:pl-3  pt-2 w-1/12 flex justify-center border-gray-800'>NO</div>
                    <div className='xl:pl-5  pt-2 w-3/12 flex  justify-center border-gray-800'>Hotelname</div>
                    <div className='xl:pl-5  pt-2 w-3/12   flex justify-center border-gray-800'>paymentStatus</div>
                    <div className='xl:pl-5  pt-2 w-3/12   flex justify-center  border-gray-800'>AmountPaid</div>
                    <div className='xl:pl-5  pt-2 w-3/12   flex justify-center  border-gray-800'>Email</div>
                    <div className='xl:pl-5  pt-2 w-3/12   flex justify-center  border-gray-800'>BookingStatus</div>
                </div>
                {
                    paymentHistory.map((Hotel, index) => (

                        <div className={`w-full h-28 border-b xl:text-base text-xs border-gray-800 flex`}>
                            <div className='w-1/12 h-full flex justify-center items-center '>{index + 1}</div>
                            <div className='w-3/12 h-full flex justify-start items-center '>{Hotel.HotelDetails.HotelName}</div>
                            <div className='w-3/12 h-full flex justify-center items-center '> {Hotel.paymentStatus}</div>
                            <div className='w-3/12 h-full flex justify-center items-center '>{Hotel.BookingDetails.totalCost}</div>
                            <div className='w-3/12 h-full flex justify-center items-center '>{Hotel?.customerEmail}</div>
                            <div className={`w-3/12 h-full ${Hotel.Booking === "Canceled" ? "text-red-500" : "text-green-500"} flex justify-center items-center `}>
                                {Hotel.Booking}
                            </div>
                        </div>

                    ))

                }

            </div>
        </section>
    )
}

export default PaymentHistory