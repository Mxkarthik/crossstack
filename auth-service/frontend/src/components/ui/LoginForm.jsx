import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const submitHandler = (e) => {
    e.preventDefault()
    console.log(email, password)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-center">
        Login
      </h2>

      <form onSubmit={submitHandler} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full py-3 bg-white/20 rounded-lg hover:bg-white/30 transition">
          Continue
        </button>

        <Link to="/register" className="block text-center text-sm text-gray-300">
          Don’t have an account?
        </Link>
      </form>
    </div>
  )
}

export default LoginForm
