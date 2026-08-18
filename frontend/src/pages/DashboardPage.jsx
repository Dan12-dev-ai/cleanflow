import { FiBox, FiDollarSign, FiShoppingBag, FiUsers } from 'react-icons/fi'
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import StatCard from '../components/StatCard'
import { customers, orders, payments, reportsData, services } from '../data/mockData'
import { useApp } from '../context/AppContext'

export default function DashboardPage() {
  const { user } = useApp()
  const role = user?.role || 'Admin'
  const permissions = role === 'Admin' ? ['Manage users and employees', 'Manage customers and services', 'Manage orders, inventory and payments', 'Generate reports and configure settings'] : role === 'Staff' ? ['Create and update orders', 'Update laundry status', 'Manage customer information', 'Receive payments, print receipts and manage deliveries'] : ['Place laundry orders', 'Track order status and history', 'Make payments and receive notifications', 'Submit feedback and manage profile']
  return (
    <div className="space-y-6">
      <div className="role-banner"><div><p>{role} Dashboard</p><h2>Welcome back, {user?.name || role}</h2></div><div>{permissions.map(item => <span key={item}>✓ {item}</span>)}</div></div>
      {role === 'Staff' && <div className="quick-role-panel"><h3>Assigned Tasks</h3><div><button>Process 12 washing orders</button><button>Collect 3 pending payments</button><button>Prepare 5 ready orders</button></div></div>}
      {role === 'Customer' && <div className="quick-role-panel"><h3>My Laundry</h3><div><button>Active Orders: 2</button><button>Payment History</button><button>Loyalty Points: 240</button><button>Download Latest Receipt</button></div></div>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Orders today" value="128" hint="+18% vs yesterday" icon={FiShoppingBag} />
        <StatCard title="Customers" value={customers.length} hint="3 VIP members" icon={FiUsers} />
        <StatCard title="Services" value={services.length} hint="2 premium options" icon={FiBox} />
        <StatCard title="Revenue" value="$18.4k" hint="On target this month" icon={FiDollarSign} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Weekly performance</p>
              <h3 className="text-lg font-semibold">Orders & revenue</h3>
            </div>
            <div className="rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-700 dark:bg-sky-950 dark:text-sky-300">Live</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#38bdf8" strokeWidth={3} />
                <Line type="monotone" dataKey="revenue" stroke="#818cf8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Latest orders</p>
              <h3 className="text-lg font-semibold">Queue</h3>
            </div>
          </div>
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{order.status}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">${order.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Payments</p>
              <h3 className="text-lg font-semibold">Recent transactions</h3>
            </div>
            <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Balanced</div>
          </div>
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                <div>
                  <p className="font-medium">{payment.customer}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{payment.method}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${payment.amount}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{payment.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Service mix</p>
          <h3 className="text-lg font-semibold">Popular choices</h3>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={services.map((service) => ({ name: service.name, value: service.price }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#0ea5e9" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4"><p className="text-sm text-slate-500">Live operations</p><h3 className="text-lg font-semibold">Machine Status</h3></div>
        <div className="grid gap-3 sm:grid-cols-3">{[{ name: 'Washer 01', status: 'Running', color: 'bg-emerald-100 text-emerald-700' }, { name: 'Dryer 02', status: 'Available', color: 'bg-blue-100 text-blue-700' }, { name: 'Washer 03', status: 'Maintenance', color: 'bg-amber-100 text-amber-700' }].map((machine) => <div key={machine.name} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"><span className="font-medium">{machine.name}</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${machine.color}`}>{machine.status}</span></div>)}</div>
      </div>
    </div>
  )
}
