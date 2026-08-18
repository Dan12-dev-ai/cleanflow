import { useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
const content = {
  '/pricing': { title: 'Pricing', subtitle: 'Manage service prices and membership plans', items: ['Wash & Fold — $18', 'Dry Cleaning — $24', 'Ironing — $12', 'Express Service — $30'] },
  '/support': { title: 'Support', subtitle: 'Get help with your laundry account', items: ['Track an active order', 'Download a receipt', 'Payment history questions', 'Contact LaundryPro support'] },
}
export default function RoleToolsPage() { const { pathname } = useLocation(); const { user } = useApp(); const page = content[pathname] || content['/support']; return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">{user?.role} workspace</p><h2 className="text-2xl font-semibold">{page.title}</h2><p className="mt-2 text-sm text-slate-500">{page.subtitle}</p><div className="mt-6 grid gap-3 md:grid-cols-2">{page.items.map(item => <button key={item} className="rounded-2xl border border-slate-200 p-4 text-left font-medium hover:border-blue-300">{item}</button>)}</div></div> }
