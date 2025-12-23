import { useEffect, useState } from "react";

const Loading = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black">
      
      <div className="flex flex-col items-center gap-6">
        
        {/* Logo Reveal */}
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl animate-pulse" />

          {/* Lens circle */}
          <div className="relative w-16 h-16 rounded-full border border-white/30 flex items-center justify-center animate-[spin_3s_linear_infinite]">
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-xl font-semibold tracking-wide text-white animate-fadeIn">
          Privacy<span className="text-white/60"> Lens</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs tracking-[0.3em] uppercase text-white/50">
          Securing your data
        </p>
      </div>
    </div>
  );
};

export default Loading;
