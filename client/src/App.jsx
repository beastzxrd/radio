import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Library from './pages/Library'
import Upload from './pages/Upload'
import Profile from './pages/Profile'
import Login from './pages/Login'
import SignUp from './pages/SignUp'

function App() {
  return (
    <Routes>
      {/* Auth routes - sin Layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      
      {/* App routes - con Layout */}
      <Route path="*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/profile/:username?" element={<Profile />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  )
}

export default App
