export default function ProfilePage() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">Account</p>
        <h2 className="text-2xl font-semibold">Profile</h2>
      </div>
      <div className="rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">Admin User</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Operations manager</p>
          </div>
          <button className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-medium text-white">Edit profile</button>
        </div>
      </div>
    </div>
  )
}
