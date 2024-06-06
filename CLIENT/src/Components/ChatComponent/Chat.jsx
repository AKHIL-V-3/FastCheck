import React from 'react'

function Chat({ message, own }) {


    const Dte = new Date(message?.createdAt)
    const time = Dte.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return (

        <section>
            <div className={`w-full h-auto flex ${own ? "justify-end" : "justify-start"} items-center`}>
                <div className={`max-w-xl ${own ? "bg-neutral-800 shadow-md shadow-stone-500" : "bg-white shadow-md text-black"} rounded-md px-2  relative`}>
                    <div className='h-1/2 w-full flex justify-start text-sm pe-12 pt-1'>
                        <p className='w-full' style={{ wordWrap: 'break-word' }} >{message?.text}</p>
                    </div>
                    <div className='h-1/2 w-full flex items-end justify-end ps-3 pb-1'>
                        <p className='text-xs font-thin h-1/2 leading-3' style={{ fontSize: "11px" }}>{time}</p>
                    </div>
                    {/* format(message.createdAt) */}
                </div>
            </div>
        </section>
    )
}

export default Chat