import React from 'react'
import GlassButton from '../components/ui/GlassButton.jsx';
import AuthModal from '../components/ui/AuthModal.jsx';
import LoginForm from '../components/ui/LoginForm.jsx';
import OtpForm from '../components/ui/VerifyOtpForm.jsx';
import { useState } from 'react';

const Home = () => {
  const [open,setOpen] = useState(false);
  const [step,setStep] = useState('login'); // login | otp
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center flex-col gap-10">
      <GlassButton onClick={() => setOpen(true)}> Get Started </GlassButton>
      
      <AuthModal isOpen={open} onClose={() => setOpen(false)}>
        {step === 'login' &&(
          <LoginForm onSuccess={() => setStep('otp')} />
        )}
        {step === 'otp' && (
          <OtpForm onBack={() => setStep('login')} />
        )}
      </AuthModal>
    </div>
  )
}

export default Home