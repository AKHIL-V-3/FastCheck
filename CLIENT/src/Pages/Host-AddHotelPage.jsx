import React ,{Fragment}from 'react'
import AddHotel from '../Components/HostComponents/AddHotel/AddHotel'
import HostHeader from '../Components/HostComponents/HostHeader/HostHeader'

function HostAddHotelPage() {
    return (
        <Fragment>
            <HostHeader/>   
            <AddHotel />
        </Fragment>
    )
}

export default HostAddHotelPage