import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authactions } from '../../../Redux/Auth/authSlice'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import Swal from 'sweetalert2'
import jwtInterceptor from '../../helpers/jwtInterceptor'
import { useEffect } from 'react'
import { baseUrl } from '../../../Axios/api'
import {  Oval } from 'react-loader-spinner'

function CreateuserProfile() {

  const dispatch = useDispatch()

  const [upload, setUpload] = useState(false)
  const [loading, setLoading] = useState(false)


  const user = useSelector(state => state.user.user)
  const userImage = useSelector(state => state.user.userImage)
  const tempUser = useSelector(state => state.user.personalInfo)


  const userFirstLetter = user.UserName.split("")[0].toUpperCase()

  const uploadImage = async (e) => {

    const file = e.target.files[0]
    const url = URL.createObjectURL(file)
    const userImage = {
      userImg: url,
      userId: user._id
    }
    dispatch(authactions.setUserImage(userImage))

    try {

      setUpload(false)
      setLoading(true)
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", "UserImages")
      formData.append("cloud_name", "dllnmynn6")
      const res = await baseUrl.post("https://api.cloudinary.com/v1_1/dllnmynn6/image/upload", formData)
      const { data } = await jwtInterceptor.post("/userprofile/uploaduserimage", { userImage: res.data.secure_url }, {
        withCredentials: true
      })

      setLoading(false)
      dispatch(authactions.setUser(data.response))

    } catch (err) {
      console.log(err.message);
    }

  }

  const formik = useFormik({

    initialValues: {
      school: tempUser ? tempUser.school : user.personalInformation ? user.personalInformation.school : "",
      work: tempUser ? tempUser.work : user.personalInformation ? user.personalInformation.work : "",
      live: tempUser ? tempUser.live : user.personalInformation ? user.personalInformation.live : "",
      language: tempUser ? tempUser.language : user.personalInformation ? user.personalInformation.language : "",
      pets: tempUser ? tempUser.pets : user.personalInformation ? user.personalInformation.pets : "",
      spendtime: tempUser ? tempUser.spendtime : user.personalInformation ? user.personalInformation.spendtime : "",
      about: tempUser ? tempUser.about : user.personalInformation ? user.personalInformation.about : ""
    },

    validationSchema: Yup.object({

      school: Yup.string().max(40, "Must be 40 Characters or less"),
      work: Yup.string().max(20, "Must be 20 Characters or less"),
      live: Yup.string().max(40, "Must be 40 Characters or less"),
      language: Yup.string().max(20, "Must be 20 Characters or less"),
      spendtime: Yup.string().max(40, "Must be 40 Characters or less"),
      pets: Yup.string().max(15, "Must be 15 Characters or less"),

    }),

    onSubmit: (values) => {
      updateUserInformation()
    }
  })
  const updateUserInformation = async () => {

    dispatch(authactions.settemporaryUser(formik.values))
    const { data } = await jwtInterceptor.post("http://localhost:5000/userprofile/addpersonalinformation", formik.values, {
      withCredentials: true
    })

    dispatch(authactions.setUser(data.response))

    if (data) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'User Information Updated',
        showConfirmButton: false,
        timer: 2500
      })
    }
  }

  
  console.log(user,'uuuuuuuuuu');

  return (
    <section>
      <section>
        <div className='bg-white text-black h-full'>
          <nav className='w-full h-20 flex justify-start bg-white shadow-md shadow-gray-400 items-center z-30 pl-12 fixed'>
            <div className='font-extrabold text-3xl xl:text-4xl'>LOGO</div>
          </nav>
          <section>
            <div className='pt-40 pb-20'>
              <div className='xl:relative w-full xl:flex'>
                <div className='xl:sticky top-40 flex flex-col xl:items-end items-center h-64 xl:w-4/12 w-full'>




                  <div className={`w-52 h-52 ${loading && "opacity-30"} bg-white relative border-4 rounded-full flex  flex-col items-center pt-6 bg-cover`} style={{ backgroundImage: `url(${userImage ? userImage?.userImg : user?.photoUrl})` }} >

                    {

                      loading &&


                      <div>
                        <Oval
                          height={100}
                          width={100}
                          color="#4fa94d"
                          wrapperStyle={{}}
                          wrapperClass=""
                          visible={true}
                          ariaLabel='oval-loading'
                          secondaryColor="#4fa94d"
                          strokeWidth={2}
                          strokeWidthSecondary={2}
  
                        />
                      </div>


                    }


                    {(user.photoUrl || userImage) ? null : <h1 className='text-9xl font-bold text-black'>{userFirstLetter}</h1>}

                    <label onChange={uploadImage} for="file-upload" class="absolute bottom-0 cursor-pointer border-2 w-20 h-8  border-gray-900 bg-white  font-medium text-black flex justify-center items-center space-x-2  rounded-sm  mt-8 shadow-md shadow-gray-700">

                      <FontAwesomeIcon icon="fa-camera" />
                      <span class="inline-block rounded-sm  hover:bg-primary-600">
                        {user.photoUrl ? "Edit" : "Add"}
                      </span>
                      <input id="file-upload" name='userImage' type="file" class="sr-only" />
                    </label>

                  </div>
                </div>

                <div className='xl:w-8/12 flex w-11/12 justify-center xl:flex-col xl:items-center'>


                  <div className='xl:w-8/12 w-full h-full pl-10  justify-center space-y-10'>


                    <div>
                      <h1 className='text-3xl font-bold'>Your profile</h1>
                    </div>


                    <div>
                      <p className='text-md font-light'>The information you share will be used across Airbnb to help other guests and Hosts get to know you</p>
                    </div>

                    <form action="" onSubmit={formik.handleSubmit} enctype="multipart/form-data" >
                      <div className='flex flex-col space-y-10 mt-14'>
                        <div className='xl:flex space-y-10 xl:space-y-0  xl:space-x-10'>
                          <div className='xl:w-6/12 w-full h-12'>
                            <input type="text" name='school' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.school} className='w-full h-full border-b-2 bg-white outline-none p-2 border-gray-800' placeholder='Where I went to School' />
                            {formik.touched.school && formik.errors.school ? <p className='text-red-600 text-sm'>{formik.errors.school}</p> : null}
                          </div>

                          <div className='xl:w-6/12 w-full h-12'>
                            <input type="text" name='work' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.work} className='w-full h-full border-b-2 bg-white outline-none p-2 border-gray-800' placeholder='My Work' />
                            {formik.touched.work && formik.errors.work ? <p className='text-red-600 text-sm'>{formik.errors.work}</p> : null}
                          </div>
                        </div>

                        <div className='xl:flex space-y-10 xl:space-y-0 xl:space-x-10'>

                          <div className='xl:w-6/12 w-full h-12'>
                            <input type="text" name='live' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.live} className='w-full h-full border-b-2 bg-white outline-none p-2 border-gray-800' placeholder='Where I Live' />
                            {formik.touched.live && formik.errors.live ? <p className='text-red-600 text-sm'>{formik.errors.live}</p> : null}
                          </div>
                          <div className='xl:w-6/12 w-full h-12'>
                            <input type="text" name='language' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.language} className='w-full h-full border-b-2 bg-white outline-none p-2 border-gray-800' placeholder='Languages I speak' />
                            {formik.touched.language && formik.errors.language ? <p className='text-red-600 text-sm'>{formik.errors.language}</p> : null}
                          </div>
                        </div>

                        <div className='xl:flex space-y-10 xl:space-y-0 xl:space-x-10'>
                          <div className='xl:w-6/12 w-full h-12'>
                            <input type="text" name='spendtime' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.spendtime} className='w-full h-full border-b-2 bg-white outline-none p-2 border-gray-800' placeholder='I spend too much time' />
                            {formik.touched.school && formik.errors.spendtime ? <p className='text-red-600 text-sm'>{formik.errors.spendtime}</p> : null}
                          </div>
                          <div className='xl:w-6/12 w-full h-12'>
                            <input type="text" name='pets' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.pets} className='w-full h-full border-b-2 bg-white outline-none p-2 border-gray-800' placeholder='Pets' />
                            {formik.touched.pets && formik.errors.pets ? <p className='text-red-600 text-sm'>{formik.errors.pets}</p> : null}
                          </div>
                        </div>


                        <div>
                          <h1 className='text-3xl font-bold'>About You</h1>
                        </div>


                        <div>
                          <textarea name="about" id="" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.about} className='w-full h-24 border-gray-800 border-2 bg-white outline-none p-4 ' cols="30" rows="10"></textarea>
                        </div>

                        <div className='flex justify-end'>
                          <button type='submit' className='w-24 h-12 border-2 border-gray-800 rounded-md hover:shadow-md hover:shadow-gray-500 hover:bg-white'>Submit</button>
                        </div>
                      </div>
                    </form>




                  </div>
                </div>
              </div>
            </div>
          </section>


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
    </section>
  )
}

export default CreateuserProfile