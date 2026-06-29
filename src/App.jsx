import React, { useEffect } from 'react'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import { Outlet } from 'react-router-dom'
import { useAuth } from './auth/hooks/useAuth'
import { Toaster } from 'react-hot-toast'

const App = () => {

  const auth = useAuth();
  useEffect(() => {
    auth.getUserDetails();
  }, [])

  console.log(auth.user);


    return (
    <div className='min-h-screen flex flex-col bg-[#FAF3CD]'>
      <Toaster position="top-center" />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default App