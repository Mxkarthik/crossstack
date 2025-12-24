import { Mail } from "lucide-react" // optional, clean icon

const VerifyForm = ({ onLogin }) => {
  return (
    <div className="space-y-6 text-white text-center">

      {/* Animated Icon */}
      <div className="flex justify-center">
        <div className="mail-pulse">
          <Mail size={36} className="text-white" />
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-semibold tracking-tight">
        Check your email
      </h2>

      {/* Message */}
      <p className="text-sm text-white/70 leading-relaxed">
        We’ve sent a verification link to your email address.  
        Please verify your email to continue.
      </p>

      {/* CTA */}
      <button
        onClick={onLogin}
        className="
          w-full py-3 rounded-xl
          bg-white/20 hover:bg-white/30
          transition font-medium
        "
      >
        Go to Login
      </button>

      {/* Footer Hint */}
      <p className="text-xs text-white/40">
        Didn’t receive the email? Check spam or try again later.
      </p>
    </div>
  )
}

export default VerifyForm
