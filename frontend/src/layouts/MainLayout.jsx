import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { FiBell, FiBox, FiClipboard, FiCreditCard, FiGrid, FiLogOut, FiSearch, FiSettings, FiShoppingBag, FiTruck, FiUser, FiUsers } from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import { api } from '../lib/api'
import logoMark from '../assets/images/cleanflow-logo-mark.png'

const menu = {
  Admin: [['dashboard', 'Dashboard', FiGrid], ['customers', 'Customer management', FiUser], ['staff', 'Staff management', FiUsers], ['orders', 'Order management', FiShoppingBag], ['services', 'Services & pricing', FiBox], ['payments', 'Payments & finance', FiCreditCard], ['feedback', 'Customer feedback', FiClipboard], ['reports', 'Reports & analytics', FiClipboard], ['inventory', 'Inventory', FiTruck], ['notifications', 'Notifications', FiBell], ['settings', 'Settings & profile', FiSettings]],
  Staff: [['dashboard', 'Dashboard', FiGrid], ['orders', 'Assigned orders', FiShoppingBag], ['tasks', 'Assigned tasks', FiClipboard], ['customers', 'Customer details', FiUser], ['deliveries', 'Pickup & delivery', FiTruck], ['notifications', 'Notifications', FiBell], ['profile', 'My profile', FiUser]],
  Customer: [['dashboard', 'Dashboard', FiGrid], ['booking', 'Create new order', FiShoppingBag], ['orders', 'My orders', FiClipboard], ['services', 'Services & prices', FiCreditCard], ['payments', 'Payment & invoice', FiCreditCard], ['delivery', 'Pickup & delivery', FiTruck], ['feedback', 'Feedback', FiBell], ['notifications', 'Notifications', FiBell], ['profile', 'My profile', FiUser]],
}

export default function MainLayout() {
  const { user, setUser, customerNotifications, staffNotifications, adminNotifications } = useApp()
  const navigate = useNavigate()
  const role = user?.role || 'Customer'
  const notifications = role === 'Customer' ? customerNotifications : role === 'Staff' ? staffNotifications : adminNotifications
  const unreadNotifications = notifications.filter((notification) => !notification.read && !notification.read_at).length
  const initials = user?.name?.split(' ').map((name) => name[0]).join('').slice(0, 2)
  const logout = async () => { try { await api('/auth/logout', { method: 'POST' }) } catch {} localStorage.removeItem('cleanflow_token'); setUser(null); navigate('/login') }
  return (
    <div className={`role-app role-${role.toLowerCase()}`}>
      <aside className="role-sidebar">
        <div className="role-brand"><span className="sidebar-flow-mark image-mark"><img src={logoMark} alt="" /></span><span><strong>CleanFlow</strong><small>Laundry OS</small></span></div>
        <div className="role-tag"><span>{role}</span> workspace</div>
        <nav>{menu[role].map(([id, label, Icon]) => <NavLink to={`/${role.toLowerCase()}/${id}`} key={id} className={({ isActive }) => isActive ? 'active' : ''}><Icon />{label}</NavLink>)}</nav>
        <div className="sidebar-user"><span>{initials}</span><div><strong>{user?.name}</strong><small>{role}</small></div></div>
        <button className="sidebar-logout" onClick={logout}><FiLogOut /> Logout</button>
      </aside>
      <section className="role-content">
        <header className="role-header"><div><p>{role} portal</p><h1>{role} Dashboard</h1></div><label className="workspace-search"><FiSearch /><input placeholder="Search orders, customers, tasks..." /></label><div className="header-profile"><button aria-label="Notifications" onClick={() => navigate(`/${role.toLowerCase()}/notifications`)}><FiBell />{unreadNotifications > 0 && <i>{unreadNotifications}</i>}</button><span>{initials}</span><div><strong>{user?.name}</strong><small>{role === 'Admin' ? 'Administrator' : `${role} Member`}</small></div></div></header>
        <main><Outlet /></main>
      </section>
    </div>
  )
}
