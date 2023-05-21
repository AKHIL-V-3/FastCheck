import React, { useRef } from 'react'
import axios from 'axios'
import { useEffect } from 'react';
import { useState } from 'react';
import { baseUrl } from '../Axios/api';

function Searchplace() {

    const searchInput = useRef(null)


    const[serach ,setSearch] = useState('')

    const [place, setPlace] = useState([])

     const getPlace = async(e)=> {
        setSearch(e.target.value)
        const places = await baseUrl.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchInput.current.value}.json?proximity=ip&access_token=pk.eyJ1IjoiYWtoaWx2MDMzIiwiYSI6ImNsaDdnaGM0dzA5OGkzZ3BpaDdlejZuanYifQ.-FRRw7jUSm6r0TwReFdTTw`)
        setPlace(places.data.features)
    }

    //   useEffect(()=>{

    //       getPlace()

    //   },[])



    return (

        <section className=''>

            <div className='w-full  flex h-screen justify-center items-center'>


                <div>

                    <h1>Search place here </h1>

                    <input ref={searchInput} onChange={getPlace} type="text" className='h-8 border-2 border-black p-3' />

                    {place.map((item) => (

                        <p>{item.place_name}.......................hererere</p>


                    ))}



                </div>



            </div>

        </section>
    )
}

export default Searchplace