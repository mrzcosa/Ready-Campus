import { Link } from 'react-router-dom'

export function Button({ children, to = '/shop', className = '' }) {
  return <Link className={`button ${className}`} to={to}>{children}</Link>
}
