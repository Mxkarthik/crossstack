import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { server } from "../../config/server"
import Loading from "../../Loading.jsx"

const VerifyEmail = () => {
  const { token } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const verifyUser = async () => {
    try {
      const { data } = await axios.post(
        `${server}/api/v1/verify/${token}`
      )

      setSuccessMessage(data.message || "Email verified successfully 🎉")
    } catch (error) {
      console.error(error)
      setErrorMessage(
        error?.response?.data?.message ||
        "Verification link expired or invalid"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    verifyUser()
  }, [])

  if (loading) return <Loading />

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div
        className="
          w-full max-w-md
          bg-white/10 backdrop-blur-xl
          border border-white/20
          rounded-2xl p-8
          text-center text-white
          animate-fade-in
        "
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
            {successMessage ? "✅" : "❌"}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-2">
          {successMessage ? "Email Verified" : "Verification Failed"}
        </h2>

        {/* Message */}
        <p className="text-sm text-white/70 mb-6">
          {successMessage || errorMessage}
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate("/login")}
          className="
            w-full py-3 rounded-xl
            bg-white/20 hover:bg-white/30
            transition font-medium
          "
        >
          Go to Login
        </button>
      </div>
    </div>
  )
}

export default VerifyEmail
