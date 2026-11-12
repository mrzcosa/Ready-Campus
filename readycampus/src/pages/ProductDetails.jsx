import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, Minus, Plus, ShieldCheck, Star, Truck } from 'lucide-react'
import { useStore } from '../context/StoreContext.jsx'
import { ProductGrid, ProductVisual } from '../components/products/ProductCard.jsx'
import { money } from '../utils/format.js'

export function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, addToCart, toggleWishlist, wishlist } = useStore()
  const product = products.find((item) => String(item.id) === String(id))
  const [quantity, setQuantity] = useState(1)
  if (!product) return <main className="product-detail-page"><div className="empty-state"><h1>Product not found</h1><p>This school supply may have been removed from the catalog.</p><Link className="button button-orange" to="/shop">Back to shop</Link></div></main>
  const saved = wishlist.some((item) => String(item) === String(product.id))
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4)
  const buyNow = () => { if (addToCart(product.id, quantity)) navigate('/cart') }
  return <main className="product-detail-page"><Link className="back-link" to="/shop"><ArrowLeft size={17} /> Back to shop</Link><section className="product-detail"><div className="detail-visual"><ProductVisual product={product} />{product.discount > 0 && <span className="discount-badge">-{product.discount}%</span>}</div><div className="detail-copy"><span className="eyebrow">{product.brand} · {product.category}</span><h1>{product.name}</h1><div className="rating detail-rating"><Star size={18} fill="currentColor" /><b>{Number(product.rating).toFixed(1)}</b><span>{product.reviews} customer ratings</span></div><div className="detail-prices"><strong>{money(product.price)}</strong>{product.oldPrice > product.price && <><del>{money(product.oldPrice)}</del><span className="detail-discount">Save {product.discount}%</span></>}</div><p className="detail-description">{product.description}</p><div className="stock-line"><span className={product.stock > 0 ? 'stock-dot' : 'stock-dot out'} />{product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</div><div className="detail-perks"><span><Truck size={20} /> Free shipping over ₱999</span><span><ShieldCheck size={20} /> Demo storefront item</span></div><div className="detail-actions"><div className="quantity-control"><button aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={16} /></button><span>{quantity}</span><button aria-label="Increase quantity" disabled={quantity >= product.stock} onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}><Plus size={16} /></button></div><button className="button button-orange" disabled={product.stock < 1} onClick={() => addToCart(product.id, quantity)}>Add to Cart</button><button className={`detail-wish ${saved ? 'is-saved' : ''}`} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'} onClick={() => toggleWishlist(product.id)}><Heart size={22} fill={saved ? 'currentColor' : 'none'} /></button></div><button className="buy-now" disabled={product.stock < 1} onClick={buyNow}>Buy Now</button><p className="demo-note">Checkout is a frontend demo. No payment is processed.</p></div></section>{related.length > 0 && <section className="related-section"><h2>More in {product.category}</h2><ProductGrid items={related} /></section>}</main>
}
