import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, PackageCheck, Search, Truck } from 'lucide-react'
import { useStore } from '../context/StoreContext.jsx'
import { formatDate, money } from '../utils/format.js'

const statuses = ['Pending', 'Confirmed', 'Processing', 'Ready for Shipment', 'Shipped', 'Out for Delivery', 'Delivered']
function OrderDetails({ order }) {
  const cancelled = order.status === 'Cancelled'
  const activeIndex = statuses.indexOf(order.status)
  return <section className="order-track-card"><div className="order-track-head"><div><span className="product-category">Order reference</span><h2>{order.reference}</h2><span>Placed {formatDate(order.date)}</span></div><span className={`status-pill status-${order.status.toLowerCase().replaceAll(' ', '-')}`}>{order.status}</span></div>{cancelled ? <div className="cancelled-order">This order was cancelled.</div> : <div className="order-timeline">{statuses.map((status, index) => <div className={`timeline-step ${index <= activeIndex ? 'done' : ''}`} key={status}><span className="timeline-dot">{index < activeIndex ? <Check size={12} /> : index === activeIndex ? <PackageCheck size={14} /> : null}</span><span>{status}</span></div>)}</div>}<div className="order-detail-grid"><div><h3>Items</h3>{order.items.map((item) => <p key={item.id}>{item.name} × {item.quantity}</p>)}</div><div><h3>Delivery address</h3><p>{order.customer.fullName}</p><p>{order.address.building} {order.address.street}, Brgy. {order.address.barangay}</p><p>{order.address.city}, {order.address.province} {order.address.postalCode}</p></div><div><h3>Payment & total</h3><p>{order.payment} · Demo</p><strong>{money(order.total)}</strong></div></div><div className="track-actions"><Link to="/shop">Continue shopping</Link><span><Truck size={16} /> Local demo tracking · no carrier connection</span></div></section>
}

export function OrderTracking() {
  const { orders } = useStore()
  const { reference: routeReference } = useParams()
  const [reference, setReference] = useState(routeReference || '')
  const [submitted, setSubmitted] = useState(Boolean(routeReference))
  const order = submitted ? orders.find((item) => item.reference.toLowerCase() === reference.trim().toLowerCase()) : null
  return <main className="content-page"><div className="page-intro"><span className="eyebrow">Delivery updates</span><h1>Track Your Order</h1><p>Enter a reference created by this browser’s demo checkout.</p></div><form className="track-search" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}><label className="sr-only" htmlFor="order-reference">Order reference</label><input id="order-reference" required value={reference} onChange={(event) => setReference(event.target.value)} placeholder="e.g. RC-261112-AB12C" /><button className="button button-orange"><Search size={17} /> Track order</button></form>{order ? <OrderDetails order={order} /> : submitted ? <div className="inline-empty"><h2>We couldn’t find that order</h2><p>Check the reference and try again. Demo orders are saved in the browser where checkout was completed.</p></div> : <div className="prototype-banner"><PackageCheck size={18} /><span>Real carrier tracking requires a backend order service. This demo can look up orders created in the same browser.</span></div>}</main>
}

export function OrderConfirmation() {
  const { reference } = useParams()
  const { orders } = useStore()
  const order = orders.find((item) => item.reference === reference)
  return <main className="content-page"><div className="order-confirmation"><span className="confirmation-check"><Check size={32} /></span><span className="eyebrow">Demo order created</span><h1>{order ? 'Thanks for your order!' : 'Order reference not found'}</h1><p>{order ? 'Your order is stored locally in this browser. This is a frontend demo; no real payment or fulfillment was triggered.' : 'This reference is not available in the current browser.'}</p>{order && <div className="confirmation-reference"><span>Order reference</span><strong>{order.reference}</strong><span>{money(order.total)} · {formatDate(order.date)}</span></div>}<div className="confirmation-actions"><Link className="button button-orange" to={order ? `/track-order/${order.reference}` : '/shop'}>{order ? 'Track this order' : 'Shop school supplies'}</Link><Link className="button button-outline" to="/shop">Continue shopping</Link></div></div></main>
}
