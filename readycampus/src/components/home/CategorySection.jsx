import { SectionTitle } from '../common/SectionTitle.jsx'
import { CategoryCard } from './CategoryCard.jsx'
export function CategorySection({ items }) {
  return <section className="category-section" id="categories"><SectionTitle title="Shop by Category" linkText="View All Categories" to="/categories" /><div className="category-row">{items.map((item) => <CategoryCard item={item} key={item.name} />)}</div></section>
}
