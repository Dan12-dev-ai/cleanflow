import { customers } from '../data/mockData'

export default function CustomersPage() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Customer directory</p>
          <h2 className="text-2xl font-semibold">Customers</h2>
        </div>
        <button className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-medium text-white">Add customer</button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t border-slate-200 dark:border-slate-800">
                <td className="px-4 py-3">
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{customer.email}</div>
                </td>
                <td className="px-4 py-3">{customer.phone}</td>
                <td className="px-4 py-3">{customer.orders}</td>
                <td className="px-4 py-3">{customer.score}%</td>
                <td className="px-4 py-3"><span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs text-sky-700 dark:bg-sky-950 dark:text-sky-300">{customer.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 p-4"><h3 className="font-semibold">Order History</h3><p className="mt-2 text-sm text-slate-500">Review each customer’s completed, active, and pending orders from the customer list.</p></section>
        <section className="rounded-2xl border border-slate-200 p-4"><h3 className="font-semibold">Contact Information</h3><p className="mt-2 text-sm text-slate-500">Phone, email, and address are available for every customer record.</p></section>
      </div>
    </div>
  )
}
