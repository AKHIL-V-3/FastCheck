import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useSelector } from 'react-redux'

function Sidebar() {
    const admin = useSelector(state=> state.user.admin)
    const adminName = admin?.Email?.split('@')[0].toUpperCase()
    return (
        <section>
            <div className='bg-white h-screen w-80 shadow-lg fixed z-10 shadow-stone-500'>
                <nav>
                    <div className='h-32 w-full flex justify-center items-center border border-b-stone-100'>                    
                    {/* style={{ backgroundImage: "url('https://cdn.onlinewebfonts.com/svg/img_574534.png')" }} */}
                        <div>
                            <div className='w-20 h-20 border border-stone-300 rounded-full bg-cover' style={{ backgroundImage: "url('https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&w=600')" }}></div>
                            <h1 className='ml-3 font-bold text-lg'>{adminName}</h1>
                        </div>
                    </div>
                </nav>
                <div className='w-full h-full'>
                    <div className='mt-6'>
                        <div className=' border border-stone-300 py-8 h-14 pl-8 cursor-pointer w-full flex items-center justify-start space-x-6 hover:bg-stone-200'>
                            <FontAwesomeIcon icon="home" className='w-6 h-6' />
                            <h1 className='text-xl font-bold'>Dashboard</h1>
                        </div>
                        {/* <div className=' border border-stone-300 py-8 h-14 pl-8 cursor-pointer w-full flex items-center justify-start space-x-6 hover:bg-stone-200'>
                            <FontAwesomeIcon icon="user" className='w-6 h-6' />
                            <h1 className='text-xl font-bold'>Users</h1>
                        </div>

                        <div className=' border border-stone-300 py-8 h-14 pl-8 cursor-pointer w-full flex items-center justify-start space-x-6 hover:bg-stone-200'>
                            <FontAwesomeIcon icon="hotel" className='w-6 h-6' />
                            <h1 className='text-xl font-bold'>Hosts</h1>
                        </div> */}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Sidebar