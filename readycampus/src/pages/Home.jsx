import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useStore } from '../context/StoreContext.jsx'
import { HeroBanner } from '../components/home/HeroBanner.jsx'
import { PromoCards } from '../components/home/PromoCards.jsx'
import { CategorySection } from '../components/home/CategorySection.jsx'
import { FeaturedProducts } from '../components/home/FeaturedProducts.jsx'
import { SectionTitle } from '../components/common/SectionTitle.jsx'

export function Home() {
  const { products, categories } = useStore()
  const bestSellers = useMemo(() => [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 6), [products])
  return <>
    <main className="page-shell">
      <section className="hero-layout" aria-label="Featured promotions"><HeroBanner /><PromoCards /></section>
      <CategorySection items={categories} />
      <FeaturedProducts products={products.slice(0, 6)} />
      <FeaturedProducts products={bestSellers} title="Best Sellers" compact />
      <section className="school-banner">
        <div className="school-banner-copy"><span className="eyebrow">A fresh start starts here</span><h2>Back to school, <em>ready for anything.</em></h2><p>Stock up on classroom must-haves and make this your best school year yet.</p><Link className="button button-orange" to="/shop">Shop the collection <ArrowRight size={17} /></Link></div>
        <div className="school-banner-art" aria-hidden="true"><span>✦</span><span>✎</span><span>✿</span></div>
      </section>
      <section className="brands-section"><SectionTitle title="Featured School Supply Brands" linkText="Explore all brands" to="/brands" /><div className="brand-list"><Link to="/shop?brand=Casio" className="brand-logo brand-strong">CASIO</Link><Link to="/shop?brand=Maped" className="brand-logo brand-round">MAPED</Link><Link to="/shop?brand=Pilot" className="brand-logo brand-script">PILOT</Link><Link to="/shop?brand=Stabilo" className="brand-logo brand-bold">STABILO</Link><Link to="/shop?brand=Faber-Castell" className="brand-logo brand-italic">FABER-CASTELL</Link><Link to="/shop?brand=Deli" className="brand-logo brand-light">DELI</Link></div></section>
    </main>
  </>
}
