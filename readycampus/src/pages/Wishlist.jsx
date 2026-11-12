import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useStore } from '../context/StoreContext.jsx'
import { ProductVisual } from '../components/products/ProductCard.jsx'
import { money } from '../utils/format.js'

export function Wishlist() {
  const { wishlist, products, toggleWishlist, addToCart } = useStore()
  const saved = wishlist.map((id) => products.find((product) => String(product.id) === String(id))).filter(Boolean)
  return <main className="content-page"><div className="page-intro"><span className="eyebrow">Your saved supplies</span><h1>My Wishlist</h1><p>Keep your classroom favorites close at hand.</p></div>{saved.length ? <div className="wishlist-grid">{saved.map((product) => <article className="wishlist-card" key={product.id}><Link to={`/products/${product.id}`} className="wishlist-photo"><ProductVisual product={product} /></Link><button className="wishlist-remove" onClick={() => toggleWishlist(product.id)} aria-label={`Remove ${product.name} from wishlist`}><Trash2 size={16} /></button><div className="wishlist-copy"><span className="product-category">{product.category}</span><h2><Link to={`/products/${product.id}`}>{product.name}</Link></h2><strong>{money(product.price)}</strong><div className="wishlist-actions"><button className="button button-orange" disabled={!product.stock} onClick={() => addToCart(product.id)}><ShoppingCart size={16} /> Add to Cart</button><Link to={`/products/${product.id}`} className="wishlist-view"><Heart size={15} /> Details</Link></div></div></article>)}</div> : <div className="empty-state"><Heart size={32} className="empty-heart" /><h2>Your wishlist is empty</h2><p>Tap the heart on a product to save it for later.</p><Link className="button button-orange" to="/shop">Browse supplies</Link></div>}</main>
}
