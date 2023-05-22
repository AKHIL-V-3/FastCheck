import React  from 'react'
import { useNavigate } from "react-router-dom";
import {ToastContainer,toast} from "react-toastify"
import {useFormik} from 'formik'
import * as Yup from 'yup'
import { baseUrl } from '../../../Axios/api';

function HostSignup() {

  const navigate = useNavigate()
    const generateError = (err)=>{
    console.log(err) 
      toast.error(err,{
         position:"top-right"
      })
      
   }
   
    const formik = useFormik({

          initialValues:{
              Hostname:"",
              Email:"",
              Password:""
          },

          validationSchema:Yup.object({

            Hostname:Yup.string().max(15,"Must be 15 Characters or less").required("Required"),
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

          const { data } = await baseUrl.post("/host/signup",formik.values,{
            withCredentials:true
          })

          if(data.errors){   
            
              const {email,username} = data.errors

              if(email && username)generateError(username)
              else if(email) generateError(email)
              else generateError(username)   
          }else{
            
              navigate("/host/hostlogin")               
          }

      } catch (error) {

         console.log(error);

      }

                
     }
     
  return (
    <section>
      <div className='bg-white w-full h-screen text-black flex items-center justify-center'>

        <div className={` ${formik.errors.Email ||formik.errors.Hostname || formik.errors.Password ? "h-auto":"h-auto"} w-80 flex-col items-center justify-center border-black border-2 rounded-md pb-12  xl:w-96`}>

          <h1 className='text-lg font-bold mt-3 ml-5 '>Host SignUp</h1>

          {/* <div className='bg-white w-100 h-1'></div> */}
          <hr className='bg-black m-5' />

          <div className='flex-col w-full h-3/4'>

            <form action="" onSubmit={formik.handleSubmit} >
            <div className='mt-8 ml-8 rounded-xl'>
              
              <input type="text" name='Hostname' onBlur={formik.handleBlur}  onChange={formik.handleChange} value={formik.values.Hostname}   className=" w-64 xl:w-80 h-11  border border-black  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Your Name" ></input>
              {formik.touched.Hostname && formik.errors.Hostname ? <p>{formik.errors.Hostname}</p> : null}
            </div>

            <div className='mt-8 ml-8 rounded-xl'>
              
              <input type="Email" name='Email' onBlur={formik.handleBlur}  onChange={formik.handleChange} value={formik.values.Email} className=" w-64 xl:w-80 h-11  border border-black  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Your EmailAddress" ></input>
              {formik.touched.Email && formik.errors.Email ? <p>{formik.errors.Email}</p> : null}
            </div>

            <div className='mt-8 ml-8 rounded-xl'>
              <input type="Password" autocomplete="on" name='Password' onBlur={formik.handleBlur}  onChange={formik.handleChange} value={formik.values.Password} className=" w-64 xl:w-80 h-11  border border-black  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Your Password" ></input>
              {formik.touched.Password && formik.errors.Password ? <p>{formik.errors.Password}</p>  : null}
            </div>

            <button type='submit' className={`bg-black mt-8 ml-8 text-white p-2 rounded-xl w-28 font-semibold`}>SignUp</button>
            <div className='w-full flex justify-center pt-7'>
            <p>Already Have an Account ? <span className='underline cursor-pointer' onClick={()=>navigate("/host/hostsignup")}>Login</span></p>
            </div>


            </form>

          </div>

        </div>


      </div>
      <ToastContainer/>
    </section>

  )
}

export default HostSignup