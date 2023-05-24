import React, { useState } from 'react'
import Header from '../HomeComponents/Headear/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Footer from "../HomeComponents/Footer/Footer"
import { useDispatch, useSelector } from 'react-redux';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { differenceInDays } from 'date-fns'
import { useEffect } from 'react';
import { authactions } from '../../Redux/Auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { MapComponent } from '../MapComponent/Map';
import jwtInterceptor from '../helpers/jwtInterceptor';
import Reviews from '../ReviweComponent/Reviews';
import ReactStars from 'react-stars'
import { baseUrl } from '../../Axios/api';


function SingleRoom() {


    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [guests, setGuests] = useState(false)
    const [dateInput, setDateInput] = useState(false)
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setendDate] = useState(new Date())
    const [numberOfDay, setNumberOfDay] = useState(1)
    const [adults, setAdults] = useState(1)
    const [children, setChildren] = useState(0)
    const [infants, setInfants] = useState(0)
    const [totalGust, setTotalGust] = useState(1)

    const [review, setReview] = useState("")
    const [modalReviews, setModalReviews] = useState([])
    const [reviewCount, setReviewCount] = useState()
    const [show, setShow] = useState(false)
    const [reviews, setReviews] = useState([])
    const [rating, setRating] = useState([])
    const [startRating, setStarRating] = useState()
    const [userIndividualRating, setUserIndividualRating] = useState(false)


    const [showModal, setShowModal] = useState(false)

    const HotelData = useSelector((state) => state.user.hotelData)
    const user = useSelector(state => state.user.user)
    const isLoggedIn = useSelector(state => state.user.isLoggedIn)
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const formattedDate = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
        return formattedDate
    }

    const checkin = formatDate(startDate)
    const checkout = formatDate(endDate)

    const handleBooking = async () => {

        if(!isLoggedIn)  return navigate("/userlogin")

        if (numberOfDay >= 1) {
            const BookingDetails = {
                HotelDetails: HotelData,
                CheckIn: startDate,
                CheckOut: endDate,
                numberOfNights: numberOfDay,
                TotalGusts: totalGust,
                numberOfAdults: adults,
                numberOfChildren: children,
                numberOfInfants: infants
            }
            const totalCost = (HotelData.Price * numberOfDay) + 12118
            BookingDetails.totalCost = totalCost
            dispatch(authactions.setReservation(BookingDetails))

            navigate("/requesttobook")
        }
        else {
            setDateInput(!dateInput)
        }
    }

    const getNumberOfdays = () => {
        const startdate = new Date(startDate)
        const enddate = new Date(endDate)
        const diffInDays = differenceInDays(enddate, startdate)
        setNumberOfDay(diffInDays)
    }
    const IncadultsGust = () => {
        setAdults(adults + 1)
        setTotalGust(totalGust + 1)
    }
    const IncChildrenGust = () => {
        setChildren(children + 1)
        setTotalGust(totalGust + 1)
    }

    const IncInfatGust = () => {
        setInfants(infants + 1)
        setTotalGust(totalGust + 1)
    }
    const DecadultsGust = () => {
        setAdults(adults - 1)
        setTotalGust(totalGust - 1)
    }
    const DecChildrenGust = () => {
        setChildren(children - 1)
        setTotalGust(totalGust - 1)
    }
    const DecInfantGust = () => {
        setInfants(infants - 1)
        setTotalGust(totalGust - 1)
    }
    const handleSelect = (ranges) => {
        setStartDate(ranges.selection.startDate)
        setendDate(ranges.selection.endDate)
    }
    const selectionRange = {
        startDate: startDate,
        endDate: endDate,
        key: "selection"
    }
    useEffect(() => {
        getNumberOfdays()
    }, [endDate, startDate])
    
    const CreateConversation = async () => {

        const members = {
            senderId: user._id,
            receiverId: HotelData.HostData._id,
        }
        try {
            const res = await jwtInterceptor.post("/chat", members, {
                withCredentials: true
            })

            if (res.status === 200) {
                navigate("/chat/messages")
            }
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        document.getElementsByTagName("html")[0].scrollTop = 0

    }, [])

    modalReviews.map((review) => {
        const date = new Date(review.createdAt)
        review.createdAt = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    })
        useEffect(()=>{
            
        },[])

    useEffect(() => {

        const checkUserBooked = async () => {
            const data = {
                userId: user._id,
                hotelId: HotelData._id
            }
            try {
                const res = await baseUrl.post("/review/isbooked", data, {
                    withCredentials: true
                })
                if (res.status === 200) setShow(true)
            } catch (err) {
                console.log(err);
                if (err.response.data.message === "Book this Hotel first") {
                    setShow(false)
                }
            }
        }

        checkUserBooked()

    }, [HotelData?._id, user?._id, show])


    const addReview = async (e) => {
        e.preventDefault()
        const Review = {

            userId: user._id,
            reviewtext: review,
            hotelId: HotelData._id
        }
        try {
            const res = await jwtInterceptor.post("/review", Review, {
                withCredentials: true
            })
            setReview("")

        } catch (err) {
            console.log(err);
        }
    }

    const ratingChanged = async (newRating) => {
        const rating = {
            userId: user._id,
            rating: newRating,
            hotelId: HotelData._id
        }
        try {
            const { data } = await baseUrl.post("/review/rating", rating, {
                withCredentials: true
            })
            if (data) setStarRating(data)
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const getRating = async () => {
            try {
                const { data } = await baseUrl.get("/review/rating/" + HotelData._id, {
                    withCredentials: true
                })
                setRating(data)
            } catch (err) {
                console.log(err);
            }
        }

        getRating()

    }, [HotelData._id, startRating])

    useEffect(() => {
        const getUserRating = async () => {
            try {
                const { data } = await baseUrl.get(`/review/userrating/${user._id}/${HotelData._id}`, {
                    withCredentials: true
                })
                setUserIndividualRating(data)
            } catch (err) {
                console.log(err);
            }
        }

        getUserRating()
    }, [user?._id, HotelData?._id])


    useEffect(() => {
        const getReviews = async () => {
            try {
                const { data } = await baseUrl.get("/review/" + HotelData._id, {
                    withCredentials: true
                })
                const datas = data.slice(0, 6)
                setReviews(datas)
                setModalReviews(data)
            } catch (err) {
                console.log(err);
            }
        }
        getReviews()

    }, [HotelData?._id, review])


    useEffect(() => {
        const getReviewCount = async () => {
            try {
                const { data } = await baseUrl.get("/review/reviewcount/" + HotelData._id, {
                    withCredentials: true
                })
                setReviewCount(data)
            } catch (err) {
                console.log(err);
            }
        }
        getReviewCount()

    }, [HotelData?._id, review])


    // const date = new Date(review.createdAt)
    // const formattedDate = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });


    return (
        <section>
            <Header />
            <section className='w-full'>

                {/* <hr className='bg-white w-full sticky top-2'/> */}

                <div className='xl:flex xl:felx-col justify-center items-center xl:relative bg-white text-black'>

                    <div className='w-full space-y-4 xl:space-y-6 xl:flex xl:flex-col xl:items-center'>

                        <div className='xl:mt-10 w-full xl:flex xl:pl-32 pl-5 h-6'>
                            <h1 className='xl:text-3xl text-xl font-bold'>{HotelData.HotelName}</h1>

                        </div>

                        <div className='w-full pt-0 mt-0 xl:pl-32 pl-5'>
                            <div className='flex items-center space-x-2'>
                                <FontAwesomeIcon icon="star" />
                                <p>{rating?.rating}  -</p>

                                <p className='underline'>{reviewCount?.reviewtext} reviews</p>

                            </div>
                        </div>

                        <div className='xl:flex xl:w-10/12 w-full flex justify-center  xl:h-auto rounded-2xl '>
                              <div className='xl:w-1/2 bg-gray-600 w-full  h-96 xl:h-auto rounded-s-2xl bg-cover' style={{ backgroundImage: `url(${HotelData?.HotelImages[0]})` }}>
                              </div>
                            <div className='xl:w-1/2 xl:flex xl:flex-col w-full xl:h-auto xl:space-y-2  hidden'>

                                <div className='xl:flex xl:justify-evenly'>
                                    <div className='bg-orange-500 w-full xl:w-72 xl:h-52  bg-cover' style={{ backgroundImage: `url(${HotelData?.HotelImages[1]})` }}> </div>
                                    <div className='bg-orange-500 w-full xl:w-72 xl:h-52 rounded-e-lg bg-cover' style={{ backgroundImage: `url(${HotelData?.HotelImages[2]})` }} > </div>
                                </div>

                                <div className='xl:flex xl:justify-evenly'>
                                    <div className='bg-orange-500 w-full xl:w-72 xl:h-52  bg-cover' style={{ backgroundImage: `url(${HotelData?.HotelImages[3]})` }} > </div>
                                    <div className='bg-orange-500 w-full xl:w-72 xl:h-52 rounded-e-lg bg-cover' style={{ backgroundImage: `url(${HotelData?.RoomImages[0]})` }}  > </div>
                                </div>

                            </div>
                        </div>

                        <div className='xl:flex w-full justify-center h-auto'>

                            <div className='xl:w-7/12 w-full flex flex-col items-center h-auto xl:overflow-y-auto'>

                                <div className='w-full flex flex-col '>



                                    <div className='xl:w-11/12 w-full  mt-5 pl-5 xl:pl-0'>
                                        <h1 className='font-semibold text-2xl'>Entire rental unit hosted by <span>{HotelData.HostData.Hostname}</span></h1>
                                        <p><span>8</span>gusts  <span>2</span>bedrooms <span>6</span>beds  </p>
                                    </div>


                                    <div className='w-full flex justify-center mt-7'>
                                        <hr className='bg-black w-11/12' />
                                    </div>


                                    <div className='w-11/12 mt-7 pl-5 xl:pl-0  space-y-6'>
                                        <div className='flex space-x-5 items-center w-full'>
                                            <div className='w-8 h-8 flex justify-center items-center rounded-full border-black border-2'>
                                                <FontAwesomeIcon icon="key" />
                                            </div>
                                            <div>
                                                <h1 className='font-semibold text-lg'>Great check-in experience</h1>
                                                <p className='font-base text-sm opacity-60'>100% of recent guests gave the check-in process a 5-star rating.</p>
                                            </div>
                                        </div>


                                        <div className='flex space-x-5 items-center w-full'>
                                            <div className='w-8 h-8 flex justify-center items-center rounded-full border-black border-2'>
                                                <FontAwesomeIcon icon="parking" />
                                            </div>
                                            <div>
                                                <h1 className='font-semibold text-lg'>Park for free</h1>
                                                <p className='font-base text-sm opacity-60'>This is one of the few places in the area with free parking.</p>
                                            </div>
                                        </div>


                                        <div className='flex space-x-5 items-center w-full'>
                                            <div className='w-8 h-8 flex justify-center items-center rounded-full border-black border-2'>
                                                <FontAwesomeIcon icon="trophy" />
                                            </div>
                                            <div>
                                                <h1 className='font-semibold text-lg'>Highly rated host</h1>
                                                <p className='font-base text-sm opacity-60'>Somin has received 5-star ratings from 90% of recent guests.</p>
                                            </div>
                                        </div>

                                    </div>


                                    <div className='w-full flex justify-center mt-7'>
                                        <hr className='bg-white w-11/12' />
                                    </div>



                                    <div className='w-11/12 mt-7 pl-5 xl:pl-0 space-y-3'>
                                        <div>
                                            <h1 className='font-bold text-2xl'>About this space</h1>
                                        </div>

                                        <div>
                                            <p>Perched above on a gentle cliff, enveloped by lush vegetation on one side and boasting of panoramic sea views on the other, Rumah promises you a getaway to remember.
                                                Feel the warm sea breeze brush against you as you enjoy your breakfast or explore your pristine surroundings on foot. Located at a privileged address in the famed town of Dona Paula, Rumah properties blend together functionality with timeless luxury.</p>
                                        </div>

                                        <div className='underline'>
                                            <a>Read More....</a>
                                        </div>

                                    </div>

                                    <div className='w-full flex justify-center mt-7'>
                                        <hr className='bg-white w-11/12' />
                                    </div>


                                    <div className='w-11/12 pt-7 pl-5 xl:pl-0'>

                                        <div>
                                            <h1 className='font-bold text-2xl'>What this place offers</h1>
                                        </div>

                                        <div className='flex xl:space-x-64 space-x-20 w-full'>

                                            <div className='mt-7 space-y-7'>

                                                {HotelData.HotelFacilities.amenities.Wifi && <div className='flex space-x-3'>
                                                    <div className='w-8 h-8 flex justify-center items-center rounded-full border-black border-2'>
                                                        <FontAwesomeIcon icon="wifi" />
                                                    </div>
                                                    <p>WiFi</p>
                                                </div>}


                                                {HotelData.HotelFacilities.amenities.Parking && <div className='flex space-x-3'>
                                                    <div className='w-8 h-8 flex justify-center items-center rounded-full border-black border-2'>
                                                        <FontAwesomeIcon icon="car" />
                                                    </div>
                                                    <p>Free parking on premises</p>
                                                </div>}


                                                <div className='flex space-x-3'>
                                                    <div className='w-8 h-8 flex justify-center items-center rounded-full border-black border-2'>
                                                        <FontAwesomeIcon icon="elevator" />
                                                    </div>
                                                    <p>Lift</p>
                                                </div>


                                            </div>

                                            <div className='mt-7 space-y-7'>

                                                <div className='flex space-x-3'>
                                                    <div className='w-8 h-8 flex justify-center items-center rounded-full border-black border-2'>
                                                        <FontAwesomeIcon icon="fa-kitchen-set" />
                                                    </div>
                                                    <p>Kitchen</p>
                                                </div>


                                                {HotelData.HotelFacilities.amenities.Television && <div className='flex space-x-3'>
                                                    <div className='w-8 h-8 flex justify-center items-center rounded-full border-black border-2'>
                                                        <FontAwesomeIcon icon="tv" />
                                                    </div>
                                                    <p>TV</p>
                                                </div>}
                                                {/* <div className='flex space-x-3'>
                                                    <div className='w-8 h-8 flex justify-center items-center rounded-full border-white border-2'>
                            
                                                        <FontAwesomeIcon icon="fas fa-air-freshnar" />
                                                    </div>
                                                    <p>Washing Machine</p>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>


                                    <div className='w-full flex justify-center mt-7'>
                                        <hr className='bg-black w-11/12' />
                                    </div>


                                </div>
                            </div>

                            <div className=' xl:w-96  w-full xl:h-1/2  pb-8 xl:sticky mt-10 xl:top-48 mb-10 rounded-md border border-gray-400 shadow-lg shadow-gray-300 '>


                                <div className='space-y-2 flex  flex-col items-center'>

                                    <div className='flex justify-between w-full'>
                                        <h1 className='font-bold text-xl pl-4 mt-2'>₹{HotelData.Price} <span className='font-medium text-base'>night</span></h1>
                                    </div>

                                    <div className='w-11/12 rounded-lg border-black border-2'>
                                        <div className='flex '>

                                            <div class="relative w-full">
                                                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
                                                </div>
                                                <input onClick={(e) => setDateInput(!dateInput)} type="text" className="caret-transparent cursor-pointer border w-full border-black text-black text-sm rounded-s-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={`${checkin !== checkout ? checkin : "CEHCK-IN"} - ${checkout !== checkin ? checkout : "CHECK-OUT"}`} />
                                            </div>

                                        </div>

                                        {

                                            dateInput &&
                                            <div className='flex flex-col text-black xl:col-span-3 xl:mx-auto '>
                                                <DateRangePicker
                                                    staticRanges={[]}
                                                    inputRanges={[]}
                                                    ranges={[selectionRange]}
                                                    minDate={new Date()}
                                                    rangeColors={["#2E5984"]}
                                                    onChange={handleSelect}
                                                />
                                            </div>
                                        }


                                        <div className='w-full h-12 flex items-center justify-between p-4 rounded-b-md border-black border-t-2' onClick={() => setGuests(!guests)}>

                                            <div className='flex flex-col justify-center'>
                                                <h5 className='font-semibold text-sm'>GUESTS</h5>
                                                <p className='text-sm'>{totalGust} <span>{totalGust > 1 ? "gusts" : "gust"}</span></p>
                                            </div>

                                            <div id="menu-button" aria-expanded="true" aria-haspopup="true">
                                                {!guests ? <FontAwesomeIcon icon="chevron-down" /> : <FontAwesomeIcon icon="chevron-up" />}
                                            </div>

                                        </div>


                                        {guests && <div class="absolute z-10 mt-2 w-11/12 origin-top-right border-black border-2 rounded-md bg-white text-black shadow-lg" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">


                                            <div class="py-1" role="none">

                                                <div className='flex justify-between p-4 items-center'>
                                                    <div className='space-y-1'>
                                                        <p className=" block  text-sm font-bold" role="menuitem" tabindex="-1" id="menu-item-0">Adults</p>
                                                        <p className='block  text-sm'>Age 13+</p>
                                                    </div>

                                                    <div>
                                                        <div className='flex justify-evenly space-x-4'>
                                                            {adults > 1 ? <div onClick={DecadultsGust} className='w-7 h-7 rounded-full border-black border-2 flex justify-center items-center'>
                                                                <FontAwesomeIcon icon="minus" />
                                                            </div> : <div className='w-7 h-7 rounded-full border-gray-700 text-gray-700 border-2  flex justify-center items-center'>
                                                                <FontAwesomeIcon icon="minus" />
                                                            </div>}
                                                            <p >{adults}</p>
                                                            <div onClick={IncadultsGust} className='w-7 h-7 rounded-full border-black border-2 flex justify-center items-center'>
                                                                <FontAwesomeIcon icon="plus" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>



                                                <div className='flex justify-between p-4 items-center'>
                                                    <div className='space-y-1'>
                                                        <p className=" block  text-sm font-bold" role="menuitem" tabindex="-1" id="menu-item-0">Children</p>
                                                        <p className='block  text-sm'>Age 2-12</p>
                                                    </div>

                                                    <div>
                                                        <div className='flex justify-evenly space-x-4'>
                                                            {children >= 1 ? <div onClick={DecChildrenGust} className='w-7 h-7 rounded-full border-black border-2 flex justify-center items-center'>
                                                                <FontAwesomeIcon icon="minus" />
                                                            </div> : <div className='w-7 h-7 rounded-full border-gray-700 text-gray-700 border-2  flex justify-center items-center'>
                                                                <FontAwesomeIcon icon="minus" />
                                                            </div>}
                                                            <p >{children}</p>
                                                            <div onClick={IncChildrenGust} className='w-7 h-7 rounded-full border-black border-2 flex justify-center items-center'>
                                                                <FontAwesomeIcon icon="plus" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className='flex justify-between p-4 items-center'>
                                                    <div className='space-y-1'>
                                                        <p className=" block  text-sm font-bold" role="menuitem" tabindex="-1" id="menu-item-0">Infants</p>
                                                        <p className='block  text-sm'>under 2</p>
                                                    </div>

                                                    <div>
                                                        <div className='flex justify-evenly space-x-4'>
                                                            {infants >= 1 ? <div onClick={DecInfantGust} className='w-7 h-7 rounded-full border-black border-2 flex justify-center items-center'>
                                                                <FontAwesomeIcon icon="minus" />
                                                            </div> : <div className='w-7 h-7 rounded-full border-gray-700 text-gray-700 border-2  flex justify-center items-center'>
                                                                <FontAwesomeIcon icon="minus" />
                                                            </div>}
                                                            <p >{infants}</p>
                                                            <div onClick={IncInfatGust} className='w-7 h-7 rounded-full border-black border-2 flex justify-center items-center'>
                                                                <FontAwesomeIcon icon="plus" />
                                                            </div>


                                                        </div>
                                                    </div>

                                                </div>

                                            </div>


                                            <div className='flex justify-between p-4 items-center'>
                                                <p className='text-sm'>This place has a maximum of 8 guests, not including infants. Pets aren't allowed.</p>
                                            </div>



                                        </div>}





                                    </div>


                                    <div className='w-full h-20 flex justify-center items-center'>

                                        <button onClick={handleBooking} className='bg-white text-black border-black border-2 rounded-lg w-11/12 h-12 font-bold text-lg'>Reserve</button>

                                        {/* <p>{totalGust}</p> */}

                                    </div>


                                    <p className='text-md'>You won't be charged yet</p>

                                    <div className='w-full pt-4 flex flex-col items-center space-y-4'>

                                        <div className='flex justify-between w-10/12 '>
                                            <p>₹{HotelData.Price} X <span>{numberOfDay}</span>nights</p>
                                            {numberOfDay > 0 ? <p>₹{HotelData.Price * numberOfDay}</p> : <p>₹{HotelData.Price}</p>}
                                        </div>

                                        <div className='flex justify-between w-10/12 '>
                                            <p>Service Fee</p>
                                            <p>₹12,118</p>
                                        </div>


                                        <div className='w-full flex justify-center'>
                                            <hr className='bg-black w-10/12' />
                                        </div>


                                        <div className='flex justify-between w-10/12 '>
                                            <p className='font-semibold text-lg'>Total before taxes</p>
                                            <p className='font-semibold text-lg'>₹{(HotelData.Price * numberOfDay) + 12118}</p>
                                        </div>

                                    </div>


                                    <div>

                                    </div>


                                </div>

                            </div>


                        </div>


                        <div className='xl:w-10/12 w-full xl:pt-12  flex flex-col items-center space-y-7'>
                            <div className='xl:ml-10  w-full pl-5'>
                                <h1 className='font-bold text-2xl'>Where You'll be</h1>
                            </div>


                            <MapComponent latitude={HotelData?.HotelAddress.geometry.coordinates[1]} longitude={HotelData.HotelAddress.geometry.coordinates[0]} />


                        </div>



                        <div className='w-full flex justify-center pt-12'>
                            <hr className='bg-white w-10/12 px-6' />
                        </div>




                        <div className='w-10/12 pb-20 z-40'>

                            <div className='ml-7'>
                                <div className='flex items-center space-x-6'>
                                    <div className='w-20 h-20 bg-slate-600 rounded-full bg-cover' style={{ backgroundImage: `url("${user?.photoUrl}")` }}></div>

                                    <div>
                                        <h1 className='font-bold text-xl'>Hosted by {HotelData?.HostData?.Hostname}</h1>
                                        <p className='font-base text-sm opacity-70'>Joined in December 2018</p>
                                    </div>

                                </div>

                                <div className='flex items-center space-x-12 pt-6'>
                                    <div className='flex items-center space-x-2'>
                                        <FontAwesomeIcon icon="star" />
                                        <p><span>681</span> Reviews</p>
                                    </div>

                                    <div className='flex items-center space-x-2'>
                                        <FontAwesomeIcon icon="shield" />
                                        <p>Identity verified</p>
                                    </div>

                                </div>



                                <div className='w-full pt-16 xl:flex xl:space-x-64'>
                                    <div className='xl:w-1/2 w-full'>
                                        <p>Happy and grateful to be a part of this lovely  community which has given me an opportunity to play a host to more than 4000 guests from the tender age of 21. We work along side an amazing team which strives to keep customer service to the highest level. When in Goa do visit our lifestyle store Saukhyam (Porvorim) and our Petite but crowd favourite eatery Qi Pan Asian (Panjim).</p>

                                    </div>

                                    <div className='xl:space-y-3 mt-32 xl:mt-0'>
                                        <p>Policy number:<span>HOTN002234</span> </p>
                                        <p>Language: <span>English,हिन्दी</span> </p>


                                        <div className='xl:pt-12 pt-12 xl:w-52 w-full'>
                                            { isLoggedIn && <button onClick={() => CreateConversation()} className='xl:w-full w-full h-12 border-black border-2 rounded-md z-40'>Contact Host</button>}
                                        </div>
                                    </div>
                                </div>


                                <hr className='w-full bg-gray-800 opacity-50 mt-12' />


                                <div className='w-full h-auto mt-20 '>

                                    {reviews.length > 0  &&
                                        <div>
                                            <h1 className='font-bold text-2xl'>Reviews</h1>
                                        </div>}

                                    {

                                        show &&
                                        <div className='mt-12'>
                                            <div className='text-lg font-bold'>
                                                Rate the Hotel Here
                                            </div>
                                            <ReactStars
                                                count={5}
                                                onChange={ratingChanged}
                                                value={startRating?.rating ? startRating?.rating : userIndividualRating.rating}
                                                size={50}
                                                color2={'#ffd700'} />
                                        </div>
                                    }


                                    <div className='h-full pt-12 '>


                                        {
                                            show &&
                                            <div className='flex mb-12'>

                                                <div className='w-full h-20'>
                                                    <form action="" onSubmit={addReview} className='h-20'>
                                                        <div className='flex justify-start items-center h-full'>

                                                            <input type="text" name='review' onChange={(e) => setReview(e.target.value)} value={review} className='w-full  p-4 h-4/6 opacity-70 text-md font-semibold rounded-md border-2 border-black outline-none' placeholder='Type Your Review . . . .' />
                                                            <button type='submit' className='w-32 ms-3 h-4/6 rounded-md border-2 border-gray-800 font-bold text-lg'>Send</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        }

                                        <div className='grid grid-cols-2 gap-12'>

                                            {
                                                reviews.map((review) => (
                                                    <Reviews Review={review} />
                                                ))
                                            }

                                        
                                        </div>

                                        {  
                                           reviews.length > 0  &&
                                            
                                            <div className='mt-12'>
                                            <button onClick={() => setShowModal(true)} className='border-2 border-black w-48 h-12 font-semibold rounded-md'>Show all {reviewCount?.reviewtext} reviews</button>
                                        </div>}


                                        <>
                                            {showModal ? (
                                                <>
                                                    <div
                                                        className="justify-center items-center flex w-full h-full overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
                                                        <div className='xl:w-6/12 xl:h-5/6  w-10/12 h-96 mt-0 bg-white xl:pl-5 xl:pe-5 xl:pb-5  overflow-x-hidden scrollbar-thumb-gray-700 scrollbar-thin rounded-md relative'>
                                                            <div className='flex justify-start items-center xl:h-32 h-20 w-full bg-white sticky top-0 mt-0 z-30'>
                                                                <div onClick={() => setShowModal(false)} className='hover:bg-slate-400 xl:ms-0 ms-5 rounded-full xl:w-10 xl:h-10 w-6 h-6 flex justify-center items-center'>
                                                                    <FontAwesomeIcon icon="times" className='xl:w-5 xl:h-5 w-4 h-4' />
                                                                </div>
                                                                <div className='xl:ms-28 ms-12 xl:mt-10 mt-0'>
                                                                    <div className='w-full xl:font-bold xl:text-4xl font-semibold text-2xl flex justify-center items-center'>
                                                                        <div className='flex items-center space-x-2'>
                                                                            <FontAwesomeIcon icon="star" />
                                                                            <p>{rating?.rating}  -</p>

                                                                            <p className='underline'>{reviewCount?.reviewtext} reviews</p>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className='xl:w-11/12 w-10/12 h-auto'>

                                                                <div className='w-full space-y-10 pb-12 pl-6 xl:pl-0 overflow-x-hidden'>

                                                                    {
                                                                        modalReviews.map((review) => (
                                                                            <div>

                                                                                <div className='flex items-center space-x-3 mt-10'>
                                                                                    <div className='bg-black xl:w-14 xl:h-14 w-12 h-12 rounded-full'>
                                                                                    </div>

                                                                                    <div>
                                                                                        <h1 className='font-semibold text-base xl:text-xl'>{review?.User?.UserName}</h1>
                                                                                        <p className='opacity-80 text-sm xl:text-base'>{review.createdAt}</p>
                                                                                    </div>


                                                                                </div>
                                                                                <div className='ml-16 mt-2 text-sm xl:text-base'>
                                                                                    <p>{review.reviewtext} Lorem ipsum dolor sit, amet consectetur adipisicing elit. Neque delectus culpa dolorum harum corporis! Quod dolorem nesciunt quasi rem atque odit nobis tempore est in, aliquam aperiam ipsa, consequatur inventore. </p>
                                                                                </div>

                                                                            </div>

                                                                        ))


                                                                    }

                                                                </div>

                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                                                </>
                                            ) : null}
                                        </>



                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section >


            <Footer />

        </section >
    )
}

export default SingleRoom