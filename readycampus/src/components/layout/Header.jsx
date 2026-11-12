import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, UserRound } from 'lucide-react'
import { useStore } from '../../context/StoreContext.jsx'
import brandIcon from '../../assets/Logo/Ready Campus Logo.png'
import brandWordmark from '../../assets/Logo/Equiped for class.png'

function readProfilePhoto() {
  try { return JSON.parse(localStorage.getItem('readycampus.profileDetails'))?.photo || '' } catch { return '' }
}

function readProfileName() {
  try { return JSON.parse(localStorage.getItem('readycampus.profileDetails'))?.fullName || '' } catch { return '' }
}

export function Header() {
  const [query, setQuery] = useState('')
  const [profilePhoto, setProfilePhoto] = useState(readProfilePhoto)
  const [profileName, setProfileName] = useState(readProfileName)
  const navigate = useNavigate()
  const { cartCount, user } = useStore()
  const accountName = profileName || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'My Profile'
  useEffect(() => {
    const refreshPhoto = () => { setProfilePhoto(readProfilePhoto()); setProfileName(readProfileName()) }
    window.addEventListener('storage', refreshPhoto)
    window.addEventListener('readycampus-profile-updated', refreshPhoto)
    return () => { window.removeEventListener('storage', refreshPhoto); window.removeEventListener('readycampus-profile-updated', refreshPhoto) }
  }, [])
  const search = (event) => { event.preventDefault(); navigate(`/shop?q=${encodeURIComponent(query.trim())}`) }
  return <header className="main-header"><div className="header-inner">
    <Link className="brand brand-image-lockup" to="/" aria-label="ReadyCampus home"><img className="brand-image-icon" src={brandIcon} alt="" /><img className="brand-image-wordmark" src={brandWordmark} alt="ReadyCampus — Equipped for Class" /></Link>
    <form className="search-form" onSubmit={search}><input aria-label="Search school supplies" placeholder="Search for school supplies, brands, and more..." value={query} onChange={(event) => setQuery(event.target.value)} /><button aria-label="Search"><Search size={22} /></button></form>
    <div className="header-actions"><Link className="account-action" to="/account" aria-label={accountName}><span className="profile-avatar-circle">{profilePhoto ? <img src={profilePhoto} alt="" /> : <UserRound size={23} strokeWidth={1.8} />}</span><span>{accountName}</span></Link><Link className="cart-action" to="/cart" aria-label={`Shopping cart, ${cartCount} items`}><ShoppingCart size={29} strokeWidth={1.8} /><span className="cart-count">{cartCount}</span></Link></div>
  </div></header>
}


