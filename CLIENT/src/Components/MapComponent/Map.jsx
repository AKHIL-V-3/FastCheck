import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
// import { Map, Marker, } from 'react-map-gl';
import MapGL, { Marker } from 'react-map-gl';

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

            <MapGL
                mapStyle='mapbox://styles/akhilv033/cli9rvidj00vv01pn8smg9bwx'
                mapboxAccessToken='pk.eyJ1IjoiYWtoaWx2MDMzIiwiYSI6ImNsaDdodXg4ejBnODAzY210ZnBqNXRjazYifQ.TB4Ynq9txwJTID5zEYlNIA'
                {...viewport}
            >    
                    <Marker latitude={props.latitude} longitude={props.longitude}> {/* Replace with your desired latitude and longitude */}
                        <FontAwesomeIcon icon="map-marker-alt" className='text-red-600 h-6 w-6 absolute right-56 bottom-96  xl:right-0 xl:bottom-0' style={{right:"620px",bottom:"380px"}}  />
                        
                    </Marker>
            </MapGL >

        </section>

    )
}
