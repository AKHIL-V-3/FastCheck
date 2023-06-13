import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
// import { Map, Marker, } from 'react-map-gl';
import{ Map, Marker } from 'react-map-gl';

export const MapComponent = (props) => {

    const [viewport, setViewPort] = useState({

        width: "100%",
        height: "100%",
        latitude: props.latitude,
        longitude: props.longitude,
        zoom: 9
    })


    return (

        <section className=' h-96 w-full rounded-md'>

            <Map
                mapStyle='mapbox://styles/akhilv033/cli9rvidj00vv01pn8smg9bwx?optimize=true'
                mapboxAccessToken='pk.eyJ1IjoiYWtoaWx2MDMzIiwiYSI6ImNsaDdnaGM0dzA5OGkzZ3BpaDdlejZuanYifQ.-FRRw7jUSm6r0TwReFdTTw'
                {...viewport}
            >    
                    <Marker latitude={props.latitude} longitude={props.longitude}> {/* Replace with your desired latitude and longitude */}
                        <FontAwesomeIcon icon="map-marker-alt" className='text-red-600 h-6 w-6 absolute right-56 bottom-96  xl:right-0 xl:bottom-0' style={{right:"620px",bottom:"380px"}}  />
                        
                    </Marker>
            </Map >

        </section>

    )
}
