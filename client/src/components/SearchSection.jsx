import { useState } from 'react'

function SearchSection({ onCompare, loading }) {
  const [phone1, setPhone1] = useState('')
  const [phone2, setPhone2] = useState('')
  const [preference, setPreference] = useState('')

  const handleCompare = () => {
    if (!phone1.trim() || !phone2.trim()) {
      alert('Please enter both phone names')
      return
    }
    if (phone1.trim().toLowerCase() === phone2.trim().toLowerCase()) {
      alert('Please enter two different phones')
      return
    }
    onCompare(phone1.trim(), phone2.trim(), preference)
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '3rem auto',
      padding: '2rem',
      backgroundColor: 'var(--bg-card)',
      borderRadius: '16px',
      border: '1px solid var(--border)',
    }}>
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.4rem', fontWeight: '600' }}>
        Compare Products
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
        Enter two phone names and tell us what matters to you
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="e.g. Samsung Galaxy S24"
          value={phone1}
          onChange={(e) => setPhone1(e.target.value)}
          style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            outline: 'none',
            width: '100%',
          }}
        />
        <input
          type="text"
          placeholder="e.g. Apple iPhone 15 Pro"
          value={phone2}
          onChange={(e) => setPhone2(e.target.value)}
          style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            outline: 'none',
            width: '100%',
          }}
        />
      </div>

      <input
        type="text"
        placeholder="What matters to you? e.g. I care about battery life and camera"
        value={preference}
        onChange={(e) => setPreference(e.target.value)}
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          color: 'var(--text-primary)',
          fontSize: '0.9rem',
          outline: 'none',
          width: '100%',
          marginBottom: '1.5rem',
          boxSizing: 'border-box',
        }}
      />

      <button
        onClick={handleCompare}
        disabled={loading}
        style={{
          backgroundColor: loading ? 'var(--border)' : 'var(--accent)',
          color: loading ? 'var(--text-secondary)' : '#030712',
          border: 'none',
          borderRadius: '8px',
          padding: '0.75rem 2rem',
          fontSize: '0.95rem',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%',
          transition: 'background-color 0.2s',
        }}
      >
        {loading ? 'Comparing...' : 'Compare Now'}
      </button>
    </div>
  )
}

export default SearchSection