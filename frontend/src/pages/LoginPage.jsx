import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import logoMark from '../assets/images/cleanflow-logo-mark.png'
import loginPhoto from '../assets/images/photo_2026-08-15_13-46-11.jpg'
import { api } from '../lib/api'

const names = { Admin: 'Sarah Chen', Staff: 'Grace Boateng', Customer: 'Maya Chen' }

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Customer')
  const [showPassword, setShowPassword] = useState(false)
  const { setUser, showToast, refreshData } = useApp()
  const navigate = useNavigate()

  const detectedRole = (value) => {
    const normalizedEmail = value.trim().toLowerCase()
    if (normalizedEmail.startsWith('admin') || normalizedEmail.includes('admin@')) return 'Admin'
    if (normalizedEmail.startsWith('staff') || normalizedEmail.includes('staff@')) return 'Staff'
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!email || !password) {
      showToast('Please enter your email and password', 'error')
      return
    }
    try {
      const result = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, device_name: 'CleanFlow Web' }) })
      localStorage.setItem('cleanflow_token', result.token)
      const account = { ...result.user, role: result.user.role[0].toUpperCase() + result.user.role.slice(1) }
      setUser(account); await refreshData(account); navigate(`/${account.role.toLowerCase()}/dashboard`)
    } catch (error) { showToast(error.message, 'error') }
  }


  return (
    <div className="login-screen">
      <div className="login-shell">
        <main className="login-panel">
          <div className="login-panel-inner">
            <Link to="/" className="cleanflow-brand login-brand"><span className="cleanflow-mark image-mark"><img src={logoMark} alt="" /></span><span><strong>CleanFlow</strong><small>Laundry OS</small></span></Link>
            <h1>Welcome back</h1>
            <p className="login-subtitle">Log in to your account</p>
            <form onSubmit={submit}>
              <label>Email Address <span className="input-wrap"><FiMail /><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></span></label>
              <label>Password <span className="input-wrap"><FiLock /><input value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" /><button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <FiEyeOff /> : <FiEye />}</button></span></label>
              <div className="form-options"><label className="remember"><input type="checkbox" defaultChecked /> Remember me</label><a href="#forgot">Forgot password?</a></div>
              <button className="login-submit">Log In <FiArrowRight /></button>
              <div className="login-divider"><span>or</span></div>
              <button type="button" className="login-google-button" onClick={() => showToast('Google sign-in needs OAuth configuration', 'error')}><b>G</b> Continue with Google</button>
            </form>
            <p className="login-help">Don’t have an account? <Link to="/register">Sign up</Link></p>
          </div>
        </main>
        <aside className="login-art" aria-label="CleanFlow laundry illustration"><img className="login-art-image" src={loginPhoto} alt="Washing machine with flowing clean fabric" /></aside>
      </div>
    </div>
  )
}
