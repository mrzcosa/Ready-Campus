import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const promos = [
  { title: 'Student Essentials', deal: 'Up to 20% Off', kind: 'student', icon: '📓', collection: 'student-essentials' },
  { title: 'Art & Craft Supplies', deal: 'Up to 15% Off', kind: 'art', icon: '🖍️', collection: 'art-craft' },
  { title: 'Writing Tools', deal: 'Best Deals This Week', kind: 'writing', icon: '🖊️', collection: 'writing-tools' },
]
export function PromoCards() {
  return <div className="promo-stack">{promos.map((item) => <Link className={`promo-card promo-${item.kind}`} to={`/shop?collection=${item.collection}`} key={item.title}><span><strong>{item.title}</strong><b>{item.deal}</b></span><i>{item.icon}</i><ArrowUpRight className="promo-arrow" size={16} /></Link>)}</div>
}
