import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Bell, CreditCard, Eye, EyeOff, GraduationCap, Heart, Inbox, MapPin, ShieldCheck, ShoppingBag, SlidersHorizontal, Ticket, UserRound } from 'lucide-react'
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
  const { user, signOut, orders, wishlist, notify } = useStore()
  const displayName = user ? [user.firstName, user.lastName].filter(Boolean).join(' ') : 'Guest shopper'
  const readSaved = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback } catch { return fallback } }
  const [section, setSection] = useState('profile')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState(() => {
    const saved = readSaved('readycampus.profileDetails', {})
    return { fullName: saved.fullName || displayName, username: saved.username || user?.email?.split('@')[0] || 'guest_shopper', gender: saved.gender || '', birthDate: saved.birthDate || '', photo: saved.photo || '' }
  })
  const [addresses, setAddresses] = useState(() => readSaved('readycampus.addresses', []))
  const [paymentMethods, setPaymentMethods] = useState(() => readSaved('readycampus.paymentMethods', []))
  const [paymentForm, setPaymentForm] = useState({ type: 'Bank account', provider: '', holder: displayName, last4: '', expiry: '' })
  const [addressForm, setAddressForm] = useState({ label: 'Home', recipient: displayName, phone: user?.phone || '', street: '', barangay: '', city: '', province: '', postalCode: '' })
  const myOrders = user ? orders.filter((order) => order.customer?.email?.toLowerCase() === user.email.toLowerCase()) : orders
  const menu = [
    { id: 'profile', label: 'My Profile', icon: UserRound, type: 'section' },
    { id: 'banks', label: 'Banks & Cards', icon: CreditCard, type: 'section' },
    { id: 'addresses', label: 'Addresses', icon: MapPin, type: 'section' },
    { id: 'privacy', label: 'Privacy Settings', icon: ShieldCheck, type: 'disabled' },
    { id: 'notifications-settings', label: 'Notification Settings', icon: Bell, type: 'disabled' },
    { id: 'order-settings', label: 'Order Settings', icon: SlidersHorizontal, type: 'disabled' },
    { id: 'purchases', label: 'My Purchases', icon: ShoppingBag, type: 'link', to: '/orders' },
    { id: 'notifications', label: 'Notifications', icon: Inbox, type: 'disabled' },
    { id: 'vouchers', label: 'My Vouchers', icon: Ticket, type: 'disabled' },
    { id: 'wishlist', label: 'Wishlist / Saved Items', icon: Heart, type: 'link', to: '/wishlist' },
  ]
  const changeForm = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }))
  const choosePhoto = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) { setMessage('Choose a JPG, PNG, or WebP image up to 2 MB.'); return }
    const reader = new FileReader()
    reader.onload = () => { setForm((value) => ({ ...value, photo: String(reader.result) })); setMessage('Photo ready. Save your profile to keep it in this browser.') }
    reader.onerror = () => setMessage('That photo could not be opened. Choose another file.')
    reader.readAsDataURL(file)
  }
  const saveProfile = (event) => {
    event.preventDefault()
    try { localStorage.setItem('readycampus.profileDetails', JSON.stringify(form)); window.dispatchEvent(new Event('readycampus-profile-updated')); setMessage('Profile saved in this browser.'); notify('Profile saved.') }
    catch { setMessage('Could not save. The photo may be too large for browser storage.') }
  }
  const saveAddress = (event) => {
    event.preventDefault()
    const updated = [...addresses, { ...addressForm, id: Date.now() }]
    try { localStorage.setItem('readycampus.addresses', JSON.stringify(updated)); setAddresses(updated); setAddressForm({ label: 'Home', recipient: displayName, phone: user?.phone || '', street: '', barangay: '', city: '', province: '', postalCode: '' }); setMessage('Address saved in this browser.'); notify('Address saved.') }
    catch { setMessage('Could not save this address in browser storage.') }
  }
  const savePaymentMethod = (event) => {
    event.preventDefault()
    const method = { ...paymentForm, id: Date.now(), isDefault: paymentMethods.length === 0 }
    const updated = [...paymentMethods, method]
    try {
      localStorage.setItem('readycampus.paymentMethods', JSON.stringify(updated))
      setPaymentMethods(updated)
      setPaymentForm({ type: 'Bank account', provider: '', holder: displayName, last4: '', expiry: '' })
      setMessage('Payment method saved in this browser. No payment details were sent.')
      notify('Payment method saved.')
    } catch { setMessage('Could not save this payment method in browser storage.') }
  }
  const setDefaultPaymentMethod = (id) => {
    const updated = paymentMethods.map((method) => ({ ...method, isDefault: method.id === id }))
    localStorage.setItem('readycampus.paymentMethods', JSON.stringify(updated))
    setPaymentMethods(updated)
    notify('Default payment method updated.')
  }
  const providerOptions = paymentForm.type === 'Bank account' ? ['BDO', 'BPI', 'Metrobank', 'UnionBank', 'LandBank', 'PNB', 'Other'] : paymentForm.type === 'E-wallet' ? ['GCash', 'Maya'] : ['Visa', 'Mastercard', 'JCB', 'American Express']
  const updatePaymentType = (type) => {
    const options = type === 'Bank account' ? ['BDO', 'BPI', 'Metrobank', 'UnionBank', 'LandBank', 'PNB', 'Other'] : type === 'E-wallet' ? ['GCash', 'Maya'] : ['Visa', 'Mastercard', 'JCB', 'American Express']
    setPaymentForm({ type, provider: options[0], holder: displayName, last4: '', expiry: '' })
  }
  const removePaymentMethod = (id) => {
    const remaining = paymentMethods.filter((method) => method.id !== id)
    if (remaining.length && !remaining.some((method) => method.isDefault)) remaining[0].isDefault = true
    localStorage.setItem('readycampus.paymentMethods', JSON.stringify(remaining))
    setPaymentMethods(remaining)
    notify('Payment method removed.')
  };
  const removeAddress = (id) => {
    const updated = addresses.filter((address) => address.id !== id)
    localStorage.setItem('readycampus.addresses', JSON.stringify(updated)); setAddresses(updated); notify('Address removed.')
  }
  return <main className="content-page profile-page">
    <div className="page-intro profile-intro"><span className="eyebrow">Account</span><h1>My Profile</h1><p>Manage your profile and account preferences.</p></div>
    <div className="profile-settings-layout">
      <aside className="profile-sidebar">
        <div className="profile-sidebar-user"><div className="profile-avatar-small">{form.photo ? <img src={form.photo} alt="" /> : <UserRound size={25} />}</div><div><strong>{form.fullName || displayName}</strong><span>{user ? 'ReadyCampus demo account' : 'Guest session'}</span><button onClick={() => { setSection('profile'); setMessage('') }}>Edit Profile</button></div></div>
        <nav aria-label="Profile sections">{menu.map(({ id, label, icon: Icon, type, to }) => type === 'link' ? <Link key={id} className="profile-menu-link" to={to}><Icon size={18} /><span>{label}</span><small>{id === 'wishlist' ? wishlist.length : myOrders.length}</small></Link> : <button key={id} className={`profile-menu-link ${section === id ? 'selected' : ''}`} disabled={type === 'disabled'} onClick={() => { setSection(id); setMessage('') }}><Icon size={18} /><span>{label}</span>{type === 'disabled' && <small>Setup needed</small>}</button>)}</nav>
        {user && <button className="profile-signout" onClick={signOut}>Sign out</button>}
      </aside>
      <section className="profile-panel">
        {section === 'profile' ? <>
          <div className="profile-panel-heading"><span className="eyebrow">Account details</span><h2>My Profile</h2></div>
          <form className="profile-form" onSubmit={saveProfile}>
            <div className="profile-photo-field"><div className="profile-avatar-large">{form.photo ? <img src={form.photo} alt="Profile preview" /> : <UserRound size={35} />}</div><div><strong>Profile photo</strong><p>Choose a JPG, PNG, or WebP image up to 2 MB.</p><label className="profile-file-button">Choose photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} /></label></div></div>
            <label className="profile-field">Full name<input name="fullName" value={form.fullName} onChange={changeForm} required maxLength={80} /></label>
            <label className="profile-field">Username<input name="username" value={form.username} onChange={changeForm} required maxLength={30} /></label>
            {!user ? <p className="profile-guest-note">This profile belongs to your guest session. No email address is attached.</p> : <p className="profile-guest-note">Demo profile details are saved in this browser. Account security requires a connected identity service.</p>}
            <fieldset className="profile-gender"><legend>Gender</legend>{[['male', 'Male'], ['female', 'Female'], ['unspecified', 'Prefer not to say']].map(([value, label]) => <label key={value}><input type="radio" name="gender" value={value} checked={form.gender === value} onChange={changeForm} />{label}</label>)}</fieldset>
            <label className="profile-field profile-date-field">Date of birth<input type="date" name="birthDate" value={form.birthDate} onChange={changeForm} /></label>
            {message && <p className="profile-message" role="status">{message}</p>}
            <button className="button button-orange profile-save">Save Profile</button>
          </form>
        </> : section === 'banks' ? <>
          <div className="profile-panel-heading"><span className="eyebrow">Payment preferences</span><h2>Banks &amp; Cards</h2><p>Manage your saved payment methods for a faster checkout.</p></div>
          <div className="payment-method-list">{paymentMethods.map((method) => <article key={method.id}><span className="payment-method-icon"><CreditCard size={20} /></span><div className="payment-method-details"><strong>{method.provider || method.type}{method.isDefault && <em>Default</em>}</strong><span>{method.type} · {method.holder || 'Account holder'}</span><span className="payment-method-masked">{method.type === 'Debit / credit card' ? 'Card ending in ' : method.type === 'E-wallet' ? 'Wallet ending in ' : 'Account ending in '}{method.last4}</span>{method.expiry && <small>Expires {method.expiry}</small>}</div><div className="payment-method-actions">{!method.isDefault && <button type="button" onClick={() => setDefaultPaymentMethod(method.id)}>Set as default</button>}<button type="button" className="payment-method-remove" onClick={() => removePaymentMethod(method.id)}>Remove</button></div></article>)}{!paymentMethods.length && <div className="payment-method-empty"><span className="payment-method-icon"><CreditCard size={22} /></span><strong>No saved payment methods</strong><p>Add a card, bank, or wallet for quicker checkout.</p></div>}</div>
          <form className="profile-address-form payment-method-form" onSubmit={savePaymentMethod}><div className="payment-form-heading"><span className="payment-method-icon"><CreditCard size={20} /></span><div><h3>Add a payment method</h3><p>Choose a method and save its display details.</p></div></div><div className="payment-security-note"><ShieldCheck size={17} /><span>Secure setup preview. Full account numbers and card security codes are never stored here. Connect a payment provider to securely tokenize live payment details.</span></div><div className="profile-address-grid"><label>Payment type<select value={paymentForm.type} onChange={(event) => updatePaymentType(event.target.value)}><option>Bank account</option><option>E-wallet</option><option>Debit / credit card</option></select></label><label>{paymentForm.type === 'Bank account' ? 'Bank' : paymentForm.type === 'E-wallet' ? 'Wallet provider' : 'Card network'}<select required value={paymentForm.provider} onChange={(event) => setPaymentForm({ ...paymentForm, provider: event.target.value })}>{providerOptions.map((provider) => <option key={provider}>{provider}</option>)}</select></label><label>{paymentForm.type === 'Debit / credit card' ? 'Name on card' : 'Account holder'}<input required maxLength="60" value={paymentForm.holder} onChange={(event) => setPaymentForm({ ...paymentForm, holder: event.target.value })} autoComplete="cc-name" /></label><label>{paymentForm.type === 'E-wallet' ? 'Mobile number last four digits' : paymentForm.type === 'Bank account' ? 'Account last four digits' : 'Card last four digits'}<input required inputMode="numeric" pattern="[0-9]{4}" maxLength="4" value={paymentForm.last4} onChange={(event) => setPaymentForm({ ...paymentForm, last4: event.target.value.replace(/\D/g, '') })} placeholder="1234" /></label>{paymentForm.type === 'Debit / credit card' && <label>Expiration date<input required type="month" min={new Date().toISOString().slice(0, 7)} value={paymentForm.expiry} onChange={(event) => setPaymentForm({ ...paymentForm, expiry: event.target.value })} autoComplete="cc-exp" /></label>}</div>{message && <p className="profile-message" role="status">{message}</p>}<button className="button button-orange">Save payment method</button></form>
        </> : <>
          <div className="profile-panel-heading"><span className="eyebrow">Delivery details</span><h2>Addresses</h2><p>Saved addresses stay in this browser for the demo storefront.</p></div>
          <div className="saved-addresses">{addresses.map((address) => <article key={address.id}><div><strong>{address.label} · {address.recipient}</strong><p>{address.street}, {address.barangay}, {address.city}, {address.province} {address.postalCode}</p><span>{address.phone}</span></div><button onClick={() => removeAddress(address.id)}>Remove</button></article>)}{!addresses.length && <p className="profile-empty-address">No saved addresses yet.</p>}</div>
          <form className="profile-address-form" onSubmit={saveAddress}><h3>Add an address</h3><div className="profile-address-grid"><label>Address label<input required value={addressForm.label} onChange={(event) => setAddressForm({ ...addressForm, label: event.target.value })} /></label><label>Recipient full name<input required value={addressForm.recipient} onChange={(event) => setAddressForm({ ...addressForm, recipient: event.target.value })} /></label><label>Phone number<input required type="tel" value={addressForm.phone} onChange={(event) => setAddressForm({ ...addressForm, phone: event.target.value })} /></label><label className="address-wide">House / street<input required value={addressForm.street} onChange={(event) => setAddressForm({ ...addressForm, street: event.target.value })} /></label><label>Barangay<input required value={addressForm.barangay} onChange={(event) => setAddressForm({ ...addressForm, barangay: event.target.value })} /></label><label>City / Municipality<input required value={addressForm.city} onChange={(event) => setAddressForm({ ...addressForm, city: event.target.value })} /></label><label>Province<input required value={addressForm.province} onChange={(event) => setAddressForm({ ...addressForm, province: event.target.value })} /></label><label>Postal code<input required value={addressForm.postalCode} onChange={(event) => setAddressForm({ ...addressForm, postalCode: event.target.value })} /></label></div>{message && <p className="profile-message" role="status">{message}</p>}<button className="button button-orange">Save Address</button></form>
        </>}
      </section>
    </div>
  </main>
}





