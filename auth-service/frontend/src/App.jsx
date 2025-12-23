import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import {ToastContainer} from 'react-toastify';
import VerifyOtpForm from './components/ui/VerifyOtpForm.jsx';
import { AppData } from './context/AppContext.jsx';
import Loading from './Loading.jsx';
import Dashboard from './pages/Dashboard.jsx';

const App = () => {
  const {isAuth,loading} = AppData();
  return <>
  {loading?<Loading/> : <BrowserRouter>
  <Routes>
    <Route path='/' element={isAuth?<Dashboard/> : <Home/>}/>
    <Route path='/login' element={isAuth?<Dashboard/> : <Home/>}/>
    <Route path='/verifyotp' element={isAuth?<Home/> : <VerifyOtpForm/>}/>
  </Routes>
  <ToastContainer />
  </BrowserRouter> }
  </>
};

export default App
