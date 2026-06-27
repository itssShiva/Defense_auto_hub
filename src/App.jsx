import React from 'react'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import { Outlet } from 'react-router-dom'

const App = () => {
  return (
    <div className='min-h-screen flex flex-col bg-[#FAF3CD]'>
      <Navbar />
      <main className='grow'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App