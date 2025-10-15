import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import NeumorphicButton from './NeumorphicButton';
import GlassCard from './GlassCard';

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('30d');
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
          params: { period },
        };
        const { data } = await axios.get('http://localhost:5001/api/analytics', config);
        setData(data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [period, userInfo.token]);

  if (isLoading) return <div>Loading analytics...</div>;
  if (!data) return <div>Could not load data.</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600">Performance of your links</p>
        </div>
        {/* Time Period Selector */}
        <div className="flex space-x-2 p-1 bg-gray-200 rounded-xl">
          {['7d', '30d', '90d'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-sm font-semibold rounded-lg transition-colors ${period === p ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Last {p.replace('d', '')} days
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{data.totalClicks}</div>
          <div className="text-gray-600">Total Clicks</div>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{data.totalLinks}</div>
          <div className="text-gray-600">Total Links</div>
        </GlassCard>
        <GlassCard className="p-6 text-center">
           <div className="text-3xl font-bold text-purple-600">{(data.totalClicks / parseInt(period)).toFixed(1)}</div>
           <div className="text-gray-600">Clicks/Day (Avg)</div>
        </GlassCard>
      </div>

      {/* Clicks Chart */}
      <GlassCard className="p-6">
        <h3 className="font-bold text-lg mb-4">Clicks Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.clicksByDate} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" name="Clicks" />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Top Links */}
      <GlassCard className="p-6">
        <h3 className="font-bold text-lg mb-4">Top Performing Links</h3>
        <div className="space-y-3">
          {data.topLinks.map((link, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-800">{link.title}</div>
                <div className="text-sm text-gray-500 truncate">{link.url}</div>
              </div>
              <div className="font-bold text-blue-600 text-lg">{link.count} clicks</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default AnalyticsDashboard;