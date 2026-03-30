import React, { useState, useEffect } from 'react'
import "../style/form.scss"
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const { user, loading, handleLogin } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  // Only redirect if a user exists
  useEffect(() => {
    if (user && !loading) {
      navigate('/')
    }
  }, [user, loading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password || submitting) return;
    
    setSubmitting(true)
    const success = await handleLogin(username, password)
    // No need to navigate here, the useEffect will handle it when 'user' changes
    if (!success) {
      setSubmitting(false)
    }
  }

  // Handle initial background auth check
  if (loading && !user) {
    return (
      <main>
        <div className="form-container">
          <h1>Checking session...</h1>
        </div>
      </main>
    )
  }

  return (
    <main>
      <div className="form-container">
        <h1>{submitting ? "Logging in..." : "Login"}</h1>
        <form onSubmit={handleSubmit} >
          <input
            onChange={(e) => { setUsername(e.target.value) }}
            type="text"
            name='username'
            id='username'
            placeholder='Enter username'
            disabled={submitting}
            value={username}
          />
          <input
            onChange={(e) => { setPassword(e.target.value) }}
            type="password"
            name='password'
            id='password'
            placeholder='Enter password'
            disabled={submitting}
            value={password}
          />
          <button 
            className={`button primary-button ${submitting ? 'loading' : ''}`} 
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Please wait..." : "Login"}
          </button>
        </form>
        <p>Don't have an account? <Link to='/register'>Create an account.</Link></p>
      </div>
    </main>
  )
}

export default Login


