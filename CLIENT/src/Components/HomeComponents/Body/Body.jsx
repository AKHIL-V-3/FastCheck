import React, { Fragment } from 'react'
import Footer from '../Footer/Footer'
import Header from '../Headear/Header'
import Banner from './Banner'
import Posts from './Posts'


function Body() {
    return (
        <Fragment>
                <Header />
                <Banner />
                <Posts/>
                <Footer/>
        </Fragment>
    )
}

export default Body