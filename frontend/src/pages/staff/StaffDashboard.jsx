import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FiBell, FiCheckCircle, FiClock, FiEdit3, FiEye, FiPackage, FiPhone, FiPlus, FiSearch, FiTrash2, FiTruck } from 'react-icons/fi'
import StatCard from '../../components/StatCard'
import { useApp } from '../../context/AppContext'
import { api } from '../../lib/api'

const statusOptions = ['Pending', 'Received', 'Washing', 'Drying', 'Ironing', 'Ready', 'Ready for Pickup', 'Delivered']

function wait(work, setLoading) {
  setLoading(true)
  setTimeout(() => { work(); setLoading(false) }, 450)
}

function LoadingButton({ loading, children, ...props }) {
  return <button {...props} disabled={loading}>{loading ? <><span className="button-spinner" /> Saving...</> : children}</button>
}

function StaffHero({ label, title, text }) {
  return <section className="section-hero staff-section-hero"><p>{label}</p><h2>{title}</h2><span>{text}</span></section>
}

export default function StaffDashboard() {
  const { section = 'dashboard' } = useParams()
  const app = useApp()
  const { staffOrders, setStaffOrders, staffTasks, setStaffTasks, staffNotifications, setStaffNotifications, staffProfile, setStaffProfile, adminCustomers, user, setUser, showToast, refreshData } = app
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [confirmPickup, setConfirmPickup] = useState(null)
  const filteredOrders = useMemo(() => staffOrders.filter((order) => (statusFilter === 'All' || order.status === statusFilter) && `${order.id} ${order.customer} ${order.phone} ${order.status}`.toLowerCase().includes(query.toLowerCase())), [staffOrders, statusFilter, query])
  const updateOrder = async (order, changes, message = 'Order updated successfully.') => { const target = typeof order === 'object' ? order : staffOrders.find((item) => item.id === order); if (!target) return; setLoading(true); try { if (changes.status) await api(`/orders/${target.dbId}/status`, { method: 'PATCH', body: JSON.stringify({ status: changes.status.toLowerCase().replaceAll(' ', '_') }) }); await refreshData(); showToast(message); setSelectedOrder(null) } catch (error) { showToast(error.message, 'error') } finally { setLoading(false) } }
  const orderToolbar = <div className="staff-toolbar"><label><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search assigned orders..." /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All</option>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></div>

  if (section === 'orders') return <div className="dashboard-stack"><StaffHero label="ASSIGNED ORDERS" title="Assigned orders" text="Search assigned orders and update their status without exporting files." /><section className="dashboard-panel">{orderToolbar}<OrderTable rows={filteredOrders} onAccept={(order) => updateOrder(order, { status: 'Received' }, 'Order accepted.')} onEdit={setSelectedOrder} onView={setSelectedOrder} onStatus={(order, status) => updateOrder(order, { status })} /></section>{selectedOrder && <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onSave={(changes) => updateOrder(selectedOrder, changes)} loading={loading} />}</div>
  if (section === 'tasks') return <Tasks tasks={staffTasks} setTasks={setStaffTasks} showToast={showToast} loading={loading} setLoading={setLoading} />
  if (section === 'customers') return <Customers customers={adminCustomers} showToast={showToast} />
  if (section === 'deliveries') return <LiveDeliveries showToast={showToast} refreshData={refreshData} />
  if (section === 'notifications') return <Notifications notifications={staffNotifications} setNotifications={setStaffNotifications} showToast={showToast} />
  if (section === 'profile') return <Profile profile={staffProfile} setProfile={setStaffProfile} user={user} setUser={setUser} showToast={showToast} loading={loading} setLoading={setLoading} />

  return <div className="dashboard-stack"><section className="dashboard-welcome staff-welcome"><div><p>OPERATIONS CENTER</p><h2>Keep today's laundry moving smoothly.</h2><span>Welcome, {staffProfile.name}. You have {staffOrders.length} orders assigned today.</span></div><FiPackage /></section><section className="stat-grid"><StatCard title="Assigned orders" value={staffOrders.length} hint="View and update orders" icon={FiPackage} /><StatCard title="In progress" value={staffOrders.filter((order) => ['Washing', 'Drying', 'Ironing'].includes(order.status)).length} hint="Laundry processing" icon={FiClock} /><StatCard title="Ready for pickup" value={staffOrders.filter((order) => order.status === 'Ready for Pickup' || order.status === 'Ready').length} hint="Confirm collection" icon={FiCheckCircle} /><StatCard title="Unread notifications" value={staffNotifications.filter((notification) => !notification.read).length} hint="View updates" icon={FiBell} /></section><section className="dashboard-grid"><article className="dashboard-panel"><div className="panel-heading"><div><p>YOUR NEXT ORDERS</p><h3>Work queue</h3></div></div><OrderTable rows={staffOrders.slice(0, 3)} onAccept={(order) => updateOrder(order, { status: 'Received' }, 'Order accepted.')} onEdit={setSelectedOrder} onView={setSelectedOrder} onStatus={(order, status) => updateOrder(order, { status })} /></article><article className="dashboard-panel"><div className="panel-heading"><div><p>DAILY TASKS</p><h3>Today's checklist</h3></div></div>{staffTasks.map((task) => <label className="staff-task-mini" key={task.id}><input type="checkbox" checked={task.done} onChange={() => setStaffTasks(staffTasks.map((item) => item.id === task.id ? { ...item, done: !item.done } : item))} />{task.task}</label>)}</article></section>{selectedOrder && <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onSave={(changes) => updateOrder(selectedOrder, changes)} loading={loading} />}</div>
}

function LiveDeliveries({ showToast, refreshData }) {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const load = async () => { setLoading(true); try { const result = await api('/deliveries'); setDeliveries(result.data ?? result) } catch (err) { setError(err.message) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])
  const confirmPickup = async (delivery) => { setLoading(true); try { await api(`/deliveries/${delivery.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'picked_up' }) }); if (delivery.order?.status === 'accepted') await api(`/orders/${delivery.order.id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'received' }) }); await Promise.all([load(), refreshData()]); showToast(`Pickup for ${delivery.order?.order_number} confirmed.`) } catch (err) { setError(err.message) } finally { setLoading(false) } }
  return <div className="dashboard-stack"><StaffHero label="PICKUP & DELIVERY" title="Assigned pickups and deliveries" text="Customer requests assigned by the admin appear here. Confirm collection when the laundry is received." />{error && <p className="form-error">{error}</p>}<section className="dashboard-panel staff-order-table">{loading && <p className="staff-empty-state">Loading delivery requests…</p>}{!loading && deliveries.map((delivery) => <article key={delivery.id}><div><b>{delivery.order?.order_number} · {delivery.customer?.name}</b><small>{delivery.customer?.phone} · Pickup: {delivery.pickup_date}</small></div><span>{delivery.pickup_address}</span><span className="order-status">{delivery.status.replaceAll('_', ' ')}</span>{delivery.status === 'assigned' && <button className="primary-customer-button" onClick={() => confirmPickup(delivery)}>Confirm pickup</button>}</article>)}{!loading && deliveries.length === 0 && <p className="staff-empty-state">No pickup or delivery requests have been assigned to you.</p>}</section></div>
}

function OrderTable({ rows, onAccept, onEdit, onView, onStatus }) {
  return <div className="staff-assigned-table-wrap"><table className="staff-assigned-table"><thead><tr><th>Order ID</th><th>Customer</th><th>Service</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map((order) => <tr key={order.id}><td><strong>{order.id}</strong></td><td>{order.customer}</td><td>{order.service}</td><td>{order.phone}</td><td><select value={order.status} onChange={(event) => onStatus(order, event.target.value)}>{[...new Set([...statusOptions, order.status])].map((status) => <option key={status}>{status}</option>)}</select></td><td><div className="staff-row-actions">{!order.accepted && <button onClick={() => onAccept(order)}>Accept</button>}<button onClick={() => onView(order)} aria-label="View order"><FiEye /></button><button onClick={() => onEdit(order)} aria-label="Edit order"><FiEdit3 /></button></div></td></tr>)}</tbody></table>{rows.length === 0 && <p className="staff-empty-state">No assigned orders match your search.</p>}</div>
}

function OrderModal({ order, onClose, onSave, loading }) {
  const [draft, setDraft] = useState(order)
  return <div className="modal-backdrop"><form className="staff-modal" onSubmit={(event) => { event.preventDefault(); onSave(draft) }}><div className="panel-heading"><div><p>ORDER DETAILS</p><h3>{order.id}</h3></div><button type="button" onClick={onClose}>Close</button></div><div className="form-grid"><label>Customer<input value={draft.customer} onChange={(event) => setDraft({ ...draft, customer: event.target.value })} /></label><label>Phone<input value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} /></label><label>Service<input value={draft.service} onChange={(event) => setDraft({ ...draft, service: event.target.value })} /></label><label>Status<select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>{[...new Set([...statusOptions, draft.status])].map((status) => <option key={status}>{status}</option>)}</select></label><label className="form-wide">Special instructions<textarea value={draft.instructions || ''} onChange={(event) => setDraft({ ...draft, instructions: event.target.value })} placeholder="Add care notes" /></label></div><LoadingButton className="primary-customer-button" loading={loading} type="submit">Save changes</LoadingButton></form></div>
}

function Tasks({ tasks, setTasks, showToast, loading, setLoading }) {
  const [name, setName] = useState('')
  const [priority, setPriority] = useState('Normal')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const add = (event) => { event.preventDefault(); if (!name.trim()) return showToast('Enter a task name.', 'error'); wait(() => { setTasks([...tasks, { id: Date.now(), task: name.trim(), priority, due: 'Today, 5:00 PM', done: false }]); setName(''); showToast('New task added.') }, setLoading) }
  const filteredTasks = tasks.filter((task) => (filter === 'All' || (filter === 'Completed' ? task.done : !task.done)) && task.task.toLowerCase().includes(query.toLowerCase()))
  return <div className="dashboard-stack"><StaffHero label="TASK MANAGEMENT" title="Assigned tasks" text="Add, search, filter, and complete your work plan without leaving the dashboard." /><section className="dashboard-panel"><form className="task-creator" onSubmit={add}><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Add a new task" /><select value={priority} onChange={(event) => setPriority(event.target.value)}><option>Normal</option><option>Urgent</option></select><LoadingButton loading={loading} type="submit"><FiPlus /> Add task</LoadingButton></form><div className="staff-toolbar task-toolbar"><label><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks..." /></label><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All</option><option>Pending</option><option>Completed</option></select></div><div className="task-list">{filteredTasks.map((task) => <div className="staff-task" key={task.id}><input type="checkbox" checked={task.done} onChange={() => { setTasks(tasks.map((item) => item.id === task.id ? { ...item, done: !item.done } : item)); showToast('Task updated.') }} /><span><b>{task.task}</b><small>{task.priority} · {task.due}</small></span><button onClick={() => { setTasks(tasks.filter((item) => item.id !== task.id)); showToast('Task removed.') }} aria-label="Remove task"><FiTrash2 /></button></div>)}{filteredTasks.length === 0 && <p className="staff-empty-state">No tasks match your search.</p>}</div></section></div>
}

function Customers({ customers, showToast }) {
  const [open, setOpen] = useState(null)
  const [note, setNote] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const filteredCustomers = customers.filter((customer) => (status === 'All' || customer.status === status) && `${customer.name} ${customer.phone} ${customer.email} ${customer.address}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="dashboard-stack"><StaffHero label="CUSTOMER INFORMATION" title="Customer details" text="Search customer contact, pickup details, and order history." /><section className="customer-cards dashboard-panel"><div className="staff-toolbar customer-search-toolbar"><label><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customers, phone, or address..." /></label><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option>{[...new Set(customers.map((customer) => customer.status))].map((value) => <option key={value}>{value}</option>)}</select></div>{filteredCustomers.map((customer) => <div key={customer.id}><span className="avatar-dot">{customer.name[0]}</span><p><b>{customer.name}</b><small>{customer.phone} · {customer.address}</small></p><button onClick={() => setOpen(customer)}>Open profile</button></div>)}{filteredCustomers.length === 0 && <p className="staff-empty-state">No customers match your search.</p>}</section>{open && <div className="modal-backdrop"><section className="staff-modal"><div className="panel-heading"><div><p>CUSTOMER PROFILE</p><h3>{open.name}</h3></div><button onClick={() => setOpen(null)}>Close</button></div><p className="panel-note">{open.phone} · {open.email}<br />{open.address}<br />Total orders: {open.orders}</p><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a service note" /><div className="modal-actions"><button onClick={() => showToast(`Calling ${open.phone}...`)}><FiPhone /> Call</button><button onClick={() => showToast(`${open.name}'s order history opened.`)}><FiEye /> View order history</button><button onClick={() => { showToast('Customer note saved.'); setOpen(null) }}>Save changes</button></div></section></div>}</div>
}

function Deliveries({ orders, confirmPickup, setConfirmPickup, updateOrder, loading }) {
  return <div className="dashboard-stack"><StaffHero label="PICKUP & DELIVERY" title="Confirm customer pickups" text="Confirm collections before they are marked as picked up." /><section className="dashboard-panel staff-order-table">{orders.map((order) => <article key={order.id}><div><b>{order.id} · {order.customer}</b><small>{order.phone} · {order.createdAt}</small></div><span>{order.address || 'Customer saved address'}</span><LoadingButton loading={loading} onClick={() => setConfirmPickup(order)}>Confirm pickup</LoadingButton></article>)}</section>{confirmPickup && <div className="modal-backdrop"><section className="staff-modal confirm-modal"><FiTruck /><h3>Confirm pickup?</h3><p>Mark {confirmPickup.id} as received from {confirmPickup.customer}?</p><div className="modal-actions"><button onClick={() => setConfirmPickup(null)}>Cancel</button><LoadingButton loading={loading} onClick={() => { updateOrder(confirmPickup.id, { status: 'Received' }, 'Pickup confirmed successfully.'); setConfirmPickup(null) }}>Confirm pickup</LoadingButton></div></section></div>}</div>
}

function Notifications({ notifications, setNotifications, showToast }) {
  const unread = notifications.filter((notification) => !notification.read).length
  return <div className="dashboard-stack"><StaffHero label="NOTIFICATIONS" title={`Notifications (${unread} unread)`} text="Read, dismiss, and keep your work updates organized." /><section className="dashboard-panel notification-list">{notifications.length ? notifications.map((notification) => <li key={notification.id} className={notification.read ? 'read' : ''}><i />{notification.message}<small>{notification.type}</small><span><button onClick={() => { setNotifications(notifications.map((item) => item.id === notification.id ? { ...item, read: true } : item)); showToast('Notification marked as read.') }}>Mark read</button><button onClick={() => { setNotifications(notifications.filter((item) => item.id !== notification.id)); showToast('Notification removed.') }}>Remove</button></span></li>) : <p>All caught up.</p>}</section></div>
}

function Profile({ profile, setProfile, user, setUser, showToast, loading, setLoading }) {
  const [draft, setDraft] = useState(profile)
  const save = (event) => { event.preventDefault(); if (!draft.name || !draft.phone || !draft.email || !draft.position) return showToast('Complete all required profile fields.', 'error'); wait(() => { setProfile(draft); setUser({ ...user, name: draft.name }); showToast('Staff profile saved successfully.') }, setLoading) }
  return <div className="dashboard-stack"><StaffHero label="MY PROFILE" title="Staff profile" text="Keep your contact details and role information up to date." /><form className="customer-form dashboard-panel" onSubmit={save}><div className="form-grid"><label>Name *<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label><label>Phone *<input value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} /></label><label>Email *<input value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></label><label>Position *<input value={draft.position} onChange={(event) => setDraft({ ...draft, position: event.target.value })} /></label><label className="form-wide">New password<input type="password" value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value })} placeholder="Leave blank to keep your current password" /></label></div><LoadingButton className="primary-customer-button" loading={loading} type="submit">Save profile</LoadingButton></form></div>
}
