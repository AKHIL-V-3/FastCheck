import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'


function Conversation({conversation,currentUser,selected,lastMessage,searchedUser}) {

    const [user,setUser] = useState([])
    useEffect(()=>{
        const friendId = conversation?.members?.find((m)=> m!== currentUser?._id)
        const getUser = async()=>{   
            try{
                const { data } = await axios.get("http://localhost:8000/chat/gethost/"+friendId, {
                    withCredentials: true
                  })
                  setUser(data);
            }catch(error){
                console.log(error);
            }
        }
        getUser()
    },[conversation,currentUser?._id,lastMessage])
    const Dte = new Date(lastMessage?.createdAt)
    const time = Dte.toLocaleTimeString([],{hour: '2-digit', minute: '2-digit'})

    return (
        <section>
        {
            <div  className={`w-full  h-20  flex items-center justify-between hover:bg-stone-200 ${user?._id === selected ? "bg-stone-200" : ""}`}>
              
                <div className='w-2/12'>
                    <div className='bg-white w-12 h-12 ms-2 rounded-full bg-cover' style={{backgroundImage:"url('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png')"}} >
                    </div>
                </div>

                <div className='w-10/12 h-full flex justify-between items-center pe-3 border-b-2 border-gray-800'>
                    <div className='flex flex-col justify-center'>
                        <h1 className='text-lg font-semibold'>{user?.Hostname ? user?.Hostname : user?.UserName && user?.UserName}</h1>
                        <p className='text-sm'>{lastMessage?.text}</p>
                    </div>

                    <div className='space-y-1 h-1/2 flex items-start'>
                        <p className='text-sm'>{time !== "Invalid Date"? time :""}</p>
                        {/* <div className='w-5 h-5 rounded-full bg-white text-black flex justify-center items-center text-base font-semibold'>1</div> */}

                    </div>
                </div>

            </div>
        }






        </section>
    )
}

export default Conversation