import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu } from 'lucide-react'

const links = [{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, { label: 'Deals', to: '/deals' }, { label: 'Brands', to: '/brands' }, { label: 'About Us', to: '/about' }]
export function Navbar() {
  const [open, setOpen] = useState(false)
  return <nav className="navbar"><div className="nav-inner"><button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}><Menu size={23} /></button><div className={`nav-links ${open ? 'nav-open' : ''}`}>{links.map(({ label, to }) => <NavLink key={label} to={to} end={to === '/'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setOpen(false)}>{label}</NavLink>)}</div></div></nav>
}
