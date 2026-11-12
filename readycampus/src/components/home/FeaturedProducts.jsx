import { SectionTitle } from '../common/SectionTitle.jsx'
import { ProductGrid } from '../products/ProductCard.jsx'
export function FeaturedProducts({ products, onAddToCart, title = 'Featured Products', compact = false }) {
  return <section className={`products-section ${compact ? 'compact-products' : ''}`} id={compact ? 'bestsellers' : 'featured'}><SectionTitle title={title} /><ProductGrid items={products} /></section>
}
