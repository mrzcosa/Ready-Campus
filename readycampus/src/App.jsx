import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { useLayoutEffect } from 'react'
import { StoreProvider } from './context/StoreContext.jsx'
import { Header } from './components/layout/Header.jsx'
import { Navbar } from './components/layout/Navbar.jsx'
import { Footer } from './components/layout/Footer.jsx'
import { Toast } from './components/common/Toast.jsx'
import { Home } from './pages/Home.jsx'
import { Shop } from './pages/Shop.jsx'
import { Categories } from './pages/Categories.jsx'
import { Brands } from './pages/Brands.jsx'
import { ProductDetails } from './pages/ProductDetails.jsx'
import { Cart } from './pages/Cart.jsx'
import { Wishlist } from './pages/Wishlist.jsx'
import { Checkout } from './pages/Checkout.jsx'
import { OrderConfirmation, OrderTracking } from './pages/OrderTracking.jsx'
import { About, Contact, Help } from './pages/HelpContact.jsx'
import { Account, Auth, ForgotPassword } from './pages/Auth.jsx'
import { Orders } from './pages/Orders.jsx'
import { Admin } from './pages/Admin.jsx'
import './App.css'

function NotFound() {
  return <main className="content-page"><div className="empty-state"><span className="eyebrow">Page not found</span><h1>We couldn’t find that page.</h1><p>Head back to ReadyCampus and keep browsing school supplies.</p><Link className="button button-orange" to="/">Go to homepage</Link></div></main>
}

function StorefrontLayout() {
  const { pathname } = useLocation()
  const productPage = /^\/products\/[^/]+\/?$/.test(pathname)
  useLayoutEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return <div className={`app-root${productPage ? ' product-page-mode' : ''}`}>{!productPage && <><Header /><Navbar /></>}<Routes>
    <Route path="/" element={<Home />} />
    <Route path="/shop" element={<Shop />} />
    <Route path="/deals" element={<Shop dealsOnly />} />
    <Route path="/categories" element={<Categories />} />
    <Route path="/brands" element={<Brands />} />
    <Route path="/products/:id" element={<ProductDetails />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/wishlist" element={<Wishlist />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/order-confirmation/:reference" element={<OrderConfirmation />} />
    <Route path="/track-order" element={<OrderTracking />} />
    <Route path="/track-order/:reference" element={<OrderTracking />} />
    <Route path="/help" element={<Help />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/about" element={<About />} />
    <Route path="/login" element={<Auth />} />
    <Route path="/register" element={<Auth mode="register" />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/account" element={<Account />} />
    <Route path="/orders" element={<Orders />} />
    <Route path="/admin/*" element={<Admin />} />
    <Route path="*" element={<NotFound />} />
  </Routes>{!productPage && <Footer />}<Toast /></div>
}

function Storefront() {
  return <BrowserRouter><StorefrontLayout /></BrowserRouter>
}

function App() {
  return <StoreProvider><Storefront /></StoreProvider>
}

export default App
