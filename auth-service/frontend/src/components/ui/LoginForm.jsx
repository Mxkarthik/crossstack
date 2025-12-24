import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { server } from '../../main.jsx'
import { toast } from 'react-toastify'

const LoginForm = ({ onSignup,onSuccess }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)

  const submitHandler = async (e) => {
    e.preventDefault()
    setBtnLoading(true)

    try {
      const { data } = await axios.post(`${server}/api/v1/login`, {
        email,
        password,
      })

      toast.success(data.message)
      localStorage.setItem("email", email)
      onSuccess()

    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed")
    } finally {
      setBtnLoading(false)
    }
  }

  return (
    <div className="space-y-6 text-white">
      <h2 className="text-2xl font-semibold text-center tracking-tight">
        Welcome back
      </h2>

      <form onSubmit={submitHandler} className="space-y-4">

        {/* Email */}
        <input
          type="email"
          placeholder="Email address"
          className="
            w-full p-3 rounded-lg
            bg-white/10 border border-white/20
            outline-none
            placeholder-gray-400
            focus:border-white/40 focus:bg-white/15
            transition
          "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="
              w-full p-3 pr-11 rounded-lg
              bg-white/10 border border-white/20
              outline-none
              placeholder-gray-400
              focus:border-white/40 focus:bg-white/15
              transition
            "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Eye Icon */}
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              text-gray-400 hover:text-white
              transition
            "
          >
            {showPassword ? (
              /* Eye Off */
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10.5 10.5A2.5 2.5 0 0013.5 13.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6.5 6.5C4.6 7.9 3.2 9.9 2.5 12C4.2 16.5 8 19.5 12 19.5C13.7 19.5 15.3 19 16.7 18.2" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            ) : (
              /* Eye */
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M1.5 12C3.7 7.5 7.6 4.5 12 4.5C16.4 4.5 20.3 7.5 22.5 12C20.3 16.5 16.4 19.5 12 19.5C7.6 19.5 3.7 16.5 1.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Submit */}
        <button
          disabled={btnLoading}
          className="
            w-full py-3 rounded-lg
            bg-white/20 hover:bg-white/30
            transition font-medium
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {btnLoading ? "Signing in…" : "Sign in"}
        </button>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <button
          type="button"
          onClick={onSignup}
          className="text-white underline hover:text-white/90"
        >
          Sign up
        </button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
