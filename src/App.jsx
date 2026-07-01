import React, { useEffect } from 'react'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import { Outlet } from 'react-router-dom'
import { useAuth } from './auth/hooks/useAuth'

const App = () => {

  const auth = useAuth();
  useEffect(() => {
    auth.getUserDetails();
  }, [])

  return (
    <div className='min-h-screen flex flex-col bg-[#FAF3CD]'>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default App