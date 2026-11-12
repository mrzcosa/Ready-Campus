import { Link } from 'react-router-dom'
import { money } from '../../utils/format.js'
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '../../data/storeSettings.js'

export { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE }

export function CartSummary({ items, checkout = false }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const savings = items.reduce((sum, item) => sum + Math.max(0, item.oldPrice - item.price) * item.quantity, 0)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : subtotal > 0 ? STANDARD_SHIPPING_FEE : 0
  return <aside className="cart-summary"><h2>Order Summary</h2><div><span>Subtotal</span><b>{money(subtotal)}</b></div><div><span>Product savings</span><b className="savings-value">−{money(savings)}</b></div><div><span>Shipping</span><b>{shipping ? money(shipping) : 'Free'}</b></div>{subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && <p className="shipping-hint">Add {money(FREE_SHIPPING_THRESHOLD - subtotal)} more to qualify for free shipping.</p>}{subtotal >= FREE_SHIPPING_THRESHOLD && <p className="shipping-hint free">You unlocked free shipping!</p>}<div className="summary-total"><span>Total</span><b>{money(subtotal + shipping)}</b></div>{checkout ? <span className="demo-note">Demo checkout · Cash on Delivery only</span> : <Link className="button button-orange summary-checkout" to="/checkout" aria-disabled={!items.length}>Proceed to Checkout</Link>}{!checkout && <span className="summary-safe">Secure checkout preview · no online payment is processed</span>}</aside>
}
