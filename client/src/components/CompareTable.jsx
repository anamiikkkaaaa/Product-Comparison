function CompareTable({ phone1, phone2 }) {
  const categories = Object.keys(phone1.specs).filter(cat => cat !== '_id')

  return (
    <div style={{
      maxWidth: '900px',
      margin: '2rem auto',
      backgroundColor: 'var(--bg-card)',
      borderRadius: '16px',
      border: '1px solid var(--border)',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        backgroundColor: 'var(--bg-primary)',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid var(--border)'
      }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Spec</span>
        <span style={{ color: 'var(--accent)', fontWeight: '600' }}>{phone1.name}</span>
        <span style={{ color: 'var(--accent)', fontWeight: '600' }}>{phone2.name}</span>
      </div>

      {categories.map(category => (
        <div key={category}>
          <div style={{
            padding: '0.6rem 1.5rem',
            backgroundColor: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border)',
            borderTop: '1px solid var(--border)',
          }}>
            <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {category}
            </span>
          </div>

          {Object.entries(phone1.specs[category])
            .filter(([key]) => key !== '_id' && key !== '')
            .map(([key, value]) => (
              <div key={key} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                padding: '0.75rem 1.5rem',
                borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{key}</span>
                <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', paddingRight: '1rem' }}>
                  {value}
                </span>
                <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                  {phone2.specs[category]?.[key] || '—'}
                </span>
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}

export default CompareTable