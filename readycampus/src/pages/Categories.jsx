import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { CategoryCard } from '../components/home/CategoryCard.jsx'
import { SectionTitle } from '../components/common/SectionTitle.jsx'

export function Categories() {
  const { categories, products } = useStore()
  return <main className="content-page"><div className="page-intro"><span className="eyebrow">Find what you need</span><h1>School Supply Categories</h1><p>Browse our complete range of classroom and study essentials.</p></div><SectionTitle title={`${categories.length} categories`} linkText="Shop everything" to="/shop" /><div className="all-category-grid">{categories.map((category) => <div key={category.name} className="category-listing"><CategoryCard item={category} /><span>{products.filter((product) => product.category === category.name).length} products</span></div>)}</div><p className="category-help">Need help finding something? <Link to="/help">Visit our help center</Link></p></main>
}
