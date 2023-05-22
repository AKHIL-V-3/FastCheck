import React, { useEffect } from 'react'
import Footer from '../../HomeComponents/Footer/Footer'
import Header from '../../HomeComponents/Headear/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


function UserProfile() {

    const user = useSelector(state => state.user.user)
    const navigate = useNavigate()
    const userFirstName = user?.UserName.split(" ")[0].toUpperCase()
    const userFirstLetter = user?.UserName.split("")[0].toUpperCase()

    useEffect(() => {
        document.getElementsByTagName("html")[0].scrollTop = 0

    }, [])
    return (
        <div>
            <Header />
            <section>
                <div className='h-full xl:pb-10 w-full bg-white text-black  flex justify-center'>
                    <div className=' w-10/12 xl:flex' >
                        <div className=' xl:w-1/2 w-full xl:h-full h-auto ml-4 flex flex-col pt-14'>
                            <div className='border-2 border-gray-300 xl:w-80 w-full xl:h-64 h-72 rounded-3xl flex  flex-col items-center pt-8 shadow-md shadow-gray-300'>
                                <div className='w-32 h-32 rounded-full bg-white flex pt-2 justify-center bg-cover' style={{ backgroundImage: `url(${user?.photoUrl})` }}>
                                    {!user?.photoUrl && <h1 className='text-8xl font-bold text-black'>{userFirstLetter}</h1>}
                                </div>
                                <div className='mt-3'>
                                    <h1 className='font-semibold text-2xl'>{user?.UserName}</h1>
                                </div>
                            </div>
                            <div className=' border-2 border-gray-500 xl:w-80 w-full h-auto rounded-xl flex justify-center mt-10'>
                                <div className='w-10/12  h-full mb-10'>
                                    <div className='pt-10 space-y-10'>
                                        <h1 className='font-semibold text-2xl'>{userFirstName} 's Confirmed <br /> information</h1>
                                        <div className='space-y-4'>
                                            <div className='flex items-center space-x-5'>
                                                <FontAwesomeIcon icon="check" className='text-xl' />
                                                <p className='text-lg font-light'> Email address </p>
                                            </div>

                                            <div className='flex items-center space-x-5'>
                                                <FontAwesomeIcon icon="check" className='text-xl' />
                                                <p className='text-lg font-light'> Phone Number </p>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className='w-full bg-gray-500 mt-7' />

                                    <div className='mt-7 space-y-7'>
                                        <h1 className='font-semibold text-2xl'>Identity verification</h1>
                                        <p>Show others you’re really you with the identity verification badge.</p>
                                        <button className='w-32 h-14 flex justify-center items-center border-2 border-gray-500 rounded-xl'>Get the Badge</button>
                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className='xl:w-1/2 w-full h-full  xl:flex xl:items-start pt-16 '>


                            {!user?.personalInformation ?
                                <div className='w-7/12 h-auto space-y-7 mt-20'>
                                    <hr className='w-full bg-gray-500' />
                                    <h1 className='font-semibold text-2xl'>It's time to create your profile</h1>
                                    <p>Your     ................. profile is an important part of every reservation. Create yours to help other Hosts and guests get to know you.</p>
                                    <button onClick={() => navigate("/userprofile/createuserprofile")} className='w-48 h-14 flex justify-center items-center border-2 text-xl font-semibold border-gray-500 rounded-xl'>Create profile</button>
                                </div>
                                :
                                <div className='space-y-6 w-full'>

                                    <h1 className='font-semibold text-3xl'>About me</h1>
                                    <button onClick={() => navigate("/userprofile/createuserprofile")} className='w-32 h-10 flex justify-center items-center border-2 text-lg font-base border-gray-500 rounded-xl'>Edit Profile</button>

                                    <div className='xl:flex pt-12 w-full'>

                                        <div className='space-y-12 w-full'>

                                            <div className='flex space-x-2  xl:w-10/12 w-full xl:items-center'>
                                                <FontAwesomeIcon icon="fa-graduation-cap" className='text-xl' />
                                                <p>Where I went to School : {user?.personalInformation.school}</p>
                                            </div>
                                            <div className='flex space-x-2 xl:w-10/12 w-full xl:items-center'>
                                                <FontAwesomeIcon icon="language" className='text-xl' />
                                                <p>Speaks : {user?.personalInformation?.language}</p>
                                            </div>
                                           
                                            <div className='flex space-x-2  xl:w-10/12 w-full xl:items-center'>
                                                <FontAwesomeIcon icon="clock" className='text-xl' />
                                                <p>I spend too much time : {user?.personalInformation?.spendtime}</p>
                                            </div>
                                        </div>

                                        <div className='flex flex-col space-y-12'>

                                            <div className='flex space-x-2 xl:w-10/12 w-full xl:items-center'>
                                                <FontAwesomeIcon icon="shopping-bag" className='text-xl' />
                                                <p>My work : {user?.personalInformation?.work}</p>
                                            </div>


                                            <div className='flex space-x-2 xl:w-10/12 w-full xl:items-center'>
                                                <FontAwesomeIcon icon="globe" className='text-xl' />
                                                <p>Lives in : {user?.personalInformation?.live}</p>
                                            </div>

                                           
                                            <div className='flex space-x-2 xl:w-10/12 w-full xl:items-center'>
                                                <FontAwesomeIcon icon="dog" className='text-xl' />
                                                <p>Pets : {user?.personalInformation?.pets}</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>


                            }



                        </div>

                    </div>

                </div>

                {/* <div className='bg-black text-white p-20 border-white border-solid'>
                  

                  <div className='xl:flex'>
                    <div className='xl:w-72 w-full h-auto bg-gray-500 flex flex-col items-center rounded-md shadow-lg'>

                        <div className='bg-black w-28 h-28 rounded-full mt-3'>

                            <img src="https://as2.ftcdn.net/v2/jpg/01/18/03/35/1000_F_118033506_uMrhnrjBWBxVE9sYGTgBht8S5liVnIeY.jpg" className='w-full h-full rounded-full bg-cover' alt="https://t4.ftcdn.net/jpg/01/18/03/35/360_F_118033506_uMrhnrjBWBxVE9sYGTgBht8S5liVnIeY.jpg" />

                        </div>

                        <p>upload a photo</p>


                        <div className='ms-4 space-y-6 mt-5'>
                            <h1 className='text-xl font-bold'>Identity Verification</h1>
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officia, nesciunt?</p>


                            <div className='pb-8'>
                                <h1 className='text-xl font-bold'>{user?.UserName}</h1>
                                <p><span> <FontAwesomeIcon icon="check" /></span> Email Confirmed</p>
                                <p><span><FontAwesomeIcon icon="check" /></span> Mobile Confirmed</p>
                            </div>

                        </div>



                    </div>


                    <div className='xl:ml-10 w-full xl:mt-0 mt-20'>

                          <h1 className='text-xl font-bold'>Hello, {user?.UserName}</h1>
                          <p className='font-semibold opacity-75'>Joined in 2021</p>

                          <button className='bg-white rounded-xl text-black w-32 h-10 font-semibold text-lg mt-4'>Edit Profile</button>

                          <div className='ml-4 mt-4 font-semibold opacity-75'>
                            <p>0 Reviews</p>
                          </div>

                          <hr className='h-1  xl:w-1/2 w-full mt-4 ' />
                    </div>

                    </div>


                </div> */}

                <hr  className='w-full xl:h-0 h-1 bg-black mt-12'/>

            </section>
            <Footer />
        </div>
    )
}

export default UserProfile