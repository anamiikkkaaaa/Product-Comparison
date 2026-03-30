import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from 'recharts'

function ScoreChart({ scores, phone1Name, phone2Name }) {
  const data = [
    {
      subject: 'Battery',
      [phone1Name]: scores[phone1Name]?.battery || 0,
      [phone2Name]: scores[phone2Name]?.battery || 0,
    },
    {
      subject: 'Display',
      [phone1Name]: scores[phone1Name]?.display || 0,
      [phone2Name]: scores[phone2Name]?.display || 0,
    },
    {
      subject: 'Weight',
      [phone1Name]: scores[phone1Name]?.weight || 0,
      [phone2Name]: scores[phone2Name]?.weight || 0,
    },
  ]

  return (
    <div style={{
      maxWidth: '900px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: 'var(--bg-card)',
      borderRadius: '16px',
      border: '1px solid var(--border)',
    }}>
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: '600' }}>
        Score Comparison
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={data}>
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 13 }} />
          <Radar
            name={phone1Name}
            dataKey={phone1Name}
            stroke="#06B6D4"
            fill="#06B6D4"
            fillOpacity={0.3}
          />
          <Radar
            name={phone2Name}
            dataKey={phone2Name}
            stroke="#8B5CF6"
            fill="#8B5CF6"
            fillOpacity={0.3}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ScoreChart