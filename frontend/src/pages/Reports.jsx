import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import { Download } from 'lucide-react';
import Button from '../components/ui/Button';

const Reports = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Route guard: only HR officers can access reports
  if (user && user.role !== 'hr_officer') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [attRes, leaveRes] = await Promise.all([
          client.get('/reports/attendance-trend'),
          client.get('/reports/leave-utilization')
        ]);
        setAttendanceData(attRes.data);
        setLeaveData(leaveRes.data);
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const COLORS = ['#D7FF00', '#F4D98A', '#F2A6A0', '#BFDCE8'];

  return (
    <motion.div 
      className="space-y-8 pb-20 md:pb-0"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-df-muted mt-1">Company-wide insights and data trends.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={Download} onClick={() => alert("Exporting report data to CSV...")}>Export CSV</Button>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Attendance Trend */}
        <GlassCard className="h-[400px] flex flex-col">
          <h3 className="font-bold mb-6">Attendance Trend (This Week)</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E6E1" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#777777' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#777777' }} />
                <Tooltip 
                  cursor={{ fill: '#F7F6F2' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E8E6E1', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="present" name="Present" fill="#D7FF00" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="late" name="Late" fill="#F4D98A" radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="absent" name="Absent" fill="#F2A6A0" radius={[0, 0, 4, 4]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Leave Utilization */}
        <GlassCard className="h-[400px] flex flex-col">
          <h3 className="font-bold mb-6">Leave Utilization</h3>
          <div className="flex-1 w-full min-h-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leaveData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E8E6E1', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {leaveData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-df-muted">{entry.name}</span>
                <span className="font-semibold">{entry.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default Reports;
