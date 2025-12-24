import React from 'react'
import GlassButton from '../components/ui/GlassButton.jsx';
import AuthModal from '../components/ui/AuthModal.jsx';
import LoginForm from '../components/ui/LoginForm.jsx';
import VerifyOtpForm from '../components/ui/VerifyOtpForm.jsx';
import RegisterForm from '../components/ui/RegisterForm.jsx';
import VerifyForm from '../components/ui/VerifyForm.jsx';
import { useState } from 'react';

const Home = () => {
  const [open,setOpen] = useState(false);
  const [step,setStep] = useState('login'); // login | otp

    const openAuth = () => {
    setStep("login")   // always start from login
    setOpen(true)
   }


  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center flex-col gap-10">
      <GlassButton button
        onClick={openAuth}
        className="px-6 py-3 bg-white/20 text-white rounded-xl"
      >
        Get Started
      </GlassButton>

      
      <AuthModal isOpen={open} onClose={() => setOpen(false)}>
        {step === 'login' &&(
          
          <LoginForm 
            onSignup={() => setStep("register")}
            onSuccess={() => setStep('otp')}
          />
        )} 
        
        {/*Register */}

        {step === "register" && (
          <RegisterForm
            onSuccess={() => setStep("verifyEmail")}
            onLogin={() => setStep("login")}
            onBack={() => setStep("login")}
          />
        )}
        {step === "verifyEmail" && (
          <VerifyForm
            onBack={() => setStep("register")}
            onVerified={() => setStep("login")}
            onLogin={() => setStep("login")}
          />
        )}
        {/* OTP */}
        {step === 'otp' && (
        <VerifyOtpForm
            onBack={() => setStep('login')}
            onSuccess={() => {
              setOpen(false)
            }}
        />

        )}
      </AuthModal>
    </div>
  )
}

export default Home