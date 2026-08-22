import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Calendar, Briefcase, Activity, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.employee_id) return;
        const [profRes, balRes] = await Promise.all([
          client.get(`/employees/${user.employee_id}`),
          client.get('/leave/balance')
        ]);
        setProfile(profRes.data);
        setLeaveBalances(balRes.data);
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!profile) {
    return <div>Profile not found.</div>;
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

  return (
    <motion.div 
      className="space-y-8 pb-20 md:pb-0"
      variants={container}
      initial="hidden"
      animate="show"
    >
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
                  <Button variant="secondary" size="sm" onClick={() => alert("Profile editing coming soon!")}>Edit Profile</Button>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 text-sm text-df-muted">
                <span className="flex items-center gap-1.5"><Briefcase size={16} /> {profile.department_name}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Badge variant="info">ID: {profile.employee_code}</Badge></span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Badge variant="success">Active</Badge></span>
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
                  <p className="font-medium text-[#111111]">{profile.email}</p>
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

        {/* Right Column: Metrics & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlassCard className="text-center">
              <h4 className="text-df-muted text-sm font-semibold mb-2">Attendance</h4>
              <p className="text-3xl font-bold text-[#111111]">{profile.attendance_rate || 0}%</p>
            </GlassCard>
            <GlassCard className="text-center">
              <h4 className="text-df-muted text-sm font-semibold mb-2">Leave Balance</h4>
              <p className="text-3xl font-bold text-[#111111]">{leaveBalances.reduce((sum, b) => sum + b.remaining_days, 0)} <span className="text-sm font-normal text-df-muted">days</span></p>
            </GlassCard>
            <GlassCard className="text-center">
              <h4 className="text-df-muted text-sm font-semibold mb-2">Performance</h4>
              <p className="text-2xl font-bold text-[#2A5A30] mt-1">Excellent</p>
            </GlassCard>
          </div>

          <GlassCard>
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <Activity size={20} className="text-df-lime-dark" />
              Activity Timeline
            </h3>
            
            <div className="flex items-center justify-between w-full relative mb-8 overflow-x-auto pb-4">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-df-border -translate-y-1/2 z-0" />
              
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month, i) => (
                <div key={month} className="relative z-10 flex flex-col items-center gap-2 px-2">
                  <span className="text-xs font-semibold text-df-muted uppercase">{month}</span>
                  <div className={`w-4 h-4 rounded-full border-[3px] border-white shadow-sm ${i === 5 ? 'bg-df-border' : 'bg-df-lime-dark'}`} />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl border border-df-border bg-[#F7F6F2]">
                <FileText className="text-df-muted mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-sm">Performance Review Completed</p>
                  <p className="text-xs text-df-muted mt-1">Aug 15, 2026</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl border border-df-border bg-white">
                <Calendar className="text-df-muted mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-sm">Took 3 days of Annual Leave</p>
                  <p className="text-xs text-df-muted mt-1">Jul 22 - Jul 25, 2026</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
        
      </motion.div>
    </motion.div>
  );
};

export default Profile;
