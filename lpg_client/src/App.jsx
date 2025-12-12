import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/custom/Navbar.jsx'
function App() {

  return (
    <div className='min-h-screen flex flex-wrap content-between '>
      <div className='w-full block'>
        <Navbar/>
        <main>
          <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default App
