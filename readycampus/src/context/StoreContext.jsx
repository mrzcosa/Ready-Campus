import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { products as seedProducts } from '../data/products.js'
import { categories as seedCategories } from '../data/categories.js'
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '../data/storeSettings.js'
import { createOrderRequest } from '../services/api.js'

const StoreContext = createContext(null)
const retiredProductIds = new Set(['23', '24', '25', '26', '27', '28', '29', '30', '31', '32'])
const readJson = (key, fallback) => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback } catch { return fallback }
}
const loadProducts = () => {
  const saved = readJson('readycampus.products', null)
  if (!Array.isArray(saved)) return seedProducts
  const merged = saved.filter((product) => !retiredProductIds.has(String(product.id))).map((product) => {
    const seed = seedProducts.find((item) => String(item.id) === String(product.id))
    if (!seed) return product
    return { ...seed, ...product, sheet: seed.sheet, tile: seed.tile }
  })
  const savedIds = new Set(merged.map((product) => String(product.id)))
  return [...merged, ...seedProducts.filter((product) => !savedIds.has(String(product.id)))]
}
const persist = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage may be disabled */ } }

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(loadProducts)
  const [categories, setCategories] = useState(() => readJson('readycampus.categories', seedCategories))
  const [cart, setCart] = useState(() => readJson('readycampus.cart', []))
  const [wishlist, setWishlist] = useState(() => readJson('readycampus.wishlist', []))
  const [orders, setOrders] = useState(() => readJson('readycampus.orders', []))
  const [customers, setCustomers] = useState(() => readJson('readycampus.customers', []))
  const [user, setUser] = useState(() => readJson('readycampus.user', null) || readJson('readycampus.session', null))
  const [toast, setToast] = useState(null)

  useEffect(() => persist('readycampus.products', products), [products])
  useEffect(() => persist('readycampus.categories', categories), [categories])
  useEffect(() => persist('readycampus.cart', cart), [cart])
  useEffect(() => persist('readycampus.wishlist', wishlist), [wishlist])
  useEffect(() => persist('readycampus.orders', orders), [orders])
  useEffect(() => persist('readycampus.customers', customers), [customers])
  useEffect(() => {
    if (!user) { localStorage.removeItem('readycampus.user'); sessionStorage.removeItem('readycampus.session'); return }
    persist(user.remember ? 'readycampus.user' : 'readycampus.session', user)
  }, [user])

  const notify = useCallback((message, tone = 'success') => setToast({ id: Date.now(), message, tone }), [])
  const addToCart = useCallback((id, quantity = 1) => {
    const product = products.find((item) => String(item.id) === String(id))
    if (!product || product.stock < 1) { notify('This product is currently out of stock.', 'error'); return false }
    const current = cart.find((item) => String(item.id) === String(id))?.quantity || 0
    if (current + quantity > product.stock) { notify(`Only ${product.stock} available.`, 'error'); return false }
    setCart((items) => {
      const existing = items.find((item) => String(item.id) === String(id))
      return existing ? items.map((item) => String(item.id) === String(id) ? { ...item, quantity: item.quantity + quantity } : item) : [...items, { id: product.id, quantity }]
    })
    notify(`${product.name} added to cart.`)
    return true
  }, [cart, notify, products])
  const setCartQuantity = useCallback((id, quantity) => {
    const product = products.find((item) => String(item.id) === String(id))
    if (quantity <= 0) { setCart((items) => items.filter((item) => String(item.id) !== String(id))); return }
    if (product && quantity > product.stock) { notify(`Only ${product.stock} available.`, 'error'); return }
    setCart((items) => items.map((item) => String(item.id) === String(id) ? { ...item, quantity } : item))
  }, [notify, products])
  const removeFromCart = useCallback((id) => setCart((items) => items.filter((item) => String(item.id) !== String(id))), [])
  const clearCart = useCallback(() => setCart([]), [])
  const toggleWishlist = useCallback((id) => {
    const product = products.find((item) => String(item.id) === String(id))
    const alreadySaved = wishlist.some((item) => String(item) === String(id))
    setWishlist((items) => alreadySaved ? items.filter((item) => String(item) !== String(id)) : [...items, product?.id ?? id])
    notify(alreadySaved ? 'Removed from your wishlist.' : `${product?.name || 'Product'} saved to your wishlist.`)
    return !alreadySaved
  }, [notify, products, wishlist])
  const signIn = useCallback(({ firstName, lastName, email, phone = '', remember = false }) => {
    const profile = { firstName: firstName || email.split('@')[0], lastName: lastName || '', email, phone, remember }
    setCustomers((list) => list.some((customer) => customer.email.toLowerCase() === email.toLowerCase()) ? list.map((customer) => customer.email.toLowerCase() === email.toLowerCase() ? { ...customer, firstName: profile.firstName, lastName: profile.lastName, phone: phone || customer.phone } : customer) : [...list, { ...profile, createdAt: new Date().toISOString() }])
    setUser(profile)
    notify('Signed in to the ReadyCampus demo.')
    return profile
  }, [notify])
  const signOut = useCallback(() => { setUser(null); notify('You have signed out.') }, [notify])
  const createOrder = useCallback(async (details) => {
    if (!cart.length) throw new Error('Your cart is empty.')
    const items = cart.map((entry) => {
      const product = products.find((item) => String(item.id) === String(entry.id))
      if (!product || entry.quantity > product.stock) throw new Error(`Please check the available stock for ${product?.name || 'an item'}.`)
      return { ...product, quantity: entry.quantity }
    })
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const savings = items.reduce((sum, item) => sum + Math.max(0, item.oldPrice - item.price) * item.quantity, 0)
    const order = {
      reference: `RC-${new Date().toISOString().slice(2, 10).replaceAll('-', '')}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      date: new Date().toISOString(), status: 'Pending', items, subtotal, savings,
      shipping: subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE, total: subtotal + (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE), ...details,
    }
    const result = await createOrderRequest(order)
    const savedOrder = result.connected ? { ...order, ...result.order } : order
    setOrders((list) => [savedOrder, ...list])
    if (!result.connected) setProducts((list) => list.map((product) => {
      const ordered = items.find((item) => String(item.id) === String(product.id))
      return ordered ? { ...product, stock: Math.max(0, product.stock - ordered.quantity) } : product
    }))
    setCart([])
    return savedOrder
  }, [cart, products])
  const updateOrderStatus = useCallback((reference, status) => setOrders((list) => list.map((order) => order.reference === reference ? { ...order, status } : order)), [])
  const saveProduct = useCallback((product) => {
    setProducts((items) => product.id ? items.map((item) => item.id === product.id ? { ...item, ...product } : item) : [...items, { ...product, id: Date.now(), rating: Number(product.rating) || 5, reviews: 0, popularity: 0, createdAt: new Date().toISOString().slice(0, 10), tile: Number(product.tile) || 0, collections: [], description: product.description || 'A useful school supply for everyday classes.' }])
  }, [])
  const deleteProduct = useCallback((id) => setProducts((items) => items.filter((item) => item.id !== id)), [])
  const saveCategory = useCallback((category) => {
    if (category.originalName) {
      setCategories((items) => items.map((item) => item.name === category.originalName ? { ...item, name: category.name } : item))
      setProducts((items) => items.map((item) => item.category === category.originalName ? { ...item, category: category.name } : item))
    } else setCategories((items) => [...items, { ...category, icon: category.icon || 'notebook', tone: 'navy' }])
  }, [])
  const deleteCategory = useCallback((category) => setCategories((items) => items.filter((item) => item.name !== category.name)), [])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const value = useMemo(() => ({ products, categories, cart, cartCount, wishlist, orders, customers, user, toast, notify, dismissToast: () => setToast(null), addToCart, setCartQuantity, removeFromCart, clearCart, toggleWishlist, signIn, signOut, createOrder, updateOrderStatus, saveProduct, deleteProduct, saveCategory, deleteCategory, setToast }), [products, categories, cart, cartCount, wishlist, orders, customers, user, toast, notify, addToCart, setCartQuantity, removeFromCart, clearCart, toggleWishlist, signIn, signOut, createOrder, updateOrderStatus, saveProduct, deleteProduct, saveCategory, deleteCategory])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used within StoreProvider')
  return context
}
