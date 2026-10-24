/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiData } from '../lib/api'

const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [activities, setActivities] = useState([
    { id: 1, message: 'System dashboard is ready', when: 'Just now' },
    { id: 2, message: 'Payment records loaded', when: 'Today' },
    { id: 3, message: 'Customer records loaded', when: 'Today' },
  ])
  const [customerOrders, setCustomerOrders] = useState([])
  const [customerProfile, setCustomerProfileState] = useState({ name: 'Maya Chen', phone: '+233 20 123 4567', address: 'East Legon, Accra', password: '' })
  const [customerNotifications, setCustomerNotifications] = useState([
    { id: 1, message: 'Order LD-1042 is ready for pickup', type: 'Order update', read: false, when: 'Today' },
    { id: 2, message: 'Your pickup request has been received', type: 'Pickup', read: false, when: 'Yesterday' },
    { id: 3, message: 'Payment reminder for your active order', type: 'Payment', read: true, when: 'Yesterday' },
  ])
  const [staffOrders, setStaffOrders] = useState([])
  const [staffTasks, setStaffTasks] = useState([{ id: 1, task: 'Prepare express order LD-1042', priority: 'Urgent', due: 'Today, 3:00 PM', done: false }, { id: 2, task: 'Inspect dryer 02', priority: 'Normal', due: 'Today, 5:00 PM', done: false }])
  const [staffNotifications, setStaffNotifications] = useState([{ id: 1, message: 'LD-1044 was assigned to you', type: 'New order', read: false }, { id: 2, message: 'Express order deadline is today', type: 'Urgent', read: false }, { id: 3, message: 'Admin updated pickup schedule', type: 'Message', read: true }])
  const [staffProfile, setStaffProfileState] = useState({ name: 'Grace Boateng', phone: '+233 24 555 9911', email: 'grace@laundrypro.com', position: 'Laundry Specialist', password: '' })
  const [adminCustomers, setAdminCustomers] = useState([])
  const [adminStaff, setAdminStaff] = useState([])
  const [adminNotifications, setAdminNotifications] = useState([
    { id: 1, message: 'New staff member added to the team', type: 'Success', read: false, when: 'Today, 10:24 AM' },
    { id: 2, message: 'Backup completed successfully', type: 'System', read: false, when: 'Today, 09:42 AM' },
    { id: 3, message: 'SMS provider connection needs attention', type: 'Warning', read: true, when: 'Yesterday, 04:18 PM' },
  ])
  const [adminOrders, setAdminOrders] = useState([])
  const [adminServices, setAdminServices] = useState([])
  const [adminPayments, setAdminPayments] = useState([])
  const [inventory, setInventory] = useState([])
  const [adminSettings, setAdminSettings] = useState({ businessName: 'CleanFlow Laundry OS', phone: '+251 91 234 5678', autoReceipt: true, lowStockAlert: true, password: 'Admin@123' })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2200)
  }
  const logActivity = (message) => setActivities((current) => [{ id: Date.now(), message, when: 'Just now' }, ...current].slice(0, 12))
  const saveProfile = async (nextProfile, setProfile) => { setProfile(nextProfile); if (!localStorage.getItem('cleanflow_token')) return; try { const saved = await apiData('/profile', { method: 'PUT', body: JSON.stringify({ name: nextProfile.name, phone: nextProfile.phone, address: nextProfile.address, position: nextProfile.position }) }); setProfile((current) => ({ ...current, ...saved, position: saved.staff_profile?.position || current.position })) } catch (error) { showToast(error.message, 'error') } }
  const setCustomerProfile = (nextProfile) => saveProfile(nextProfile, setCustomerProfileState)
  const setStaffProfile = (nextProfile) => saveProfile(nextProfile, setStaffProfileState)

  const normalizeOrder = (order) => ({ id: order.order_number, dbId: order.id, customer: order.customer?.name || '', service: order.service?.name || order.items?.[0]?.service?.name || '', amount: Number(order.total_amount), status: order.status.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()), payment: order.payment_status.replace(/\b\w/g, (c) => c.toUpperCase()), createdAt: order.created_at?.slice(0, 10), phone: order.phone, clothes: order.clothes_type, quantity: `${order.quantity} ${order.unit}`, assigned: order.staff?.name || 'Unassigned' })
  const refreshData = async (activeUser = user) => {
    if (!activeUser) return
    try {
      const services = await apiData('/services')
      setAdminServices(services)
      if (activeUser.role === 'Customer') {
        setCustomerProfileState((current) => ({ ...current, name: activeUser.name, phone: activeUser.phone || '', address: activeUser.address || '', email: activeUser.email || '' }))
        const orders = await apiData('/orders'); setCustomerOrders(orders.map(normalizeOrder))
        const notifications = await apiData('/notifications'); setCustomerNotifications(notifications.map((n) => ({ id: n.id, message: n.data.message, read: !!n.read_at, when: n.created_at })))
      } else if (activeUser.role === 'Staff') {
        const [orders, tasks, customers, profile, notifications] = await Promise.all([apiData('/staff/orders'), apiData('/tasks'), apiData('/staff/customers'), apiData('/staff/profile'), apiData('/notifications')]); setStaffOrders(orders.map(normalizeOrder)); setStaffTasks(tasks); setAdminCustomers(customers); setStaffNotifications(notifications.map((n) => ({ id: n.id, message: n.data.message, type: n.data.type || 'System', read: !!n.read_at, when: n.created_at }))); setStaffProfileState((current) => ({ ...current, name: profile.name, phone: profile.phone || '', email: profile.email || '', position: profile.staff_profile?.position || '' }))
      } else {
        const [customers, staff, orders, payments, stock, notifications] = await Promise.all([apiData('/customers'), apiData('/staff'), apiData('/orders'), apiData('/payments'), apiData('/inventory'), apiData('/notifications')]); setAdminCustomers(customers); setAdminStaff(staff); setAdminOrders(orders.map(normalizeOrder)); setAdminPayments(payments.map((payment) => ({ id: payment.id, orderId: payment.order?.order_number || `Order #${payment.order_id}`, customer: payment.customer?.name || '', total: Number(payment.order?.total_amount || payment.amount), paid: payment.status === 'paid' ? Number(payment.amount) : 0, method: payment.payment_method, date: payment.paid_at || payment.created_at, status: payment.status, transaction_reference: payment.transaction_reference, proof_path: payment.proof_path }))); setAdminNotifications(notifications.map((n) => ({ id: n.id, message: n.data.message, type: n.data.type || 'System', read: !!n.read_at, when: n.created_at }))); setInventory(stock.map((item) => ({ ...item, threshold: item.minimum_threshold })))
      }
    } catch (error) { showToast(error.message, 'error') }
  }
  useEffect(() => { const token = localStorage.getItem('cleanflow_token'); if (!token) { setAuthLoading(false); return }; apiData('/auth/user').then((account) => { const activeUser = { ...account, role: account.role[0].toUpperCase() + account.role.slice(1) }; setUser(activeUser); refreshData(activeUser) }).catch(() => { localStorage.removeItem('cleanflow_token'); setUser(null) }).finally(() => setAuthLoading(false)) }, [])
  useEffect(() => { if (user) refreshData(user) }, [user?.id])

  const addCustomerOrder = (order) => setCustomerOrders((current) => [order, ...current])
  const updateCustomerOrder = (id, changes) => setCustomerOrders((current) => current.map((order) => order.id === id ? { ...order, ...changes } : order))
  const value = useMemo(() => ({ theme, setTheme, user, setUser, authLoading, toast, showToast, activities, logActivity, refreshData, customerOrders, addCustomerOrder, updateCustomerOrder, customerProfile, setCustomerProfile, customerNotifications, setCustomerNotifications, staffOrders, setStaffOrders, staffTasks, setStaffTasks, staffNotifications, setStaffNotifications, staffProfile, setStaffProfile, adminCustomers, setAdminCustomers, adminStaff, setAdminStaff, adminNotifications, setAdminNotifications, adminOrders, setAdminOrders, adminServices, setAdminServices, adminPayments, setAdminPayments, inventory, setInventory, adminSettings, setAdminSettings }), [theme, user, authLoading, toast, activities, customerOrders, customerProfile, customerNotifications, staffOrders, staffTasks, staffNotifications, staffProfile, adminCustomers, adminStaff, adminNotifications, adminOrders, adminServices, adminPayments, inventory, adminSettings])

  return (
    <AppContext.Provider value={value}>
      {children}
      {toast && <div role="status" className={`app-toast ${toast.type === 'error' ? 'app-toast-error' : ''}`}>{toast.message}</div>}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
