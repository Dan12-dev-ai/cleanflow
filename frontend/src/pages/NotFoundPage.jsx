export default function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-sky-500">404</p>
        <h2 className="mt-3 text-3xl font-semibold">Page not found</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">The route you requested is unavailable.</p>
      </div>
    </div>
  )
}
