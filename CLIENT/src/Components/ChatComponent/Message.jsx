import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Conversation from './Conversation'
import Chat from './Chat'
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useRef } from 'react';
import { io } from "socket.io-client"
import { baseUrl } from '../../Axios/api';




function Message() {




    const currentUrl = window.location.href

    const user = useSelector((state) => state.user.user)
    const host = useSelector((state) => state.user.host)

    let currentUserId
    let User
    if (currentUrl === `${process.env.REACT_APP_CLIENT_URL}/chat/messages`) {
        currentUserId = user?._id
        User = user
    } else if (currentUrl === `${process.env.REACT_APP_CLIENT_URL}/host/messages`) {
        currentUserId = host?._id
        User = host
    }

    const [conversation, setConversation] = useState([])

    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState([])
    const [arrivalMessage, setarrivalMessage] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null)
    const [selected, setSelected] = useState("")
    const [lastMessages, setLastMessages] = useState({})
    const [clickedUser, setClickedUser] = useState(null)
    const [ClickedHost, setClickedHost] = useState(null)


    const [smallScreen, setSmallScreen] = useState(false)
    const [firstrendersmall, setfirstrendersmall] = useState(false)

    useEffect(() => {
        setfirstrendersmall(true)
    }, [])


    const [search, setSearch] = useState(null)
    const [searchedValue, setSearchedValue] = useState(conversation)


    const [searchInput, setSearchInput] = useState("")


    useEffect(() => {
        setSearchedValue(conversation)
    }, [conversation])


    const searchUser = async (e) => {

        setSearchInput(e.target.value)
        setSearch(await Promise.all(conversation.map(async (conv) => {
            const friendId = conv?.members?.find((m) => m !== currentUserId);

            try {
                const { data } = await baseUrl.get("/chat/gethost/" + friendId, {
                    withCredentials: true
                });

                if (data.Hostname.toLowerCase().includes(searchInput.toLowerCase())) {
                    return conv;
                }

            } catch (error) {
                console.log(error);
            }

            return null

        }))

        )

        setSearchedValue(search.filter(s => s !== null))

        if (searchInput === "") setSearchedValue(conversation)
    }

    const scrollRef = useRef()
    const socket = useRef()

    useEffect(() => {
        socket.current = io(process.env.REACT_APP_SOCKET_CURRENT)
        socket.current.on("getMessage", data => {
            setarrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })
    }, [])

    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage, currentChat])

    useEffect(() => {
        socket.current.emit("addUser", currentUserId)
        socket.current.on("getUsers", users => {
            console.log(users);
        })

    }, [currentUserId])

    const SendMessage = async (e) => {

        e.preventDefault()

        if (newMessage.trim().length === 0) {
                 return
        }else{
          const message = {
                sender: currentUserId,
                text: newMessage,
                conversationId: currentChat?._id
            }
    
            const receiverId = currentChat.members.find(member => member !== currentUserId)
            socket.current.emit("sendMessage", {
                senderId: currentUserId,
                receiverId,
                text: newMessage
            })
    
            try {
                const { data } = await baseUrl.post("/chat/message", message, {
                    withCredentials: true
                })
                setMessages([...messages, data])
                setNewMessage("")
            } catch (error) {
                console.log(error);
            }



        }
        
    }

    useEffect(() => {
        const getConversation = async () => {
            try {
                const { data } = await baseUrl.get(`/chat/${currentUserId}`, {
                    withCredentials: true
                })
                setConversation(data)
            } catch (error) {
                console.log(error);
            }
        }
        getConversation()

    }, [currentUserId])



    useEffect(() => {

        const getMessages = async () => {

            try {
                const { data } = await baseUrl.get("/chat/message/" + currentChat?._id, {
                    withCredentials: true
                })
                setMessages(data)

            } catch (error) {
                console.log(error);
            }
        }
        getMessages()
    }, [currentChat])


    useEffect(() => {

        const getLastMsg = async () => {
            const lastMessages = await Promise.all(conversation.map(async (conv, index) => {
                try {
                    const { data } = await baseUrl.get("/chat/lastmessage/" + conv._id, {
                        withCredentials: true
                    })
                    return data
                } catch (error) {
                    console.log(error);
                }
            }))

            let lastList = {};

            lastMessages?.forEach((msg) => {
                lastList[msg?.conversationId] = msg
            })

            setLastMessages(lastList)
        }
        getLastMsg()

    }, [conversation, searchedValue])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        const getselectedUser = async () => {
            try {
                if (currentUrl === `${process.env.REACT_APP_CLIENT_URL}/chat/messages`) {
                    const { data } = await baseUrl.get("/chat/gethostdata/" + currentChat?._id, {
                        withCredentials: true
                    })
                    setClickedUser(data)
                    setSelected(data?.userId)

                } else if (currentUrl === `${process.env.REACT_APP_CLIENT_URL}/host/messages`) {

                    const { data } = await baseUrl.get("/chat/getuser/" + currentChat?._id, {
                        withCredentials: true
                    })

                    setClickedHost(data)
                    setSelected(data?.userId)

                }

            } catch (error) {
                console.log(error);
            }
        }
        getselectedUser()
    }, [currentChat?._id, currentUrl])

    const selectUser = async (conv) => {

        setCurrentChat(conv)
        setSmallScreen(true)
        const friendId = currentChat?.members?.find((m) => m !== currentUserId)
        try {
            const { data } = await baseUrl.get("/chat/gethost/" + friendId, {
                withCredentials: true
            })
            setSelectedUser(data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <section>
            <div className='bg-green-50 w-full h-screen fixed '>
                <div className='bg-black w-full h-6 bg-cover'>
                </div>
                <div className='w-full h-screen flex justify-start'>

                    <div className='bg-black w-6 h-24'>
                    </div>

                    <div className='w-full  mb-5 bg-white z-30 shadow-lg  shadow-balck flex overscroll-y-auto'>

                        <div className={`xl:w-4/12 w-full h-auto border-e-2 border-gray-800 ${smallScreen ? 'hidden' : 'block'} xl:block`}>
                            <div className='border-e-2 border-gray-800'>
                                <div className='w-full h-16 bg-stone-100 border border-b-stone-300  flex items-center '>
                                    <div className='bg-white w-12 h-12 border border-stone-300 rounded-full ms-2 bg-cover' style={{ backgroundImage: "url('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png')" }} >
                                    </div>
                                </div>
                            </div>

                            <div className='w-full h-14 bg-white flex justify-around items-center border-e-2 border-gray-800'>

                                <div className='w-11/12 h-10 rounded-md bg-stone-200 text-black flex items-center me-3'>

                                    <FontAwesomeIcon icon="search" className='ms-3' />

                                    <input type="text" onKeyUp={searchUser} className='h-full w-full bg-stone-200 rounded-md p-3 outline-none border-none text-base font-bold opacity-90' placeholder='Search here....' />

                                </div>
                            </div>

                            <div className='mb-3 w-full h-full overflow-x-hidden bg-stone-50 scrollbar-thumb-stone-200 scrollbar-thin'>
                                {
                                    searchedValue ?
                                        searchedValue.map((conv, index) => (
                                            <div key={conv._id} onClick={() => selectUser(conv)}>
                                                <Conversation conversation={conv} currentUser={User} selected={selected} lastMessage={lastMessages[conv?._id]} />
                                            </div>
                                        ))
                                        :
                                        conversation.map((conv, index) => (
                                            <div key={conv._id} onClick={() => selectUser(conv)}>
                                                <Conversation conversation={conv} currentUser={User} selected={selected} lastMessage={lastMessages[conv?._id]} />
                                            </div>
                                        ))
                                }
                            </div>
                            <div className='h-6 w-full bg-green-50 absolute bottom-0'>
                            </div>
                        </div>

                        {currentChat ?

                            <div className={`xl:w-8/12 w-full ${smallScreen ? "block" : "hidden"} xl:block relative`}>
                                <div className='w-full h-16 bg-stone-100 flex items-center border-b-stone-300 border text-black '>

                                    <div className='cursor-pointer mx-1 xl:hidden block' onClick={() => setSmallScreen(false)}>
                                        <FontAwesomeIcon icon="arrow-left" className='ms-3' />
                                    </div>

                                    <div className='bg-white border border-stone-300 w-12 h-12 rounded-full ms-2 bg-cover' style={{ backgroundImage: "url('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png')" }}>

                                    </div>

                                    <div className='ms-3'>
                                        <h1>{ClickedHost ? ClickedHost?.user.UserName : clickedUser && clickedUser?.user?.Hostname}</h1>
                                    </div>

                                </div>

                                <div className='w-full h-5/6 overflow-x-hidden xl:pb-52 pb-60 bg-stone-50 text-white scrollbar-thumb-gray-400 scrollbar-thin flex justify-center' >
                                    {/* style={{ backgroundImage: "url('https://cdn.wallpapersafari.com/4/11/WofyVJ.png')" }} */}

                                    <div className='w-10/12 h-auto space-y-2 mt-12'>
                                        {
                                            messages.map((message) => (
                                                <div ref={scrollRef}>
                                                    <Chat message={message} own={message.sender === currentUserId} />
                                                </div>
                                            ))
                                        }
                                        <div className='h-14'></div>
                                    </div>
                                </div>

                                <div className='bg-green-50 w-full h-14 absolute xl:bottom-7 bottom-14 pb-2 xl:pb-0 text-black left-0 right-0 flex items-center'>
                                    {/* <FontAwesomeIcon icon="smile" className='ms-3 w-7 h-7' /> */}
                                    <div className='w-full'>
                                        <form action="" onSubmit={(e)=>SendMessage(e)} className='flex me-3 ms-3 items-center '>
                                            <input type="text" onChange={(e) => setNewMessage(e.target.value)} value={newMessage} className='w-full h-9 rounded-md outline-none border-none p-3 text-base font-semibold opacity-95 me-3 ' placeholder='Type a message' />
                                            <div className='w-15'>
                                                <button type='submit' className='bg-white w-11 h-11 rounded-full flex ps-3 items-center' >
                                                    <img src="https://static-00.iconduck.com/assets.00/send-icon-512x505-rfnsb0it.png" className='w-6 h-6 ' alt="" />
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <div className='h-6 w-full bg-green-50 absolute bottom-0'>
                                </div>

                            </div>

                            :


                            <div className={`xl:w-8/12 w-full ${smallScreen ? "block" : "hidden"} xl:block relative bg-white`}>


                                <div className='w-full h-full '>
                                    <div className='flex  w-full h-full justify-center items-center'>
                                        <div className='xl:text-5xl text-2xl font-bold opacity-25 '> Open a conversation to start a chat

                                            <div className='flex justify-center mt-8'>
                                                <FontAwesomeIcon icon="message" className='ms-3' />
                                            </div>

                                        </div>
                                    </div>

                                </div>

                                <div className='h-7 w-full bg-white absolute bottom-0'>
                                </div>

                            </div>


                        }
                    </div>

                    <div className='bg-black w-6 h-24 text-white'>
                    </div>
                </div>

                {/* <div className='bg-gray-900 z-0 w-full h-6  '>
                </div> */}


                <div className='bg-gray-200 w-full h-6  '>
                </div>

            </div >

        </section >
    )
}

export default Message