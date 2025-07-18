import React, { useEffect, useState } from 'react';
import { api } from '../api/api';

const InsightsPage = () => {
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/tasks/insights');
        setInsights(res.data);
      } catch (err) {
        setError('Failed to load insights');
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Insights</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : insights ? (
        <div className="bg-white rounded shadow p-6">
          <div className="mb-2">Total Tasks: <span className="font-bold">{insights.total}</span></div>
          <div className="mb-2">Pending: <span className="font-bold">{insights.pending}</span></div>
          <div className="mb-2">In Progress: <span className="font-bold">{insights['in-progress']}</span></div>
          <div className="mb-2">Done: <span className="font-bold">{insights.done}</span></div>
        </div>
      ) : null}
    </div>
  );
};

export default InsightsPage;
