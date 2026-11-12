import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import { useStore } from '../context/StoreContext.jsx'
import { ProductGrid } from '../components/products/ProductCard.jsx'
import { SectionTitle } from '../components/common/SectionTitle.jsx'

export function Shop({ dealsOnly = false }) {
  const { products, categories } = useStore()
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || ''
  const brand = params.get('brand') || ''
  const query = params.get('q') || ''
  const collection = params.get('collection') || ''
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [availability, setAvailability] = useState('all')
  const [sort, setSort] = useState(dealsOnly ? 'discount' : 'popular')
  const [visibleCount, setVisibleCount] = useState(12)
  useEffect(() => setSort(dealsOnly ? 'discount' : 'popular'), [dealsOnly])

  const filtered = useMemo(() => {
    let list = products.filter((product) => {
      const matchesText = !query || `${product.name} ${product.category} ${product.brand}`.toLowerCase().includes(query.toLowerCase())
      return matchesText && (!category || product.category === category) && (!brand || product.brand === brand) && (!collection || product.collections?.includes(collection)) && (!dealsOnly || product.discount > 0) && (!minPrice || product.price >= Number(minPrice)) && (!maxPrice || product.price <= Number(maxPrice)) && (availability === 'all' || (availability === 'available' ? product.stock > 0 : product.stock <= 0))
    })
    const sorters = { popular: (a, b) => b.popularity - a.popularity, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt), rating: (a, b) => b.rating - a.rating, discount: (a, b) => b.discount - a.discount }
    return [...list].sort(sorters[sort] || sorters.popular)
  }, [products, query, category, brand, collection, dealsOnly, minPrice, maxPrice, availability, sort])

  const title = category || (brand && `${brand} school supplies`) || (collection === 'student-essentials' ? 'Student Essentials' : collection === 'art-craft' ? 'Art & Craft Supplies' : collection === 'writing-tools' ? 'Writing Tools' : query ? `Search results for “${query}”` : dealsOnly ? 'Deals on School Supplies' : 'Shop School Supplies')
  const clear = () => { setParams({}); setMinPrice(''); setMaxPrice(''); setAvailability('all'); setSort(dealsOnly ? 'discount' : 'popular'); setVisibleCount(12) }
  return <main className="content-page">
    <div className="page-intro"><div><span className="eyebrow">Ready for every class</span><h1>{title}</h1><p>Thoughtful school essentials for students, teachers, and creative minds.</p></div></div>
    <div className="catalog-toolbar"><div className="catalog-count"><strong>{filtered.length}</strong> school supplies</div><label className="sort-control">Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="popular">Popularity</option>{dealsOnly && <option value="discount">Biggest discount</option>}<option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="newest">Newest</option><option value="rating">Highest Rated</option></select></label></div>
    <div className="catalog-layout"><aside className="filter-panel"><div className="filter-title"><SlidersHorizontal size={17} /><strong>Filters</strong><button onClick={clear}><RotateCcw size={13} /> Clear all</button></div><label>Category<select value={category} onChange={(event) => { const next = new URLSearchParams(params); event.target.value ? next.set('category', event.target.value) : next.delete('category'); setParams(next); setVisibleCount(12) }}><option value="">All categories</option>{categories.map((item) => <option key={item.name}>{item.name}</option>)}</select></label><label>Brand<select value={brand} onChange={(event) => { const next = new URLSearchParams(params); event.target.value ? next.set('brand', event.target.value) : next.delete('brand'); setParams(next) }}><option value="">All brands</option>{[...new Set(products.map((item) => item.brand))].sort().map((item) => <option key={item}>{item}</option>)}</select></label><fieldset><legend>Price range (₱)</legend><div className="price-range"><input aria-label="Minimum price" type="number" min="0" placeholder="Min" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} /><span>–</span><input aria-label="Maximum price" type="number" min="0" placeholder="Max" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} /></div></fieldset><label>Availability<select value={availability} onChange={(event) => setAvailability(event.target.value)}><option value="all">All products</option><option value="available">In stock</option><option value="out">Out of stock</option></select></label></aside><section className="catalog-results"><ProductGrid items={filtered.slice(0, visibleCount)} emptyMessage="Try a different search or clear your filters." />{filtered.length > visibleCount && <button className="load-more" onClick={() => setVisibleCount((count) => count + 12)}>Load more products</button>}</section></div>
  </main>
}
