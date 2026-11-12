import { Link } from 'react-router-dom'
import { BadgeCheck, ChevronRight } from 'lucide-react'
import { useStore } from '../context/StoreContext.jsx'

export function Brands() {
  const { products } = useStore()
  const brands = [...new Set(products.map((item) => item.brand).filter(Boolean))].sort()
  return <main className="content-page"><div className="page-intro"><span className="eyebrow">Trusted classroom favorites</span><h1>School Supply Brands</h1><p>Explore brands represented in our school supplies catalog.</p></div><div className="brand-card-grid">{brands.map((brand, index) => <Link className="brand-card" to={`/shop?brand=${encodeURIComponent(brand)}`} key={brand}><div className={`brand-monogram brand-color-${index % 6}`}>{brand.slice(0, 1)}</div><div><h2>{brand}</h2><p>{products.filter((item) => item.brand === brand).length} school supply products</p></div><BadgeCheck size={18} className="brand-verified" /><ChevronRight className="brand-card-arrow" size={18} /></Link>)}</div></main>
}
