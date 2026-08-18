import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiCheck, FiEye, FiEyeOff, FiLock, FiMail, FiPhone, FiRefreshCw, FiUser, FiUserPlus } from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import logoMark from '../assets/images/cleanflow-logo-mark.png'
import registerBackground from '../assets/images/photo_2026-08-15_17-27-25.jpg'
import { api } from '../lib/api'

const initialForm = {
  fullName: '',
  email: '',
  countryCode: '+251',
  phone: '',
  password: '',
  confirmPassword: '',
  address: '',
  userType: 'Customer',
  termsAccepted: false,
}

const getSavedAccounts = () => {
  try {
    const accounts = JSON.parse(window.localStorage.getItem('laundrypro-accounts') || '[]')
    return Array.isArray(accounts) ? accounts : []
  } catch {
    return []
  }
}

const normalizePhone = (phone) => phone.replace(/[\s()-]/g, '')

const getPasswordScore = (password) => [
  password.length >= 8,
  /[a-z]/.test(password),
  /[A-Z]/.test(password),
  /\d/.test(password),
  /[^A-Za-z0-9]/.test(password),
].filter(Boolean).length

export default function RegistrationPage() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registered, setRegistered] = useState(false)
  const { setCustomerProfile, showToast } = useApp()
  const navigate = useNavigate()
  const passwordScore = useMemo(() => getPasswordScore(form.password), [form.password])

  const validate = () => {
    const nextErrors = {}
    const fullName = form.fullName.trim()
    const email = form.email.trim().toLowerCase()
    const phone = `${form.countryCode}${normalizePhone(form.phone)}`
    const accounts = getSavedAccounts()

    if (!fullName) nextErrors.fullName = 'Full name is required.'
    else if (fullName.length < 2 || fullName.length > 100) nextErrors.fullName = 'Use between 2 and 100 characters.'
    if (!email) nextErrors.email = 'Email address is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Enter a valid email address.'
    else if (accounts.some((account) => account.email === email)) nextErrors.email = 'An account with this email already exists.'
    if (!form.phone.trim()) nextErrors.phone = 'Phone number is required.'
    else if (!/^(?:\+251)9\d{8}$/.test(phone)) nextErrors.phone = 'Use an Ethiopian number such as 91 234 5678.'
    else if (accounts.some((account) => account.phone === phone)) nextErrors.phone = 'An account with this phone already exists.'
    if (!form.password) nextErrors.password = 'Password is required.'
    else if (form.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'
    if (!form.confirmPassword) nextErrors.confirmPassword = 'Please confirm your password.'
    else if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.'
    if (form.userType !== 'Customer') nextErrors.userType = 'Only customer accounts can be created here.'
    if (!form.termsAccepted) nextErrors.termsAccepted = 'Please accept the Terms of Service and Privacy Policy.'

    setErrors(nextErrors)
    return { nextErrors, email, phone, fullName }
  }

  const updateField = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: '' }))
  }

  const submit = async (event) => {
    event.preventDefault()
    const { nextErrors, email, phone, fullName } = validate()
    if (Object.keys(nextErrors).length) return

    try { await api('/auth/register', { method: 'POST', body: JSON.stringify({ name: fullName, email, phone, address: form.address.trim(), password: form.password, password_confirmation: form.confirmPassword }) }); setCustomerProfile({ name: fullName, phone, address: form.address.trim(), email, password: '' }); setRegistered(true); showToast('Account created successfully'); window.setTimeout(() => navigate('/login'), 1800) } catch (error) { showToast(error.message, 'error') }
  }

  const reset = () => {
    setForm(initialForm)
    setErrors({})
    setRegistered(false)
  }

  const fieldClass = (field) => `register-input-wrap ${errors[field] ? 'has-error' : ''}`

  if (registered) {
    return (
      <div className="register-screen">
        <img className="register-background-image" src={registerBackground} alt="" aria-hidden="true" />
        <div className="register-success-card">
          <div className="register-success-icon"><FiCheck /></div>
          <p className="blue-kicker">WELCOME TO CLEANFLOW</p>
          <h1>Account created successfully</h1>
          <p>Your customer account is ready. We’ll take you to the login page so you can start your first laundry order.</p>
          <Link className="login-submit" to="/login">Continue to Login <FiArrowRight /></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="register-screen">
      <img className="register-background-image" src={registerBackground} alt="" aria-hidden="true" />
      <div className="register-brand-header">
        <Link to="/" className="cleanflow-brand">
          <span className="cleanflow-mark image-mark"><img src={logoMark} alt="" /></span>
          <span><strong>CleanFlow</strong><small>Laundry OS</small></span>
        </Link>
        <div className="register-page-title"><i /><span>Create your account</span><i /></div>
      </div>
      <div className="register-shell">
        <main className="register-panel">
          <div className="register-panel-inner">
            <div className="register-heading">
              <div>
                <h1>Sign Up</h1>
                <p className="register-subtitle">Create your account to get started</p>
              </div>
            </div>

            <form onSubmit={submit} noValidate>
              <div className="register-form-grid">
                <label>Full Name <span className={fieldClass('fullName')}><FiUser /><input autoComplete="name" value={form.fullName} onChange={updateField('fullName')} placeholder="Enter your full name" /></span>{errors.fullName && <small className="field-error">{errors.fullName}</small>}</label>
                <label>Email Address <span className={fieldClass('email')}><FiMail /><input type="email" autoComplete="email" value={form.email} onChange={updateField('email')} placeholder="Enter your email address" /></span>{errors.email && <small className="field-error">{errors.email}</small>}</label>
                <label>Phone Number <span className={`register-input-wrap register-phone-wrap ${errors.phone ? 'has-error' : ''}`}><FiPhone /><input type="tel" autoComplete="tel-national" value={form.phone} onChange={updateField('phone')} placeholder="Enter your phone number" /><select value={form.countryCode} onChange={updateField('countryCode')} aria-label="Country code"><option value="+251">🇪🇹 +251</option><option value="+1">🇺🇸 +1</option><option value="+254">🇰🇪 +254</option></select></span>{errors.phone && <small className="field-error">{errors.phone}</small>}</label>
                <label>Password <span className={fieldClass('password')}><FiLock /><input type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={updateField('password')} placeholder="Create a password" /><button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <FiEyeOff /> : <FiEye />}</button></span>{errors.password && <small className="field-error">{errors.password}</small>}<span className={`password-strength strength-${passwordScore}`}><i /><i /><i /><i /><i /><small>{passwordScore < 3 ? 'Use letters, numbers and symbols' : passwordScore < 5 ? 'Good password' : 'Strong password'}</small></span></label>
                <label>Confirm Password <span className={fieldClass('confirmPassword')}><FiLock /><input type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" value={form.confirmPassword} onChange={updateField('confirmPassword')} placeholder="Confirm your password" /><button type="button" className="password-toggle" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'}>{showConfirmPassword ? <FiEyeOff /> : <FiEye />}</button></span>{errors.confirmPassword && <small className="field-error">{errors.confirmPassword}</small>}</label>
              </div>

              <label className={`register-terms ${errors.termsAccepted ? 'has-error' : ''}`}><input type="checkbox" checked={form.termsAccepted} onChange={updateField('termsAccepted')} /> <span>I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a></span></label>
              {errors.termsAccepted && <small className="field-error terms-error">{errors.termsAccepted}</small>}
              <button type="submit" className="register-create-button"><FiUserPlus /> Create Account</button>
              <button type="button" className="register-google-button" onClick={() => showToast('Google sign-in needs OAuth configuration', 'error')}><b>G</b> Continue with Google</button>
              <button type="button" className="register-reset" onClick={reset}><FiRefreshCw /> Clear form</button>
            </form>
            <p className="register-login-link">Already have an account? <Link to="/login">Log in</Link></p>
          </div>
        </main>
      </div>
    </div>
  )
}
