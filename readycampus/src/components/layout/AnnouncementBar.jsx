import { CircleHelp, MapPinCheck, Phone, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AnnouncementBar() {
  return <div className="announcement"><div className="announcement-inner"><div className="shipping-note"><Truck size={17} strokeWidth={2.2} /><span>Free Shipping on Orders ₱999 and above!</span></div><div className="announcement-links"><Link to="/track-order"><MapPinCheck size={15} />Track Order</Link><Link to="/help"><CircleHelp size={15} />Help</Link><Link to="/contact"><Phone size={14} />Contact Us</Link></div></div></div>
}
