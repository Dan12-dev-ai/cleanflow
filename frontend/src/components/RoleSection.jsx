import { useMemo, useState } from 'react'
import { FiPlus, FiSearch } from 'react-icons/fi'

export default function RoleSection({ eyebrow, title, description, action = 'Add new', columns, rows, detail }) {
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const visible = useMemo(() => rows.filter((row) => Object.values(row).join(' ').toLowerCase().includes(query.toLowerCase())), [rows, query])
  return <div className="dashboard-stack">
    <section className="section-hero"><p>{eyebrow}</p><h2>{title}</h2><span>{description}</span></section>
    {message && <div className="action-notice">{message}</div>}
    <section className="dashboard-panel">
      <div className="panel-heading"><div><p>MANAGEMENT WORKSPACE</p><h3>{title}</h3></div><button className="solid-action" onClick={() => setMessage(`${action} form is ready.`)}><FiPlus /> {action}</button></div>
      <div className="section-tools"><label><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}...`} /></label><button onClick={() => setMessage('Filters updated.')}>Filter</button><button onClick={() => setMessage('Export is ready to download.')}>Export</button></div>
      <div className="data-table"><div className="data-head">{columns.map((column) => <b key={column}>{column}</b>)}<b>Actions</b></div>{visible.map((row) => <div className="data-row" key={row.id}>{columns.map((column) => <span key={column}>{row[column] ?? '—'}</span>)}<span className="row-actions"><button onClick={() => setMessage(`${row[columns[0]]} opened for editing.`)}>Edit</button><button onClick={() => setMessage(`${row[columns[0]]} details opened.`)}>View</button></span></div>)}</div>
    </section>
    <section className="dashboard-panel section-detail"><h3>Quick information</h3><p>{detail}</p><button onClick={() => setMessage('Changes saved successfully.')}>Save changes</button></section>
  </div>
}
