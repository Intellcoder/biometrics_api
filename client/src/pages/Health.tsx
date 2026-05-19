import { useEffect, useState } from "react";
import axios from "axios";

interface HealthResponse {
  status: string;
  database: string;
}

function HealthCheck() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState("");

  const checkHealth = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get<HealthResponse>(
        "http://localhost:8000/health",
      );

      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Backend is not reachable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">System Health</h2>

      {loading && (
        <p className="text-blue-500 animate-pulse">Checking backend...</p>
      )}

      {error && (
        <div className="text-red-500 space-y-2">
          <p>{error}</p>
          <button
            onClick={checkHealth}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      )}

      {data && (
        <div className="space-y-2">
          <p>
            Status:{" "}
            <span className="text-green-600 font-semibold">{data.status}</span>
          </p>

          <p>
            Database:{" "}
            <span className="text-green-600 font-semibold">
              {data.database}
            </span>
          </p>

          <button
            onClick={checkHealth}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}

export default HealthCheck;
