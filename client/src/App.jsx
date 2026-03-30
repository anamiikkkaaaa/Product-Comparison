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
      const response = await axios.post("http://localhost:5000/api/compare", {
        phones: [phone1, phone2],
        user_preference: preference,
      });
      setResult(response.data);
    } catch (err) {
      setError("Something went wrong. Make sure both phone names are correct.");
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
          <p
            style={{ color: "#F87171", textAlign: "center", marginTop: "1rem" }}
          >
            {error}
          </p>
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
    </div>
  );
}

export default App;
