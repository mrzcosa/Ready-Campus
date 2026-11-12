import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Search, ShoppingCart, UserRound } from 'lucide-react'
import { useStore } from '../../context/StoreContext.jsx'
import brandIcon from '../../assets/Logo/Ready Campus Logo.png'
import brandWordmark from '../../assets/Logo/Equiped for class.png'

export function Header() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { cartCount, user } = useStore()
  const search = (event) => { event.preventDefault(); navigate(`/shop?q=${encodeURIComponent(query.trim())}`) }
  return <header className="main-header"><div className="header-inner">
    <Link className="brand brand-image-lockup" to="/" aria-label="ReadyCampus home"><img className="brand-image-icon" src={brandIcon} alt="" /><img className="brand-image-wordmark" src={brandWordmark} alt="ReadyCampus — Equipped for Class" /></Link>
    <form className="search-form" onSubmit={search}><input aria-label="Search school supplies" placeholder="Search for school supplies, brands, and more..." value={query} onChange={(event) => setQuery(event.target.value)} /><button aria-label="Search"><Search size={22} /></button></form>
    <div className="header-actions"><Link className="account-action" to={user ? '/account' : '/login'}><UserRound size={29} strokeWidth={1.7} /><span>{user?.firstName || 'Login / Sign Up'}</span></Link><Link className="cart-action" to="/cart" aria-label={`Shopping cart, ${cartCount} items`}><ShoppingCart size={29} strokeWidth={1.8} /><span className="cart-count">{cartCount}</span></Link></div>
  </div></header>
}
