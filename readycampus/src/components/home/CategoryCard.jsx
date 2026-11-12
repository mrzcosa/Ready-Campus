import { Backpack, Calculator, FileText, Folder, Highlighter, LampDesk, Layers3, NotebookTabs, PenLine, Scissors, Triangle } from 'lucide-react'
import { Link } from 'react-router-dom'
const iconMap = { notebook: NotebookTabs, pen: PenLine, marker: Highlighter, calculator: Calculator, scissors: Scissors, layers: Layers3, folder: Folder, backpack: Backpack, triangle: Triangle, lamp: LampDesk }
export function CategoryCard({ item }) {
  const Icon = iconMap[item.icon] || FileText
  return <Link to={`/shop?category=${encodeURIComponent(item.name)}`} className="category-card"><span className={`category-icon ${item.tone}`}><Icon size={38} strokeWidth={1.7} /></span><span>{item.name}</span></Link>
}
