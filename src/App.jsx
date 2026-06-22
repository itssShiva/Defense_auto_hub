import React from 'react'
import Navbar from './assets/Components/Navbar'
import Footer from './assets/Components/Footer'
import Home from './assets/Components/Home'

const App = () => {
  return (
    <div className='min-h-screen flex flex-col bg-[#FAF3CD]'>
      <Navbar />
      <main className='grow'>
        <Home />
      </main>
      <Footer />
    </div>
  )
}

export default App