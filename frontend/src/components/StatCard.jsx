const styles = ['blue', 'amber', 'green', 'purple']

export default function StatCard({ title, value, hint, icon: Icon }) {
  const tone = styles[Math.abs([...title].reduce((total, char) => total + char.charCodeAt(0), 0)) % styles.length]
  return (
    <div className={`stat-card-figma ${tone}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3>{value}</h3>
          <p className="stat-title">{title}</p>
        </div>
        {Icon && <div className="stat-icon"><Icon /></div>}
      </div>
      <p className="stat-hint">{hint}</p>
    </div>
  )
}
