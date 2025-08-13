import React, { useState } from 'react'

import './App.css'
import MenuCreator from './components/createmenu/MenuCreator'
import Dashboard from './components/dashboard/AdminDashboard'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Dashboard/>
    </>
  )
}

export default App
