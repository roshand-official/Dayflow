import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, Briefcase, Activity, FileText, ArrowLeft, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [empRes, attRes] = await Promise.all([
          client.get(`/employees/${id}`),
          user?.role === 'hr_officer'
            ? client.get(`/attendance/history?employee_id=${id}`)
            : Promise.resolve({ data: { summary: null, records: [] } })
        ]);
        setProfile(empRes.data);
        setAttendance(attRes.data);
      } catch (err) {
        console.error('Failed to load employee profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, user]);

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

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <p className="text-df-muted text-lg">Employee not found.</p>
        <Button variant="secondary" onClick={() => navigate('/people')}>← Back to People</Button>
      </div>
    );
  }

  const attendanceRate = attendance?.summary?.attendance_rate ?? profile.attendance_rate ?? 0;

  return (
    <motion.div 
      className="space-y-8 pb-20 md:pb-0"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Back Navigation */}
      <motion.div variants={item}>
        <button 
          onClick={() => navigate('/people')}
          className="flex items-center gap-2 text-df-muted hover:text-black transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} />
          Back to People
        </button>
      </motion.div>

      {/* Header Profile Card */}
      <motion.div variants={item}>
        <GlassCard className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-df-lime-dark to-[#D7FF00] opacity-20" />
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10 pt-4">
            <Avatar src={profile.photo_url} alt={profile.full_name} size="xl" className="border-4 border-white shadow-sm" />
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-1">{profile.full_name}</h1>
                  <p className="text-lg font-medium text-df-muted">{profile.job_title}</p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Badge variant={profile.status === 'active' ? 'success' : profile.status === 'on_leave' ? 'warning' : 'neutral'}>
                    {profile.status === 'active' ? 'Active' : profile.status === 'on_leave' ? 'On Leave' : profile.status}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 text-sm text-df-muted">
                <span className="flex items-center gap-1.5"><Briefcase size={16} /> {profile.department_name || 'No Dept'}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Badge variant="info">ID: {profile.employee_code}</Badge></span>
                {profile.joining_date && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={16} /> Joined {new Date(profile.joining_date).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Main Grid */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Left Column: Details & Contact */}
        <div className="space-y-6">
          <GlassCard>
            <h3 className="font-bold mb-4">Contact Information</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F7F6F2] flex items-center justify-center shrink-0">
                  <Mail size={16} className="text-df-muted" />
                </div>
                <div>
                  <p className="text-df-muted text-xs font-semibold uppercase">Email</p>
                  <a href={`mailto:${profile.email}`} className="font-medium text-[#111111] hover:underline">{profile.email}</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F7F6F2] flex items-center justify-center shrink-0">
                  <Phone size={16} className="text-df-muted" />
                </div>
                <div>
                  <p className="text-df-muted text-xs font-semibold uppercase">Phone</p>
                  <p className="font-medium text-[#111111]">{profile.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F7F6F2] flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-df-muted" />
                </div>
                <div>
                  <p className="text-df-muted text-xs font-semibold uppercase">Location</p>
                  <p className="font-medium text-[#111111]">{profile.address || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-bold mb-4">Work Details</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between pb-3 border-b border-df-border">
                <span className="text-df-muted">Manager</span>
                <span className="font-medium">{profile.manager_name || 'None'}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-df-border">
                <span className="text-df-muted">Joining Date</span>
                <span className="font-medium">{profile.joining_date ? new Date(profile.joining_date).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-df-muted">Employment</span>
                <span className="font-medium capitalize">{profile.employment_type.replace('_', ' ')}</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlassCard className="text-center">
              <h4 className="text-df-muted text-sm font-semibold mb-2">Attendance</h4>
              <p className="text-3xl font-bold text-[#111111]">{attendanceRate}%</p>
            </GlassCard>
            <GlassCard className="text-center">
              <h4 className="text-df-muted text-sm font-semibold mb-2">Status</h4>
              <p className={`text-2xl font-bold mt-1 capitalize ${profile.status === 'active' ? 'text-[#2A5A30]' : 'text-df-muted'}`}>
                {profile.status === 'active' ? 'Active' : profile.status?.replace('_', ' ')}
              </p>
            </GlassCard>
            <GlassCard className="text-center">
              <h4 className="text-df-muted text-sm font-semibold mb-2">Department</h4>
              <p className="text-2xl font-bold text-[#111111] mt-1">{profile.department_name || '—'}</p>
            </GlassCard>
          </div>

          {/* Attendance History (HR Only) */}
          {user?.role === 'hr_officer' && attendance?.summary && (
            <GlassCard>
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <Clock size={20} className="text-df-lime-dark" />
                Attendance Summary (Last 7 days)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-xl bg-[#F2FCF4] border border-[#BFE8C4]">
                  <p className="text-2xl font-bold text-[#2A5A30]">{attendance.summary.present}</p>
                  <p className="text-xs font-semibold text-[#2A5A30] mt-1">Present</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-[#FFF8E7] border border-[#F4D98A]">
                  <p className="text-2xl font-bold text-[#8B6914]">{attendance.summary.late}</p>
                  <p className="text-xs font-semibold text-[#8B6914] mt-1">Late</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-[#FFF0F0] border border-[#F2A6A0]">
                  <p className="text-2xl font-bold text-[#702621]">{attendance.summary.absent}</p>
                  <p className="text-xs font-semibold text-[#702621] mt-1">Absent</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-[#F0F7FF] border border-[#BFDCE8]">
                  <p className="text-2xl font-bold text-[#1A4B6E]">{attendance.summary.on_leave}</p>
                  <p className="text-xs font-semibold text-[#1A4B6E] mt-1">On Leave</p>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Recent Attendance Records (HR Only) */}
          {user?.role === 'hr_officer' && attendance?.records?.length > 0 && (
            <GlassCard className="!p-0 overflow-hidden">
              <div className="p-6 border-b border-df-border bg-[#F7F6F2]">
                <h3 className="font-bold flex items-center gap-2">
                  <Activity size={20} className="text-df-lime-dark" />
                  Recent Records
                </h3>
              </div>
              <div className="divide-y divide-df-border max-h-[300px] overflow-y-auto">
                {attendance.records.slice(0, 10).map(record => (
                  <div key={record.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={
                        record.status === 'present' ? 'success' :
                        record.status === 'late' ? 'warning' :
                        record.status === 'absent' ? 'danger' : 'info'
                      }>
                        {record.status}
                      </Badge>
                      <span className="text-sm font-medium">{new Date(record.date).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm text-df-muted">
                      {record.worked_hours > 0 ? `${record.worked_hours}h worked` : '—'}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmployeeProfile;
