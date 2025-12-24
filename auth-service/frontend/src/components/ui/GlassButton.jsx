const GlassButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        px-10 py-4 text-lg text-white
        bg-white/10 border border-white/30
        rounded-2xl backdrop-blur-xl
        hover:bg-white/20 transition
      "
    >
      {children}
    </button>
  )
}

export default GlassButton;