import { useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import SearchSection from "./components/SearchSection";
import VerdictCard from "./components/VerdictCard";
import CompareTable from "./components/CompareTable";
import ScoreChart from "./components/ScoreChart";

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCompare = async (phone1, phone2, preference) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/compare`, {
        phones: [phone1, phone2],
        user_preference: preference,
      });
      setResult(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("One or both phones not found. Please check the phone names and try again.")
      } else if (err.response?.status === 503) {
        setError("Analysis service is temporarily unavailable. Please try again in a moment.")
      } else if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to server. Make sure the backend is running.")
      } else {
        setError(err.response?.data?.error || "Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Header />
      <div style={{ padding: "0 2rem 4rem" }}>
        <SearchSection onCompare={handleCompare} loading={loading} />
        {error && (
          <div style={{
            maxWidth: '800px',
            margin: '1rem auto',
            padding: '1rem 1.5rem',
            backgroundColor: '#1a0a0a',
            border: '1px solid #ef4444',
            borderRadius: '12px',
            color: '#f87171',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '1.2rem' }}>⚠</span>
            {error}
          </div>
        )}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--text-secondary)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--border)',
              borderTop: '3px solid var(--accent)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}/>
            <p>Fetching and comparing phones...</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
              This may take a moment if we need to scrape new phone data
            </p>
          </div>
        )}
        {result && (
          <>
            <CompareTable phone1={result.phone1} phone2={result.phone2} />
            <ScoreChart
              scores={result.scores}
              phone1Name={result.phone1.name}
              phone2Name={result.phone2.name}
            />
            <VerdictCard
              verdict={result.verdict}
              phone1Name={result.phone1.name}
              phone2Name={result.phone2.name}
            />
          </>
        )}
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;