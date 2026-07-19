import React, { useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import SideBar from './SideBar'

export default function MainLayout() {
    const [mobileSlideBar, setmobileSlideBar] = useState(false)

    
    return (
        <>
            <Header mobileSlideBar={mobileSlideBar} setmobileSlideBar={setmobileSlideBar} />
            <SideBar mobileSlideBar={mobileSlideBar} setmobileSlideBar={setmobileSlideBar} />
            <Footer />
        </>
    )
}
