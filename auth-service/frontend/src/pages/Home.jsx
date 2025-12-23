import React from 'react'
import GlassButton from '../components/ui/GlassButton.jsx';
import AuthModal from '../components/ui/AuthModal.jsx';
import LoginForm from '../components/ui/LoginForm.jsx';
import { useState } from 'react';

const Home = () => {
  const [open,setOpen] = useState(false);
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center flex-col gap-10">
      <GlassButton onClick={() => setOpen(true)}> Get Started </GlassButton>
      <AuthModal isOpen={open} onClose={() => setOpen(false)}>
        <LoginForm />
      </AuthModal>
    </div>
  )
}

export default Home