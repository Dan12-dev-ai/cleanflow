import { reportsData } from '../data/mockData'
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'

export default function ReportsPage() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[['Daily Revenue', '$9,240'], ['Monthly Sales', '$42,860'], ['Most Popular Service', 'Wash & Fold'], ['Customer Growth', '+18%']].map(([label, value]) => <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><strong className="mt-3 block text-2xl">{value}</strong></div>)}
      </div>
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">Performance insights</p>
        <h2 className="text-2xl font-semibold">Reports</h2>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={reportsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="orders" fill="#38bdf8" radius={[10, 10, 0, 0]} />
            <Bar dataKey="revenue" fill="#818cf8" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      </div>
    </div>
  )
}
