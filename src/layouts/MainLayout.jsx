import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import SideBar from './SideBar';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function MainLayout() {
  const [mobileSlideBar, setmobileSlideBar] = useState(false);
  const { token } = useAuth();

  if (!token) {
    return <Navigate to={'/'} />;
  }
  return (
    <>
      <Header
        mobileSlideBar={mobileSlideBar}
        setmobileSlideBar={setmobileSlideBar}
      />
      <SideBar
        mobileSlideBar={mobileSlideBar}
        setmobileSlideBar={setmobileSlideBar}
      />
      <Footer />
    </>
  );
}
