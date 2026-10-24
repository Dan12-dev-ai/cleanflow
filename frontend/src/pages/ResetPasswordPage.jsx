import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function ResetPasswordPage() {
  const [params] = useSearchParams(); const navigate = useNavigate()
  const [form, setForm] = useState({ email: params.get('email') || '', password: '', password_confirmation: '' }); const [message, setMessage] = useState(''); const [error, setError] = useState('')
  const submit = async (event) => { event.preventDefault(); setError(''); setMessage(''); if (form.password.length < 8 || form.password !== form.password_confirmation) return setError('Use at least 8 characters and make both passwords match.'); try { await api('/auth/reset-password', { method: 'POST', body: JSON.stringify({ ...form, token: params.get('token') || '' }) }); setMessage('Password reset successfully. You can now log in.'); setTimeout(() => navigate('/login'), 1400) } catch (err) { setError(err.message) } }
  return <main className="login-screen"><section className="login-panel"><div className="login-panel-inner"><h1>Reset your password</h1><p className="login-subtitle">Create a new secure password.</p><form onSubmit={submit}><label>Email Address<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label>New password<input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label><label>Confirm password<input required type="password" value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} /></label>{error && <p className="form-error">{error}</p>}{message && <p className="feedback-success">{message}</p>}<button className="login-submit">Reset password</button></form><p className="login-help"><Link to="/login">Back to login</Link></p></div></section></main>
}
