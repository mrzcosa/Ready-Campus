import { Link } from 'react-router-dom'
import { PackageCheck } from 'lucide-react'
import { useStore } from '../context/StoreContext.jsx'
import { formatDate, money } from '../utils/format.js'

export function Orders() {
  const { user, orders } = useStore()
  const list = user ? orders.filter((order) => order.customer.email.toLowerCase() === user.email.toLowerCase()) : []
  return <main className="content-page"><div className="page-intro"><span className="eyebrow">Order history</span><h1>My Orders</h1></div>{list.length ? <div className="my-orders">{list.map((order) => <article key={order.reference}><div><PackageCheck size={19} /><span><strong>{order.reference}</strong><small>{formatDate(order.date)} Â· {order.items.length} items</small></span></div><span className="status-pill">{order.status}</span><strong>{money(order.total)}</strong><Link to={`/track-order/${order.reference}`}>Track order</Link></article>)}</div> : <div className="empty-state"><h2>No demo orders yet</h2><p>Completed demo checkout orders will appear here.</p><Link className="button button-orange" to="/shop">Browse school supplies</Link></div>}</main>
}


