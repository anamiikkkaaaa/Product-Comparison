function Header() {
  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      padding: '1.5rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'var(--bg-card)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          color: '#030712'
        }}>
          PC
        </div>
        <span style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em'
        }}>
          ProductCompare
        </span>
      </div>
      <span style={{
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border)',
        padding: '0.3rem 0.75rem',
        borderRadius: '999px',
      }}>
        AI Powered
      </span>
    </header>
  )
}

export default Header
