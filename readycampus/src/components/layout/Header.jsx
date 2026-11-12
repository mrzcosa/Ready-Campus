import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, UserRound, ChevronDown } from 'lucide-react'
import { useStore } from '../../context/StoreContext.jsx'
import brandIcon from '../../assets/Logo/Ready Campus Logo.png'
import brandWordmark from '../../assets/Logo/Equiped for class.png'

function readProfilePhoto() {
  try { return JSON.parse(localStorage.getItem('readycampus.profileDetails'))?.photo || '' } catch { return '' }
}

function readProfileUsername() {
  try { return JSON.parse(localStorage.getItem('readycampus.profileDetails'))?.username || '' } catch { return '' }
}

export function Header() {
  const [query, setQuery] = useState('')
  const [profilePhoto, setProfilePhoto] = useState(readProfilePhoto)
  const [profileUsername, setProfileUsername] = useState(readProfileUsername)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)
  const navigate = useNavigate()
  const { cartCount } = useStore()
  const accountName = profileUsername || 'Guest shopper'

  useEffect(() => {
    const refreshPhoto = () => { setProfilePhoto(readProfilePhoto()); setProfileUsername(readProfileUsername()) }
    window.addEventListener('storage', refreshPhoto)
    window.addEventListener('readycampus-profile-updated', refreshPhoto)
    return () => { window.removeEventListener('storage', refreshPhoto); window.removeEventListener('readycampus-profile-updated', refreshPhoto) }
  }, [])

  useEffect(() => {
    if (!profileMenuOpen) return undefined
    const closeOnOutsideClick = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) setProfileMenuOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setProfileMenuOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [profileMenuOpen])

  const search = (event) => { event.preventDefault(); navigate(`/shop?q=${encodeURIComponent(query.trim())}`) }
  const closeProfileMenu = () => setProfileMenuOpen(false)

  return <header className="main-header"><div className="header-inner">
    <Link className="brand brand-image-lockup" to="/" aria-label="ReadyCampus home"><img className="brand-image-icon" src={brandIcon} alt="" /><img className="brand-image-wordmark" src={brandWordmark} alt="ReadyCampus — Equipped for Class" /></Link>
    <form className="search-form" onSubmit={search}><input aria-label="Search school supplies" placeholder="Search for school supplies, brands, and more..." value={query} onChange={(event) => setQuery(event.target.value)} /><button aria-label="Search"><Search size={22} /></button></form>
    <div className="header-actions">
<Link className="cart-action" to="/cart" aria-label={`Shopping cart, ${cartCount} items`}><ShoppingCart size={29} strokeWidth={1.8} /><span className="cart-count">{cartCount}</span></Link>
      <div className="profile-menu-wrap" ref={profileMenuRef}>
        <button className={`account-action${profileMenuOpen ? ' is-open' : ''}`} type="button" aria-label="Open profile menu" aria-haspopup="menu" aria-expanded={profileMenuOpen} onClick={() => setProfileMenuOpen((open) => !open)}>
          <span className="profile-avatar-circle">{profilePhoto ? <img src={profilePhoto} alt="" /> : <UserRound size={23} strokeWidth={1.8} />}</span><span>{profileUsername || 'My Profile'}</span><ChevronDown className="profile-menu-chevron" size={14} />
        </button>
        {profileMenuOpen && <div className="profile-dropdown" role="menu">
          <div className="profile-dropdown-user"><span className="profile-dropdown-avatar">{profilePhoto ? <img src={profilePhoto} alt="" /> : <UserRound size={22} />}</span><strong>{accountName}</strong></div>
          <div className="profile-dropdown-heading">Your Account</div>
          <Link role="menuitem" to="/account" onClick={closeProfileMenu}>My Profile</Link>
          <Link role="menuitem" to="/orders" onClick={closeProfileMenu}>My purchases</Link>
        </div>}
      </div>
      
    </div>
  </div></header>
}


