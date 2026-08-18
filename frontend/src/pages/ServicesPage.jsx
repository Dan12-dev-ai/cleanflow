import { useEffect, useState } from 'react'
import { apiData } from '../lib/api'

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [error, setError] = useState('')
  useEffect(() => { apiData('/services').then(setServices).catch((err) => setError(err.message)) }, [])
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Service catalog</p>
          <h2 className="text-2xl font-semibold">Services</h2>
        </div>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}<div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <div key={service.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{service.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{service.category}</p>
              </div>
              <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs text-sky-700 dark:bg-sky-950 dark:text-sky-300">{service.duration}</span>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-300">Fast turnaround and clean finish</p>
              <p className="text-xl font-semibold">{service.price} Birr</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
