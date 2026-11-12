import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap } from 'lucide-react'
import { useStore } from '../context/StoreContext.jsx'

export function Auth({ mode = 'login' }) {
  const register = mode === 'register'
  const { signIn } = useStore()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', remember: false, terms: false })
  const update = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }))
  const submit = (event) => {
    event.preventDefault(); setError('')
    if (form.password.length < 8) { setError('Use a password with at least 8 characters.'); return }
    if (register && form.password !== form.confirmPassword) { setError('Your passwords do not match.'); return }
    if (register && !form.terms) { setError('Please accept the demo terms to continue.'); return }
    signIn({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, remember: form.remember })
    const next = params.get('next')
    navigate(next?.startsWith('/') ? next : '/account')
  }
  return <main className="content-page auth-page"><div className="auth-card"><div className="auth-brand"><span><GraduationCap size={26} /></span><strong>Ready<span>Campus</span></strong></div><span className="eyebrow">{register ? 'Join the classroom community' : 'Welcome back'}</span><h1>{register ? 'Create your account' : 'Sign in to ReadyCampus'}</h1><p className="auth-subtitle">{register ? 'Save favorites and keep your demo orders together.' : 'Sign in to view your demo account and saved supplies.'}</p><div className="prototype-banner compact-prototype">Prototype sign-in only. No backend identity check is connected, and passwords are never saved.</div><form onSubmit={submit} className="auth-form">{register && <div className="form-grid"><label>First name<input required name="firstName" autoComplete="given-name" value={form.firstName} onChange={update} /></label><label>Last name<input required name="lastName" autoComplete="family-name" value={form.lastName} onChange={update} /></label></div>}<label>Email address<input required type="email" name="email" autoComplete="email" value={form.email} onChange={update} /></label>{register && <label>Phone number<input required type="tel" name="phone" autoComplete="tel" value={form.phone} onChange={update} /></label>}<label>Password<span className="password-field"><input required type={showPassword ? 'text' : 'password'} name="password" autoComplete={register ? 'new-password' : 'current-password'} value={form.password} onChange={update} minLength="8" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>{register && <label>Confirm password<input required type={showPassword ? 'text' : 'password'} name="confirmPassword" autoComplete="new-password" value={form.confirmPassword} onChange={update} /></label>}{!register && <div className="auth-options"><label className="check-label"><input type="checkbox" name="remember" checked={form.remember} onChange={update} /> Remember me</label><Link to="/forgot-password">Forgot password?</Link></div>}{register && <label className="check-label terms-label"><input type="checkbox" name="terms" checked={form.terms} onChange={update} /> I agree to the <Link to="/help">demo terms and privacy information</Link>.</label>}{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-orange auth-submit">{register ? 'Create Demo Account' : 'Sign in to Demo'}</button></form><p className="auth-switch">{register ? 'Already have an account?' : 'New to ReadyCampus?'} <Link to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create an account'}</Link></p></div></main>
}

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  return <main className="content-page auth-page"><div className="auth-card"><span className="eyebrow">Account help</span><h1>Password reset</h1><p className="auth-subtitle">Password recovery needs a connected identity provider. The demo does not send reset emails.</p>{submitted ? <div className="prototype-banner">No email was sent. Connect an authentication service to enable password recovery for {email}.</div> : <form className="auth-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}><label>Email address<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><button className="button button-orange">Check reset options</button></form>}<Link className="auth-switch-link" to="/login">Return to sign in</Link></div></main>
}

export function Account() {
  const { user, signOut, orders, wishlist } = useStore()
  if (!user) return <main className="content-page"><div className="empty-state"><h1>Sign in to view your account</h1><Link className="button button-orange" to="/login">Go to sign in</Link></div></main>
  const myOrders = orders.filter((order) => order.customer.email.toLowerCase() === user.email.toLowerCase())
  return <main className="content-page"><div className="page-intro"><span className="eyebrow">Demo account</span><h1>Hello, {user.firstName}</h1><p>{user.email} · Profile information is saved in this browser.</p></div><div className="account-actions-grid"><Link to="/wishlist"><h2>Wishlist</h2><p>{wishlist.length} saved school supplies</p></Link><Link to="/orders"><h2>My Orders</h2><p>{myOrders.length} demo orders</p></Link><button onClick={signOut}>Sign out</button></div></main>
}
