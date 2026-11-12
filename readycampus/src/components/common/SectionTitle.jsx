import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function SectionTitle({ title, linkText = 'View All Products', to = '/shop' }) {
  return <div className="section-heading"><h2>{title}</h2><Link to={to}>{linkText}<ArrowRight size={16} /></Link></div>
}
