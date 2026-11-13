import { Heart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext.jsx'
import { money } from '../../utils/format.js'

export function ProductVisual({ product }) {
  if (product.image) return <div className="product-photo"><img src={product.image} alt={product.name} /></div>
  return <div className={`product-photo tile-${Number(product.tile) % 10}`} role="img" aria-label={product.name} />
}

export function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore()
  const saved = wishlist.some((id) => String(id) === String(product.id))
  return <article className="product-card">
    <div className="product-visual-wrap">
      <Link className="product-image-link" to={`/products/${product.id}`} aria-label={`View ${product.name}`}><ProductVisual product={product} /></Link>
      {Number(product.discount) > 0 && <span className="discount-badge">-{product.discount}%</span>}
      <button className={`wish-button ${saved ? 'is-saved' : ''}`} aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} aria-pressed={saved} onClick={() => toggleWishlist(product.id)}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /></button>
      {product.tag && <span className="product-tag">{product.tag}</span>}
    </div>
    <div className="product-info">
      <span className="product-category">{product.category} · {product.brand}</span>
      <h3><Link to={`/products/${product.id}`}>{product.name}</Link></h3>
      <div className="rating"><Star size={13} fill="currentColor" /><b>{Number(product.rating || 0).toFixed(1)}</b><span>({product.reviews || 0})</span></div>
      <div className="product-buy"><span className="price">{money(product.price)}{product.oldPrice > product.price && <del>{money(product.oldPrice)}</del>}</span><button disabled={product.stock < 1} onClick={() => addToCart(product.id)}>{product.stock < 1 ? 'Out of stock' : 'Add to Cart'}</button></div>
    </div>
  </article>
}

export function ProductGrid({ items, emptyMessage = 'No products found.', className = '', gridClasses = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6' }) {
  if (!items.length) return <div className="empty-state"><span className="empty-state-icon">✎</span><h2>Nothing here yet</h2><p>{emptyMessage}</p><Link className="button button-orange" to="/shop">Browse school supplies</Link></div>
  return <div className={`product-grid grid ${gridClasses} gap-3 md:gap-4 ${className}`}>{items.map((product) => <ProductCard product={product} key={product.id} />)}</div>
}

