import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LockKeyhole, ShieldAlert } from 'lucide-react'
import { useStore } from '../context/StoreContext.jsx'
import { CartSummary } from '../components/cart/CartSummary.jsx'
import { money } from '../utils/format.js'

export function Checkout() {
  const { cart, products, user, createOrder, notify } = useStore()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const items = useMemo(() => cart.map((entry) => { const product = products.find((item) => String(item.id) === String(entry.id)); return product ? { ...product, quantity: entry.quantity } : null }).filter(Boolean), [cart, products])
  const [form, setForm] = useState({ fullName: [user?.firstName, user?.lastName].filter(Boolean).join(' '), email: user?.email || '', phone: '', building: '', street: '', barangay: '', city: '', province: '', postalCode: '', delivery: 'Standard Delivery', payment: 'Cash on Delivery', notes: '' })
  const change = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }))
  const submit = async (event) => {
    event.preventDefault(); if (busy) return
    setBusy(true); setError('')
    try {
      const order = await createOrder({ customer: { fullName: form.fullName, email: form.email, phone: form.phone }, address: { building: form.building, street: form.street, barangay: form.barangay, city: form.city, province: form.province, postalCode: form.postalCode }, delivery: form.delivery, payment: form.payment, notes: form.notes })
      notify('Your demo order was created.')
      navigate(`/order-confirmation/${order.reference}`)
    } catch (cause) { setError(cause.message || 'Unable to create this demo order. Please review your cart.'); setBusy(false) }
  }
  if (!items.length) return <main className="content-page"><div className="empty-state"><h1>Nothing to check out</h1><p>Add school supplies to your cart before checkout.</p><Link className="button button-orange" to="/shop">Browse supplies</Link></div></main>
  return <main className="content-page"><div className="page-intro compact-intro"><span className="eyebrow">Almost there</span><h1>Demo Checkout</h1><p>Order details are stored in this browser only. No payment is processed.</p></div><div className="prototype-banner"><ShieldAlert size={19} /><span>Frontend prototype: Cash on Delivery is recorded as a demo payment choice. Connect a backend before accepting real orders or payments.</span></div><form className="checkout-layout" onSubmit={submit}><section className="checkout-sections"><fieldset className="checkout-section"><legend>Customer Information</legend><div className="form-grid"><label>Full name<input required name="fullName" autoComplete="name" value={form.fullName} onChange={change} /></label><label>Email address<input required type="email" name="email" autoComplete="email" value={form.email} onChange={change} /></label><label>Phone number<input required type="tel" name="phone" autoComplete="tel" pattern="[+0-9 ()-]{7,20}" value={form.phone} onChange={change} /></label></div></fieldset><fieldset className="checkout-section"><legend>Delivery Address</legend><div className="form-grid"><label>House / Building Number<input required name="building" value={form.building} onChange={change} /></label><label>Street<input required name="street" value={form.street} onChange={change} /></label><label>Barangay<input required name="barangay" value={form.barangay} onChange={change} /></label><label>City / Municipality<input required name="city" value={form.city} onChange={change} /></label><label>Province<input required name="province" value={form.province} onChange={change} /></label><label>Postal Code<input required inputMode="numeric" pattern="[0-9]{4}" maxLength="4" name="postalCode" value={form.postalCode} onChange={change} /></label></div></fieldset><fieldset className="checkout-section"><legend>Delivery & Payment</legend><div className="form-grid"><label>Delivery method<select name="delivery" value={form.delivery} onChange={change}><option>Standard Delivery</option></select><small>₱85 under ₱999 · Free on orders ₱999 and above</small></label><label>Payment method<select name="payment" value={form.payment} onChange={change}><option>Cash on Delivery</option></select><small>Online payment providers are not connected.</small></label><label className="full-span">Delivery notes (optional)<textarea name="notes" rows="3" value={form.notes} onChange={change} placeholder="Landmarks or delivery instructions" /></label></div></fieldset>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-orange place-order" type="submit" disabled={busy}><LockKeyhole size={17} />{busy ? 'Creating demo order…' : 'Place Demo Order'}</button></section><aside><div className="checkout-order-list"><h2>Your Items</h2>{items.map((item) => <div key={item.id}><span>{item.name} × {item.quantity}</span><b>{money(item.price * item.quantity)}</b></div>)}</div><CartSummary items={items} checkout /></aside></form></main>
}
