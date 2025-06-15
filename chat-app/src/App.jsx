import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'
import Update from './pages/Update/Update'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/chat' element={<Chat />} />
      <Route path='/profile' element={<Update />} />
    </Routes>
  )
}

export default App
