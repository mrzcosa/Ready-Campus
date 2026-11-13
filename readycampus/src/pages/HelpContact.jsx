import { useMemo, useState } from 'react'
import { ChevronDown, Mail, MessageCircle, Search } from 'lucide-react'
import { useStore } from '../context/StoreContext.jsx'
import { submitContactMessage } from '../services/api.js'
import { Link } from 'react-router-dom'
import brandLogo from '../assets/Logo/Ready Campus Logo.png'

const faqs = [
  { question: 'How long does shipping take?', answer: 'Standard delivery timing depends on your location and is not yet connected to a carrier in this prototype. Orders of ₱999 or more qualify for free shipping in the demo cart.' },
  { question: 'Which payment methods are available?', answer: 'Cash on Delivery is available as a demo selection. GCash and card payments require an integrated payment provider and are not enabled here.' },
  { question: 'Can I return or exchange an item?', answer: 'Returns and exchanges need a connected customer support and order service. Contact our team to discuss an order; this prototype does not create a return request.' },
  { question: 'How can I track my order?', answer: 'Use the reference from a demo checkout on the Track Order page. Tracking is limited to orders saved in the same browser and does not query a delivery carrier.' },
  { question: 'How do I qualify for free shipping?', answer: 'The demo applies free shipping when your cart subtotal reaches ₱999. Smaller orders show an ₱85 standard shipping estimate.' },
  { question: 'Can I save products for later?', answer: 'Yes. Select the heart button on a school supply to add or remove it from your wishlist. Your wishlist is saved in this browser.' },
]

export function Help() {
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(0)
  const matches = useMemo(() => faqs.filter((faq) => `${faq.question} ${faq.answer}`.toLowerCase().includes(query.toLowerCase())), [query])
  return <main className="content-page"><div className="page-intro"><span className="eyebrow">We’re here to help</span><h1>Help & Frequently Asked Questions</h1><p>Find quick answers about school supplies, shipping, payment, and demo orders.</p></div><label className="faq-search"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search help articles" /></label><div className="faq-list">{matches.map((faq, index) => <section className="faq-item" key={faq.question}><button aria-expanded={expanded === index} onClick={() => setExpanded(expanded === index ? -1 : index)}><span>{faq.question}</span><ChevronDown size={18} /></button>{expanded === index && <p>{faq.answer}</p>}</section>)}{!matches.length && <p className="inline-empty">No answers match that search. Try “shipping” or contact us.</p>}</div><div className="help-contact-card"><MessageCircle size={21} /><div><strong>Still need a hand?</strong><span>Send a message to the ReadyCampus team.</span></div><a href="mailto:readycampus@gmail.com.ph">Email support</a></div></main>
}

export function Contact() {
  const { notify } = useStore()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [state, setState] = useState({ loading: false, message: '', tone: '' })
  const update = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }))
  const submit = async (event) => {
    event.preventDefault(); if (state.loading) return
    setState({ loading: true, message: '', tone: '' })
    try {
      const result = await submitContactMessage(form)
      if (!result.connected) { setState({ loading: false, message: result.reason, tone: 'error' }); return }
      setForm({ name: '', email: '', subject: '', message: '' }); setState({ loading: false, message: 'Your message was delivered to ReadyCampus support.', tone: 'success' }); notify('Your contact message was sent.')
    } catch (error) { setState({ loading: false, message: error.message, tone: 'error' }) }
  }
  return <main className="content-page"><div className="page-intro"><span className="eyebrow">Let’s talk</span><h1>Contact ReadyCampus</h1><p>Questions about stationery, an order, or classroom supplies? Send us a note.</p></div><div className="contact-layout"><form className="contact-form" onSubmit={submit}><div className="form-grid"><label>Full name<input required name="name" autoComplete="name" value={form.name} onChange={update} /></label><label>Email address<input required type="email" name="email" autoComplete="email" value={form.email} onChange={update} /></label><label className="full-span">Subject<input required name="subject" value={form.subject} onChange={update} /></label><label className="full-span">Message<textarea required name="message" rows="6" value={form.message} onChange={update} minLength="10" /></label></div>{state.message && <p className={state.tone === 'error' ? 'form-error' : 'form-success'} role="status">{state.message}</p>}<button className="button button-orange" disabled={state.loading}>{state.loading ? 'Sending…' : 'Send Message'}</button></form><aside className="contact-details"><h2>Customer support</h2><p><Mail size={17} /><a href="mailto:readycampus@gmail.com.ph">readycampus@gmail.com.ph</a></p><p><MessageCircle size={17} /> (02) 8123 4567</p><p>Monday–Friday, 9:00 AM–5:00 PM (PHT)</p><div className="prototype-banner">Contact sending is disabled until a service endpoint is configured. The form will tell you when a message has not been sent.</div></aside></div></main>
}

export function About() {
  return <main className="content-page"><section className="page-intro about-hero"><div className="about-hero-copy"><span className="eyebrow">About Us</span><h1>ReadyCampus!</h1><div className="about-copy"><p>ReadyCampus is an online store that provides affordable school supplies and selected safety essentials for students. We aim to make school shopping easier, more convenient, and accessible for students, parents, and schools.</p><p>We understand that students need complete and useful school supplies for their everyday learning. That is why we offer different school kits and customizable bundles that fit different needs and budgets.</p><p>Our goal is to help students prepare for school with quality, affordable, and convenient products.</p></div><Link className="button button-orange" to="/shop">Explore school supplies</Link></div><div className="about-hero-art"><img src={brandLogo} alt="ReadyCampus school emblem" /></div></section></main>
}

