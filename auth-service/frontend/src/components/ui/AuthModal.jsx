const AuthModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Background blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Glass modal */}
      <div className="
        relative z-10 w-100
        bg-white/10 border border-white/20
        rounded-2xl p-6
        backdrop-blur-xl text-white
      ">
        {children}
      </div>
    </div>
  )
}

export default AuthModal
