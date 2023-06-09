import React from 'react'
import { useNavigate } from "react-router-dom";
import {ToastContainer,toast} from "react-toastify"
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {auth ,provider } from "../../../GoogleSignIn/Config"
import {signInWithPopup} from "firebase/auth"
import { baseUrl } from '../../../Axios/api';



function UserSignup() {

  const navigate = useNavigate()

    const generateError = (err)=>{

    console.log(err)
        
      toast.error(err,{
         position:"top-right"
      })
      
   }

    const formik = useFormik({

          initialValues:{

              UserName:"",
              Email:"",
              Password:""
          },

          validationSchema:Yup.object({

            UserName:Yup.string().max(15,"Must be 15 Characters or less").required("Required"),
            Email:Yup.string().email("Invalid Email").required("Required"),
            Password:Yup.string().min(3,"Must be 3 Characters or more").required("Required"),

          }),

          onSubmit:(values)=>{
                handleSubmit()
          }
    })

    console.log(formik.errors);
     const handleSubmit =async()=>{
      // e.preventDefault()
        console.log(formik.values,'valuesssss');
      try {

          const { data } = await baseUrl.post("/usersignup",formik.values,{
            withCredentials:true
          })

          if(data.errors){   
            
              const {email,username} = data.errors
              if(email && username)generateError(username)
              else if(email) generateError(email)
              else generateError(username)   
          }else{ 
              navigate("/userlogin")               
          }
      } catch (error) {
         console.log(error);
      }          
     }

     const googleSignup = ()=>{

      signInWithPopup(auth,provider).then(async (data)=>{

          const user = {

               Email:data.user.email,
               UserName:data.user.displayName,
               photoUrl:data.user.photoURL,
               userId:data.user.uid,
               Password:data.user.uid,
          }

          try{
             
            const { data } = await baseUrl.post("/usersignup",user,{
              withCredentials:true
            })
            if(data) navigate('/userlogin')
          }catch(err){

             console.log(err);
          }
          
      })
  }
     
  return (
    <section>
      <div className='bg-white w-full h-screen text-black flex items-center justify-center'>

        <div className=' h-auto w-80 flex-col items-center justify-center border-gray-500 border shadow-md shadow-stone-300 rounded-md  xl:w-96'>

          <h1 className='text-lg font-bold mt-3 ml-5 '>Login Or SignUp</h1>

          <hr className='bg-black m-5' />

          <div className='flex-col w-full h-3/4'>

            <form action="" onSubmit={formik.handleSubmit} >
            <div className='mt-8 ml-8 rounded-xl'>
             
              <input type="text" name='UserName' onBlur={formik.handleBlur}  onChange={formik.handleChange} value={formik.values.UserName}   className=" w-64 xl:w-80 h-11 bg-white border border-black  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Your Name"></input>
              {formik.touched.UserName && formik.errors.UserName ? <p>{formik.errors.UserName}</p> : null}
            </div>

            <div className='mt-8 ml-8 rounded-xl'>
              <input type="Email" name='Email' onBlur={formik.handleBlur}  onChange={formik.handleChange} value={formik.values.Email} className=" w-64 xl:w-80 h-11 bg-white border border-black  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Your EmailAddress"></input>
              {formik.touched.Email && formik.errors.Email ? <p>{formik.errors.Email}</p> : null}
            </div>

            <div className='mt-8 ml-8 rounded-xl'>
              <input type="Password" autocomplete="on" name='Password' onBlur={formik.handleBlur}  onChange={formik.handleChange} value={formik.values.Password} className=" w-64 xl:w-80 h-11 bg-white border border-black  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Your Password"></input>
              {formik.touched.Password && formik.errors.Password ? <p>{formik.errors.Password}</p>  : null}
            </div>

            <button type='submit' className={`bg-black ${formik.errors.Email ||formik.errors.UserName || formik.errors.Password ? "mt-6" : "mt-10"} ml-8 text-white p-2 rounded-3xl w-28 font-semibold mb-10`}>Continue</button>
            </form>

            <div className={`flex justify-center mt-10}`} >
              <hr className='bg-black w-16 ml-2 mt-3' />
              <span className='mx-2'>Or Continue With</span>
              <hr className='bg-black w-16 ml-2 mt-3' />
            </div>

            <div onClick={googleSignup} className={`bg-black ${formik.errors.Email ||formik.errors.UserName || formik.errors.Password ? "mt-6" : "mt-10"} ml-8 text-white p-2 rounded-3xl w-3/4 font-extrabold flex justify-center items-center`}>
              <svg class="h-5 w-5 text-white" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M17.788 5.108A9 9 0 1021 12h-8" /></svg>
              <button className='ml-2'>Google</button>
            </div>
          </div>

          <div className='ml-8 mb-6 mt-8'>
            <p>Already Have an account ?<span onClick={()=>navigate('/userlogin')} className='ms-3 underline cursor-pointer'>Login</span></p>
           </div>

        </div>


      </div>
      <ToastContainer/>
    </section>

  )
}

export default UserSignup