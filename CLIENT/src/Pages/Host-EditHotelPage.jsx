import React, { Fragment } from 'react'
import EditHotel from '../Components/HostComponents/EditHotel/EditHotel'
import HostHeader from '../Components/HostComponents/HostHeader/HostHeader'

function HostEditHotelPage() {
    return (
        <Fragment>
            <HostHeader />
            <EditHotel />
        </Fragment>
    )
}

export default HostEditHotelPage