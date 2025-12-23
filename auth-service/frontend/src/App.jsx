import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import {ToastContainer} from 'react-toastify';
import VerifyOtpForm from './components/ui/VerifyOtpForm.jsx';

const App = () => {
  return <>
  <BrowserRouter>
  <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/verifyotp' element={<VerifyOtpForm/>}/>
  </Routes>
  <ToastContainer />
  </BrowserRouter>
  </>
};

export default App
