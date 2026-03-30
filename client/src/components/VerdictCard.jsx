function VerdictCard({ verdict, phone1Name, phone2Name }) {
  return (
    <div style={{
      maxWidth: '900px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: 'var(--bg-card)',
      borderRadius: '16px',
      border: '1px solid var(--accent)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{
          backgroundColor: 'var(--accent)',
          borderRadius: '8px',
          padding: '0.4rem 0.75rem',
          fontSize: '0.8rem',
          fontWeight: '600',
          color: '#030712'
        }}>
          AI Verdict
        </div>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          {phone1Name} vs {phone2Name}
        </span>
      </div>
      <p style={{
        color: 'var(--text-primary)',
        fontSize: '1rem',
        lineHeight: '1.7',
        margin: 0
      }}>
        {verdict}
      </p>
    </div>
  )
}

export default VerdictCard