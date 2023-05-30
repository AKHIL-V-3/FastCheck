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
                <div className='mb-12 ml-12 text-3xl font-bold'>
                    <h1>Payment history</h1>
                </div>


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

                        <div className={`w-full h-28 border-b-2 ${Hotel.Booking === "Canceled" && "bg-stone-200"} border-gray-800 flex`}>
                            <div className='w-1/12 h-full flex justify-center items-center '>{index + 1}</div>
                            <div className='w-3/12 h-full flex justify-start items-center '>{Hotel.HotelDetails.HotelName}</div>
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
        </section>
    )
}

export default PaymentHistory