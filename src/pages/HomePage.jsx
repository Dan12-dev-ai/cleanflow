import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiCheck, FiClock, FiMail, FiMapPin, FiMessageCircle, FiPhone, FiShield, FiTruck, FiZap } from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import heroPhoto from '../assets/images/laundry-hero.jpg'
import logoMark from '../assets/images/cleanflow-logo-mark.png'
import deliveryPhoto from '../assets/images/photo_2026-08-15_13-18-03.jpg'
import dryCleaningPhoto from '../assets/images/photo_2026-08-15_13-18-11.jpg'
import ironingPhoto from '../assets/images/photo_2026-08-15_13-18-22.jpg'
import foldingPhoto from '../assets/images/photo_2026-08-15_13-18-32.jpg'
import stainRemovalPhoto from '../assets/images/photo_2026-08-15_15-06-27.jpg'

const services = [
  [foldingPhoto, 'Wash & Fold', 'Professional washing, drying, and folding for your everyday clothes.'],
  [dryCleaningPhoto, 'Dry Cleaning', 'Specialized cleaning for suits, dresses, coats, and other delicate garments.'],
  [ironingPhoto, 'Ironing & Pressing', 'Get perfectly pressed and neatly finished clothes ready to wear.'],
  [deliveryPhoto, 'Pickup & Delivery', 'We collect your laundry and deliver it back clean and fresh.'],
  [stainRemovalPhoto, 'Stain Removal', 'Effective treatment for difficult stains while protecting your fabric.'],
]

const workflow = [
  ['01', 'Choose a Service', 'Select the laundry service you need, such as washing, ironing, dry cleaning, or stain removal.'],
  ['02', 'Schedule Your Order', 'Choose your preferred date and time for pickup or drop-off.'],
  ['03', 'We Collect & Clean', 'Our team collects your clothes and professionally cleans them according to their requirements.'],
  ['04', 'Quality Check', 'Every order is checked to ensure your clothes are clean, fresh, and properly prepared.'],
  ['05', 'Pay Securely', 'Complete your payment through your preferred payment method.'],
  ['06', 'Get Your Clothes Back', 'Pick up your clothes or have them conveniently delivered to you.'],
]

const values = [
  ['Quality', 'We never compromise on the quality of our cleaning.'],
  ['Reliability', 'We respect your time and deliver your clothes as promised.'],
  ['Care', 'Every garment is treated with attention and care.'],
  ['Customer Satisfaction', 'Your satisfaction is at the heart of everything we do.'],
]

export default function HomePage() {
  const [feedback, setFeedback] = useState({ name: '', rating: '5', message: '' })
  const [feedbackSent, setFeedbackSent] = useState(false)
  const { showToast } = useApp()

  const scrollTo = (id) => (event) => {
    event.preventDefault()
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', id)
  }

  const submitFeedback = (event) => {
    event.preventDefault()
    if (!feedback.name.trim() || !feedback.message.trim()) {
      showToast('Please add your name and feedback.', 'error')
      return
    }
    setFeedbackSent(true)
    setFeedback({ name: '', rating: '5', message: '' })
    showToast('Thank you for your feedback.')
  }

  const submitContact = (event) => {
    event.preventDefault()
    showToast('Your message has been sent successfully.')
    event.currentTarget.reset()
  }

  return (
    <div id="home" className="marketing-page">
      <nav className="marketing-nav">
        <Link to="/" className="cleanflow-brand marketing-brand"><span className="cleanflow-mark image-mark"><img src={logoMark} alt="" /></span><span><strong>CleanFlow</strong><small>Laundry OS</small></span></Link>
        <div className="marketing-links"><a href="#home" onClick={scrollTo('#home')}>Home</a><a href="#services" onClick={scrollTo('#services')}>Services</a><a href="#about" onClick={scrollTo('#about')}>About Us</a><a href="#how-it-works" onClick={scrollTo('#how-it-works')}>How It Works</a><a href="#contact" onClick={scrollTo('#contact')}>Contact</a></div>
        <div className="marketing-actions"><Link className="nav-login" to="/login">Login</Link><Link className="nav-register" to="/register">Get Started <FiArrowRight /></Link></div>
      </nav>

      <main className="hero-section">
        <section className="hero-copy"><p className="trust-pill"><i /> Reliable care for every garment</p><h1>Fresh Clothes.<br />Simple Service.<br /><span>Happy Customers.</span></h1><p className="hero-description">Experience a smarter and more convenient way to manage your laundry. We provide reliable washing, cleaning, ironing, and delivery services while making every step easy for you.</p><div className="hero-buttons"><Link className="primary-action" to="/register">Book a Laundry Service <FiArrowRight /></Link><a className="secondary-action" href="#services" onClick={scrollTo('#services')}>Explore Our Services</a></div></section>
        <section className="hero-visual"><img className="laundry-hero-image" src={heroPhoto} alt="Clean laundry and washing machine" /><div className="order-float"><b><FiCheck /></b><div><strong>Order Ready!</strong><p>CF-2847 · Wash complete</p><small><i>S</i> Sarah M. · 2 min ago</small></div></div></section>
      </main>

      <section id="why-us" className="marketing-section why-section"><p className="blue-kicker">WHY CHOOSE US?</p><h2>Quality Laundry Service You Can Trust</h2><p>We combine professional care, modern processes, and customer-focused service to make laundry easier and more convenient.</p><div className="why-grid">{[['Professional Cleaning', 'Your clothes are handled with care by trained staff.', FiShield], ['Fast & Reliable', 'We work efficiently to return your clothes on time.', FiClock], ['Easy Online Booking', 'Schedule your laundry service anytime.', FiZap], ['Safe & Secure', 'We carefully handle and track every order.', FiCheck], ['Convenient Delivery', 'Get your clean clothes delivered to your preferred location.', FiTruck]].map(([title, text, Icon]) => <article key={title}><Icon /><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>

      <section id="services" className="marketing-section services-section"><p className="blue-kicker">OUR SERVICES</p><h2>Our Solutions</h2><p>From everyday washing to delicate garment care, we provide complete laundry solutions designed around your needs.</p><div className="service-detail-grid">{services.map(([image, title, text]) => <article key={title}><img className="service-card-image" src={image} alt={title} /><div className="service-card-content"><h3>{title}</h3><p>{text}</p><Link to="/register">Book this service <FiArrowRight /></Link></div></article>)}</div><div className="section-cta"><h3>Ready for Fresh, Clean Clothes?</h3><p>Choose the service that fits your needs and let us handle the rest.</p><Link className="primary-action" to="/register">Book a Service <FiArrowRight /></Link></div></section>

      <section id="about" className="marketing-section about-section"><div className="about-copy"><p className="blue-kicker">ABOUT US</p><h2>About Our Laundry Service</h2><h3>Making Laundry Easier, One Order at a Time</h3><p>We are a customer-focused laundry service committed to providing high-quality cleaning with convenience and reliability. Our goal is simple: to take the stress out of laundry and give you clean, fresh, and carefully handled clothes.</p><div className="mission-grid"><article><h3>Our Mission</h3><p>To provide reliable, affordable, and high-quality laundry services while delivering an exceptional customer experience.</p></article><article><h3>Our Vision</h3><p>To become a trusted modern laundry service known for quality, convenience, technology, and customer satisfaction.</p></article></div></div><div className="values-card"><h3>Our Values</h3>{values.map(([title, text]) => <div key={title}><FiCheck /><p><strong>{title}</strong><span>{text}</span></p></div>)}</div></section>

      <section id="how-it-works" className="how-section workflow-section"><div><p className="blue-kicker">HOW IT WORKS</p><h2>Laundry Made Simple</h2><p className="how-intro">Getting your clothes professionally cleaned has never been easier.</p><div className="workflow-grid">{workflow.map(([number, title, text]) => <article key={number}><b>{number}</b><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div><div className="workflow-art"><div className="hero-machine"><span /><i /><b /></div><div className="hero-towel-stack"><i /><i /><i /></div></div></section>

      <section id="feedback" className="marketing-section feedback-section"><p className="blue-kicker">CUSTOMER FEEDBACK</p><h2>What Our Customers Say</h2><p>Your feedback helps us keep improving our service.</p><div className="feedback-layout"><form className="feedback-form" onSubmit={submitFeedback}><h3>Share Your Feedback</h3><label>Your Name<input value={feedback.name} onChange={(event) => setFeedback({ ...feedback, name: event.target.value })} placeholder="Enter your name" /></label><label>Rating<select value={feedback.rating} onChange={(event) => setFeedback({ ...feedback, rating: event.target.value })}><option value="5">★★★★★ Excellent</option><option value="4">★★★★ Very good</option><option value="3">★★★ Good</option><option value="2">★★ Needs improvement</option><option value="1">★ Poor</option></select></label><label>Your Feedback<textarea rows="4" value={feedback.message} onChange={(event) => setFeedback({ ...feedback, message: event.target.value })} placeholder="Tell us about your experience" /></label><button className="primary-action" type="submit">Send Feedback <FiMessageCircle /></button>{feedbackSent && <p className="feedback-success">Thank you — your feedback has been received.</p>}</form><div className="feedback-quotes"><article><span>★★★★★</span><p>“My clothes always come back fresh, neatly folded, and on time.”</p><strong>Sarah M.</strong><small>Happy customer</small></article><article><span>★★★★★</span><p>“The pickup and delivery service saves me so much time every week.”</p><strong>David T.</strong><small>Regular customer</small></article></div></div></section>

      <section id="contact" className="contact-section"><div className="contact-intro"><p className="blue-kicker">CONTACT US</p><h2>We’re Here to Help</h2><p>Have a question, need assistance with an order, or want to learn more about our services? Our team is ready to help.</p><div className="contact-details"><div><FiMapPin /><p><strong>Visit Us</strong><span>Come to our laundry center and speak with our team.</span></p></div><div><FiPhone /><p><strong>Call Us</strong><span>We're available to answer your questions and assist with your orders.</span></p></div><div><FiMail /><p><strong>Email Us</strong><span>Send us your questions or feedback and we'll get back to you.</span></p></div></div></div><form className="contact-form" onSubmit={submitContact}><h3>Let's Talk</h3><label>Full Name<input required placeholder="Enter your full name" /></label><label>Email Address<input required type="email" placeholder="you@example.com" /></label><label>Phone Number<input type="tel" placeholder="Your phone number" /></label><label>Subject<input required placeholder="How can we help?" /></label><label>Message<textarea required rows="4" placeholder="Write your message" /></label><button className="primary-action" type="submit">Send Message <FiArrowRight /></button></form></section>

      <section className="marketing-cta final-cta"><div><h2>Need Laundry Service?</h2><p>Let us handle the cleaning while you enjoy more time for yourself.</p><Link to="/register" className="primary-action">Book Your Laundry <FiArrowRight /></Link></div><div className="cta-towel">🧺</div></section>
      <footer className="marketing-footer"><div><div className="cleanflow-brand marketing-brand"><span className="cleanflow-mark image-mark"><img src={logoMark} alt="" /></span><span><strong>CleanFlow</strong><small>Laundry OS</small></span></div><p>Professional laundry care with simple, reliable service.</p></div><div><strong>Quick Links</strong><a href="#home">Home</a><a href="#services">Services</a><a href="#about">About Us</a><a href="#feedback">Feedback</a></div><div><strong>Contact Us</strong><a href="tel:+15551234567">+1 (555) 123-4567</a><a href="mailto:hello@cleanflow.io">hello@cleanflow.io</a><span>123 Laundry Lane, CleanCity, CA 90210</span></div></footer>
    </div>
  )
}
