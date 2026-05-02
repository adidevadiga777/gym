import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { BASE_URL } from '../../../config'

const Register = () => {
  const { user, loading, handleRegister } = useAuth()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (user && !loading) {
      navigate('/')
    }
  }, [user, loading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !email || !password || submitting) return;

    setSubmitting(true)
    setError("")

    const success = await handleRegister({ username, email, password })
    if (!success) {
      setSubmitting(false)
      setError("Registration failed. Try a different username or email.")
    }
  }

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
        <h1>{submitting ? "Registering..." : "Register"}</h1>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name='username'
            id='username'
            placeholder='Enter username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={submitting}
            required
          />
          <input
            type="email"
            name='email'
            id='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            required
          />
          <input
            type="password"
            name='password'
            id='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
            required
          />
          <button
            className={`button primary-button ${submitting ? 'loading' : ''}`}
            type='submit'
            disabled={submitting}
          >
            {submitting ? "Please wait..." : "Register"}
          </button>
        </form>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBlock: '0.5rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#444' }}></div>
          <span style={{ fontSize: '12px', color: '#888', fontWeight: 'bold' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#444' }}></div>
        </div>

        <a href={`${BASE_URL}/api/auth/google`} className="google-button">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          <span>Register with Google</span>
        </a>

        <p>Already have an account? <Link to='/login'>Login.</Link></p>
      </div>
    </main>
  )
}

export default Register
