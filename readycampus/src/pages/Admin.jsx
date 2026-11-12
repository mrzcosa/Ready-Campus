import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Archive, BarChart3, Boxes, CircleAlert, ClipboardList, Pencil, Plus, Save, ShieldAlert, Trash2, Users, X } from 'lucide-react'
import { useStore } from '../context/StoreContext.jsx'
import { formatDate, money } from '../utils/format.js'

const tabs = [{ id: 'overview', name: 'Overview', icon: BarChart3 }, { id: 'products', name: 'Products', icon: Boxes }, { id: 'categories', name: 'Categories', icon: Archive }, { id: 'orders', name: 'Orders', icon: ClipboardList }, { id: 'customers', name: 'Customers', icon: Users }, { id: 'reports', name: 'Sales Reports', icon: BarChart3 }]
const blankProduct = (category) => ({ name: '', category: category || 'Notebooks', brand: 'Deli', price: '', oldPrice: '', discount: '', stock: '', rating: 5, tile: 0, description: '', image: '' })

function AdminProducts() {
  const { products, categories, saveProduct, deleteProduct, notify } = useStore()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blankProduct(categories[0]?.name))
  const [error, setError] = useState('')
  const update = (event) => setForm((data) => ({ ...data, [event.target.name]: event.target.value }))
  const open = (product = null) => { setEditing(product?.id ?? 'new'); setForm(product ? { ...product } : blankProduct(categories[0]?.name)); setError('') }
  const handleFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 1_000_000) { setError('Choose an image smaller than 1 MB for local demo storage.'); return }
    const reader = new FileReader(); reader.onload = () => setForm((data) => ({ ...data, image: String(reader.result) })); reader.readAsDataURL(file)
  }
  const submit = (event) => {
    event.preventDefault(); const price = Number(form.price); const oldPrice = Number(form.oldPrice || form.price); const stock = Number(form.stock)
    if (!form.name.trim() || !form.brand.trim() || !Number.isFinite(price) || price <= 0 || stock < 0) { setError('Enter a product name, brand, positive price, and valid stock count.'); return }
    saveProduct({ ...form, id: editing === 'new' ? undefined : editing, price, oldPrice, discount: oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0, stock, tile: Number(form.tile) || 0 })
    notify(editing === 'new' ? 'Demo product added.' : 'Demo product updated.'); setEditing(null)
  }
  const remove = (product) => { if (window.confirm(`Delete “${product.name}” from the local catalog?`)) { deleteProduct(product.id); notify('Product deleted from this browser.') } }
  return <section className="admin-panel"><div className="admin-panel-head"><div><h2>Product Management</h2><p>{products.length} school supply products</p></div><button className="button button-orange" onClick={() => open()}><Plus size={16} /> Add Product</button></div>{editing !== null && <form className="admin-editor" onSubmit={submit}><div className="admin-editor-head"><h3>{editing === 'new' ? 'Add a school supply' : 'Edit school supply'}</h3><button type="button" aria-label="Close editor" onClick={() => setEditing(null)}><X size={18} /></button></div><div className="form-grid"><label>Product name<input required name="name" value={form.name} onChange={update} /></label><label>Brand<input required name="brand" value={form.brand} onChange={update} /></label><label>Category<select name="category" value={form.category} onChange={update}>{categories.map((item) => <option key={item.name}>{item.name}</option>)}</select></label><label>Price (₱)<input required type="number" min="1" name="price" value={form.price} onChange={update} /></label><label>Original price (₱)<input type="number" min="0" name="oldPrice" value={form.oldPrice} onChange={update} /></label><label>Available stock<input required type="number" min="0" name="stock" value={form.stock} onChange={update} /></label><label className="full-span">Description<textarea rows="3" name="description" value={form.description} onChange={update} /></label><label className="full-span">Product image (under 1 MB)<input type="file" accept="image/*" onChange={handleFile} />{form.image && <img className="admin-image-preview" src={form.image} alt="Selected school supply preview" />}</label></div>{error && <p className="form-error">{error}</p>}<button className="button button-orange"><Save size={15} /> Save Product</button></form>}<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Product</th><th>Category / Brand</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><strong>{product.name}</strong></td><td>{product.category}<small>{product.brand}</small></td><td>{money(product.price)}</td><td><span className={product.stock < 5 ? 'low-stock' : ''}>{product.stock}</span></td><td><button aria-label={`Edit ${product.name}`} onClick={() => open(product)}><Pencil size={15} /></button><button className="danger-icon" aria-label={`Delete ${product.name}`} onClick={() => remove(product)}><Trash2 size={15} /></button></td></tr>)}</tbody></table></div></section>
}

function AdminCategories() {
  const { categories, products, saveCategory, deleteCategory, notify } = useStore()
  const [name, setName] = useState('')
  const [editing, setEditing] = useState('')
  const save = (event) => { event.preventDefault(); if (!name.trim()) return; saveCategory({ name: name.trim(), originalName: editing || undefined }); notify(editing ? 'Category renamed in this browser.' : 'Category added.'); setName(''); setEditing('') }
  const remove = (category) => {
    if (products.some((product) => product.category === category.name)) { notify('Move its products to another category before deleting it.', 'error'); return }
    if (window.confirm(`Delete the “${category.name}” category?`)) { deleteCategory(category); notify('Category deleted.') }
  }
  return <section className="admin-panel"><div className="admin-panel-head"><div><h2>Category Management</h2><p>Categories with products must be renamed or emptied before deletion.</p></div></div><form className="inline-admin-form" onSubmit={save}><input aria-label="Category name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="New school supply category" /><button className="button button-orange">{editing ? 'Save Name' : 'Add Category'}</button>{editing && <button type="button" onClick={() => { setName(''); setEditing('') }}>Cancel</button>}</form><div className="admin-category-list">{categories.map((category) => <article key={category.name}><span><strong>{category.name}</strong><small>{products.filter((item) => item.category === category.name).length} products</small></span><button onClick={() => { setEditing(category.name); setName(category.name) }} aria-label={`Rename ${category.name}`}><Pencil size={15} /></button><button className="danger-icon" onClick={() => remove(category)} aria-label={`Delete ${category.name}`}><Trash2 size={15} /></button></article>)}</div></section>
}

function AdminOrders() {
  const { orders, updateOrderStatus, notify } = useStore()
  const statuses = ['Pending', 'Confirmed', 'Processing', 'Ready for Shipment', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
  return <section className="admin-panel"><div className="admin-panel-head"><div><h2>Order Management</h2><p>Local demo orders only · status changes remain in this browser</p></div></div>{orders.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Reference</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order.reference}><td><Link to={`/track-order/${order.reference}`}>{order.reference}</Link><small>{order.items.length} products</small></td><td>{order.customer.fullName}<small>{order.customer.email}</small></td><td>{formatDate(order.date)}</td><td>{money(order.total)}</td><td><select value={order.status} onChange={(event) => { updateOrderStatus(order.reference, event.target.value); notify('Demo order status updated.') }}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div> : <p className="inline-empty">No demo orders have been created in this browser yet.</p>}</section>
}

function AdminCustomers() {
  const { customers, orders } = useStore()
  return <section className="admin-panel"><div className="admin-panel-head"><div><h2>Customer Management</h2><p>Demo profiles saved in this browser · passwords are not stored</p></div></div>{customers.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Customer</th><th>Email</th><th>Phone</th><th>Demo Orders</th></tr></thead><tbody>{customers.map((customer) => <tr key={customer.email}><td>{customer.firstName} {customer.lastName}</td><td>{customer.email}</td><td>{customer.phone || '—'}</td><td>{orders.filter((order) => order.customer.email.toLowerCase() === customer.email.toLowerCase()).length}</td></tr>)}</tbody></table></div> : <p className="inline-empty">Demo accounts will appear here after signup in this browser.</p>}</section>
}

function AdminReports() {
  const { products, orders } = useStore()
  const sales = orders.reduce((sum, order) => sum + order.total, 0)
  const quantities = orders.flatMap((order) => order.items).reduce((map, item) => map.set(item.name, (map.get(item.name) || 0) + item.quantity), new Map())
  const best = [...quantities.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  const months = useMemo(() => orders.reduce((map, order) => { const month = new Date(order.date).toLocaleDateString('en-PH', { month: 'short', year: 'numeric' }); map.set(month, (map.get(month) || 0) + order.total); return map }, new Map()), [orders])
  return <section className="admin-panel"><div className="admin-panel-head"><div><h2>Sales Reports</h2><p>Calculated from local demo orders only</p></div></div><div className="admin-stats compact-stats"><article><span>Total Sales</span><strong>{money(sales)}</strong></article><article><span>Demo Orders</span><strong>{orders.length}</strong></article><article><span>Catalog Items</span><strong>{products.length}</strong></article></div><div className="report-columns"><div><h3>Monthly demo sales</h3>{months.size ? [...months].map(([month, total]) => <p key={month} className="report-row"><span>{month}</span><b>{money(total)}</b></p>) : <p>No demo sales recorded.</p>}</div><div><h3>Best-selling products</h3>{best.length ? best.map(([name, quantity]) => <p key={name} className="report-row"><span>{name}</span><b>{quantity} sold</b></p>) : <p>No product sales recorded.</p>}</div></div></section>
}

export function Admin() {
  const { products, orders, customers } = useStore()
  const [params, setParams] = useSearchParams()
  const tab = tabs.some((item) => item.id === params.get('tab')) ? params.get('tab') : 'overview'
  const sales = orders.reduce((sum, order) => sum + order.total, 0)
  const active = tabs.find((item) => item.id === tab)
  const content = { products: <AdminProducts />, categories: <AdminCategories />, orders: <AdminOrders />, customers: <AdminCustomers />, reports: <AdminReports /> }
  return <main className="content-page admin-page"><div className="admin-title"><div><span className="eyebrow">ReadyCampus workspace</span><h1>Administrator Dashboard</h1></div><span className="demo-admin-label">DEMO MODE</span></div><div className="prototype-banner admin-warning"><ShieldAlert size={19} /><span>This dashboard has no backend authentication or authorization. Data changes are local to this browser and must not be used to manage a real store.</span></div><div className="admin-layout"><aside className="admin-sidebar">{tabs.map((item) => { const Icon = item.icon; return <button key={item.id} className={tab === item.id ? 'selected' : ''} onClick={() => setParams(item.id === 'overview' ? {} : { tab: item.id })}><Icon size={17} />{item.name}</button> })}</aside><section className="admin-main">{tab === 'overview' ? <><div className="admin-stats"><article><span>Total Products</span><strong>{products.length}</strong><Boxes /></article><article><span>Total Demo Orders</span><strong>{orders.length}</strong><ClipboardList /></article><article><span>Demo Customers</span><strong>{customers.length}</strong><Users /></article><article><span>Local Demo Sales</span><strong>{money(sales)}</strong><BarChart3 /></article></div><div className="admin-overview-card"><div><h2>Store activity</h2><p>Manage sample products, categories, and demo orders in this browser.</p></div><button onClick={() => setParams({ tab: 'products' })}><Boxes size={16} /> Manage products</button></div><div className="admin-overview-card"><div><h2>Security integration needed</h2><p>Connect a backend identity provider and role-based API before exposing any real administrator functions.</p></div><CircleAlert color="#f58220" /></div></> : <><div className="admin-section-heading"><h2>{active?.name}</h2></div>{content[tab]}</>}</section></div></main>
}
