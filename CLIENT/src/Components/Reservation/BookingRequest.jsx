import React, { useState , useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { authactions } from '../../Redux/Auth/authSlice'
import jwtInterceptor from '../helpers/jwtInterceptor'


function BookingRequest() {


    const [isOpen, setIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showPanModal, setShowPanModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(null)
    const [panNumber, setPanNumber] = useState(null)
    const [phoneNumberExist, setPhoneNumberExist] = useState(false)
    const [panNumberExist, setPanNumberExist] = useState(false)
    const Reservation = useSelector(state => state.user.reservation)

    const dispatch = useDispatch()
    const phoneRegExp = /^(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    const panRegExp = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

    const formik = useFormik({
        initialValues: {
            phoneNumber: null
        },
        validationSchema: Yup.object().shape({
            phoneNumber: Yup.string()
                .matches(phoneRegExp, 'Phone number is not valid')
                .required('Phone number is required'),
        }),
        onSubmit: (values) => {
            addPhoneNumber()
        }
    })


    const validatePan = (panNumber) => {
        if (!panRegExp.test(panNumber)) {
            return 'Invalid PAN number';
        }
    }

    const validationSchema = Yup.object().shape({
        panNumber: Yup.string().required('PAN number is required').test('valid-pan', 'Invalid PAN number', validatePan),
    });



    const panformik = useFormik({
        initialValues: {
            panNumber: null
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            addPanNumber()
        }
    })


    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const formattedDate = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
        return formattedDate
    }

    const firstDateCheck = (CheckIn, CheckOut) => {
        if (CheckIn.split(" ")[2] === CheckOut.split(" ")[2] && CheckIn.split(" ")[1] === CheckOut.split(" ")[1]) {
            const arr = CheckIn.split(" ")
            arr.pop()
            arr.pop()
            return arr.toString()
        } else if (CheckIn.split(" ")[2] === CheckOut.split(" ")[2]) {
            const arr = CheckIn.split(" ")
            arr.pop()
            return arr.toString()
        } else {
            return CheckIn
        }
    }
    const CheckIn = formatDate(Reservation.CheckIn)
    const CheckOut = formatDate(Reservation.CheckOut)
    const In = firstDateCheck(CheckIn, CheckOut)
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    const addPhoneNumber = () => {     
        const { phoneNumber } = formik.values
            setPhoneNumber(parseInt(phoneNumber))
            setPhoneNumberExist(true)
            setShowModal(false)
    }
    const addPanNumber = () => {

        const { panNumber } = panformik.values
        if (panNumber) {
            setPanNumber(parseInt(panNumber))
            setPanNumberExist(true)
            setShowPanModal(false)
        }
    }

    const handleBooking = async() => {

         jwtInterceptor.post("http://localhost:8000/reservation", Reservation, {
            withCredentials: true,           
        })
        .then((res)=>{  

              if(res.data.url){
                 window.location.href = res.data.url
              }
        })
        .catch ((err)=>{
              
               console.log(err);
        })

    }


    useEffect(()=>{

        document.getElementsByTagName("html")[0].scrollTop = 0  
 
     },[])

    return (
        <section>
            <div className=' bg-white text-black'>

                <nav className='w-full h-20 flex justify-start items-center pl-12 border-b-2 border-gray-600'>
                    <div className='font-extrabold text-3xl xl:text-4xl'>LOGO</div>
                </nav>

                <div className='w-full h-auto xl:flex xl:justify-center'>

                    <div className='xl:w-10/12 w-full h-1/2 xl:relative xl:flex xl:justify-center pl-8 xl:pl-0  xl:space-x-20  pt-20 space-y-7'>

                        <div className='xl:w-6/12 w-11/12'>
                            <div className='w-full'>
                                <h1 className='text-4xl font-medium'>Request to book</h1>
                            </div>


                            <div className='mt-12'>
                                <div>
                                    <h1 className='font-semibold text-2xl'>Your Trip</h1>
                                </div>

                                <div className='space-y-6'>
                                    <div className='flex mt-7 justify-between items-center me-10'>
                                        <div>
                                            <h1 className='font-semibold text-lg'>Dates</h1>
                                            <p>{In} - {CheckOut}</p>
                                        </div>

                                        {/* <div>
                                            <button className='underline font-semibold '>Edit</button>
                                        </div> */}
                                    </div>

                                    <div className='flex mt-7 justify-between items-center me-10'>
                                        <div>
                                            <h1 className='font-semibold text-lg'>Gusts</h1>
                                            <p>{Reservation.TotalGusts}</p>
                                        </div>

                                        {/* <div>
                                            <button className='underline font-semibold '>Edit</button>
                                        </div> */}
                                    </div>
                                </div>
                            </div>



                            <hr className='w-full mt-12 bg-black ' />


                            <div className='mt-7'>

                                <div>
                                    <h1 className='font-semibold text-2xl'>Pay with</h1>
                                </div>

                                <div>
                                    <div>
                                        <button
                                            type="button"
                                            onClick={toggleMenu}
                                            className="flex justify-between items-center p-4 w-full rounded-md border-2 border-gray-600 h-14 mt-7"
                                            id="options-menu"
                                            aria-haspopup="true"
                                            aria-expanded="true"
                                        >

                                            Stripe Payment

                                            {!isOpen ? <FontAwesomeIcon icon="chevron-down" /> : <FontAwesomeIcon icon="chevron-up" />}
                                        </button>
                                    </div>

                                    {isOpen && (
                                        <div
                                            className="origin-top-right mt-2 w-full rounded-md border-black border-2 bg-white"
                                            role="menu"
                                            aria-orientation="vertical"
                                            aria-labelledby="options-menu"
                                        >
                                            <div className="py-1 flex justify-between items-center px-4" role="none">
                                                <p
                                                    className="block px-4 py-3 text-sm "
                                                    role="menuitem"
                                                >
                                                    Stripe
                                                </p>
                                                <FontAwesomeIcon icon="check" />

                                            </div>
                                        </div>
                                    )}
                                </div>




                            </div>

                            <hr className='w-full mt-12  bg-black ' />


                            <div className='mt-7'>

                                <div>
                                    <h1 className='font-semibold text-2xl'>Required for your trip</h1>
                                </div>

                                <div className='space-y-8'>
                                    <div className='flex justify-between me-8 mt-12'>
                                        {!phoneNumberExist ? <div>
                                            <h1 className='font-semibold text-lg'>Phone Number</h1>
                                            <p className='text-sm font-thin'>Add and confirm your phone number to get trip updates.</p>
                                        </div> :

                                            <div>
                                                <p className='font-semibold text-lg'>Phone Number</p>
                                                <p className='text-sm font-semibold'>{phoneNumber}</p>
                                            </div>

                                        }

                                        <div>
                                            {!phoneNumberExist && <button onClick={() => setShowModal(true)} className='border-gray-600 border-2 w-20 rounded-md h-10'>Add</button>}



                                            {showModal ? (
                                                <>
                                                    <div
                                                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                                                    >
                                                        <div className="relative xl:w-auto my-6 mx-auto max-w-3xl">
                                                            {/*content*/}
                                                            <div className=" rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                                {/*header*/}
                                                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                                    <div className='flex xl:space-x-64 space-x-40 m-x-20 items-center'>
                                                                        <div className='cursor-pointer' onClick={() => setShowModal(false)}><FontAwesomeIcon icon="times" /></div>
                                                                        <p>Add Phone Number</p>
                                                                    </div>
                                                                </div>
                                                                {/*body*/}

                                                                <div>
                                                                    <div className='w-full xl:ms-20 ms-16 me-52 space-y-7 xl:space-y-4 mt-12 mb-12'>

                                                                        <div>
                                                                            <p>We’ll send you trip updates and a text to verify this number.</p>
                                                                        </div>

                                                                        <form action="" onSubmit={formik.handleSubmit} >
                                                                            <div className='w-9/12 space-y-2'>
                                                                                <input type="text" name='phoneNumber' onBlur={formik.handleBlur} value={formik.values.phoneNumber} onChange={formik.handleChange} className='w-full h-12 border-2 border-gray-400 rounded-md outline-none p-3 bg-white ' />
                                                                                {formik.touched.phoneNumber && formik.errors.phoneNumber && <div className='text-sm text-red-500'>{formik.errors.phoneNumber}</div>}
                                                                                <p className='w-full font-thin text-sm'>We'll text you a code to confirm your number. Standard message and data rates apply.</p>
                                                                            </div>


                                                                            <div className='pt-4'>
                                                                                <button type='submit' className='w-28 h-12 bg-black rounded-lg font-bold text-lg  text-white font'>Continue</button>
                                                                            </div>

                                                                        </form>



                                                                    </div>
                                                                </div>

                                                                {/*footer*/}

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                                                </>
                                            ) : null}




                                        </div>
                                    </div>

                                    <div className='flex justify-between me-8 mt-12'>
                                        {!panNumberExist ? <div>
                                            <h1 className='font-semibold text-lg'>Permanent Account Number (PAN)</h1>
                                            <p className='text-sm font-thin'>A valid PAN is required per Reserve Bank of India (RBI) regulations.</p>
                                        </div> :

                                            <div>
                                                <p className='font-semibold text-lg'>Pan Number</p>
                                                <p className='text-sm font-semibold'>{panNumber}</p>
                                            </div>
                                        }

                                        <div>
                                            {!panNumberExist && <button type='submit' onClick={() => setShowPanModal(true)} className='border-gray-600 border-2 w-20 rounded-md h-10'>Add</button>}



                                            {showPanModal ? (
                                                <>
                                                    <div
                                                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                                                    >
                                                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                                            {/*content*/}
                                                            <div className=" rounded-lg shadow-lg relative flex flex-col w-full bg-white  outline-none focus:outline-none">
                                                                {/*header*/}
                                                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                                    <div className=' m-x-20 items-center'>
                                                                        <div className='cursor-pointer' onClick={() => setShowPanModal(false)}><FontAwesomeIcon icon="times" /></div>
                                                                    </div>
                                                                </div>
                                                                {/*body*/}

                                                                <div>
                                                                    <div className='xl:w-full w-11/12 xl:ms-20 ms-8 me-52 space-y-4 mt-12 mb-12'>


                                                                        <div>
                                                                            <h1 className='text-3xl font-semibold'>Submit PAN</h1>
                                                                        </div>

                                                                        <div>
                                                                            <p className='text-sm xl:text-base'>Enter the Permanent Account Number (PAN) of the person paying. We're <br className='hidden xl:block' /> required to collect this info for international reservations in order to comply with <br className='hidden xl:block'/> Reserve Bank of India (RBI) regulations. </p>
                                                                        </div>

                                                                        <form action="" onSubmit={panformik.handleSubmit}>

                                                                            <div className='w-9/12'>
                                                                                <input type="text" name='panNumber' value={panformik.values.panNumber} onBlur={panformik.handleBlur} onChange={panformik.handleChange} className='w-full h-12 border-2 border-gray-400 rounded-md outline-none p-3 bg-white ' placeholder='PAN' />
                                                                                {panformik.touched.panNumber && panformik.errors.panNumber && <div className='text-sm text-red-500'>{panformik.errors.panNumber}</div>}
                                                                                <p className='w-full font-thin text-sm pt-2'>The PAN won't be shared with Hosts and will be processed in line with our Privacy Policy.</p>
                                                                            </div>


                                                                            <div className='pt-14 pb-7'>
                                                                                <p className='font-thin text-sm'>By continuing, I certify that the PAN I entered belongs to the person paying for this reservation <br className='hidden xl:block' /> and that I have permission to share their information.</p>
                                                                            </div>


                                                                            <hr className='xl:w-9/12 w-11/12 bg-white' />


                                                                            <div className='pt-7 flex justify-between xl:w-9/12 w-11/12 items-center'>
                                                                                <p className='underline cursor-pointer' onClick={() => setShowPanModal(false)}>Cancel</p>
                                                                                <button className='w-28 h-12 bg-black rounded-lg font-bold text-lg  text-white font'>Submit</button>
                                                                            </div>

                                                                        </form>


                                                                    </div>
                                                                </div>

                                                                {/*footer*/}

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                                                </>
                                            ) : null}


                                        </div>
                                    </div>
                                </div>

                            </div>



                            <hr className='w-full mt-12 bg-slate-300 ' />

                            <div className='mt-7'>
                                <div>
                                    <h1 className='font-semibold text-2xl'>Ground rules</h1>
                                </div>

                                <div className='mt-7'>
                                    <p>We ask every guest to remember a few simple things about what makes a <br /> great guest.</p>
                                </div>

                                <div className='mt-7 space-y-3'>
                                    <ul>1. Follow the house rules</ul>
                                    <ul>2. Treat your Host’s home like your own</ul>
                                </div>

                            </div>


                            <hr className='w-full mt-12 bg-slate-300 ' />


                            <div className='mt-12'>
                                <p className='text-xs font-thin'>By selecting the button below, I agree to the Host's House Rules, Ground rules for guests, Airbnb's Rebooking and Refund Policy and that Airbnb can charge my payment method if I’m responsible for damage.</p>
                            </div>


                            <hr className='w-full mt-12 bg-slate-300 ' />


                            <div className='mt-10'>
                                <button onClick={handleBooking} className='w-52 h-16 bg-black text-white font-bold flex justify-center items-center text-xl rounded-xl'>
                                    Confirm and pay
                                </button>
                            </div>




                        </div>



                        <div className='xl:sticky xl:top-20 xl:w-5/12 xl:h-1/2 w-11/12 rounded-lg   justify-center flex pt-12 border border-gray-400 shadow-lg shadow-gray-300'>

                            <div className='w-10/12'>
                                <div className='flex w-full space-x-3'>
                                    <div className='h-28 w-28 bg-slate-400 rounded-lg bg-cover' style={{ backgroundImage: `url(${Reservation.HotelDetails?.HotelImages[0]})` }}>

                                    </div>
                                    <div className='flex flex-col justify-between'>
                                        <div className='space-y-1'>
                                            <p className='text-sm font-light opacity-70'>Private room in farm stay</p>
                                            <p className='text-base font-normal'>{Reservation.HotelDetails?.HotelName}</p>
                                        </div>

                                        {/* <div>
                                            <p className='font-bold text-base'>5.00<span className='font-thin text-sm pl-2 opacity-75'>( 1 review )</span></p>
                                        </div> */}

                                    </div>
                                </div>

                                <hr className='w-full mt-7 bg-slate-300 ' />


                                <div className='mt-7'>
                                    <div>
                                        <h1 className='font-bold text-md'>Your Booking is Protected By <span className='text-red-500'>Us</span></h1>
                                    </div>
                                </div>

                                <hr className='w-full mt-7 bg-slate-300 ' />


                                <div className='mt-7'>

                                    <div>
                                        <h1 className='font-medium text-2xl'>Price details</h1>
                                    </div>

                                    <div className='mt-3 space-y-3'>
                                        <div className='flex justify-between'>
                                            <h1>₹ {Reservation.HotelDetails.Price} x {Reservation.numberOfNights} nights</h1>
                                            <p>₹ {Reservation.HotelDetails.Price * Reservation.numberOfNights}</p>
                                        </div>
                                        <div className='flex justify-between'>
                                            <h1>Service Fee</h1>
                                            <p>₹ 12,118</p>
                                        </div>
                                        {/* <div className='flex justify-between'>
                                            <h1>Taxes</h1>
                                            <p>₹11,300</p>
                                        </div> */}
                                    </div>

                                </div>

                                <hr className='w-full mt-7 bg-slate-300 ' />


                                <div className='mt-7 mb-7'>
                                    <div className='flex justify-between'>
                                        <h1>Total (INR)</h1>
                                        <p>₹ {Reservation.totalCost}</p>
                                    </div>
                                </div>

                            </div>


                        </div>




                    </div>

                </div>


                <footer>

                    <div className='w-full h-16 mt-12 border-t-2 border-gray-700 flex justify-center'>

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

export default BookingRequest