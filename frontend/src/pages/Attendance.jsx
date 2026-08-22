import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Play, Square, AlertCircle, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

const Attendance = () => {
  const { user } = useAuth();
  const [todayStatus, setTodayStatus] = useState(null);
  const [teamAttendance, setTeamAttendance] = useState([]);
  const [weekHistory, setWeekHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weekOffset, setWeekOffset] = useState(0);

  // Generate simple week calendar
  const baseDate = addDays(new Date(), weekOffset * 7);
  const startDate = startOfWeek(baseDate, { weekStartsOn: 1 });
  const endDate = addDays(startDate, 6);
  const weekDays = [...Array(7)].map((_, i) => addDays(startDate, i));

  useEffect(() => {
    // Clock tick
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const startStr = format(startDate, 'yyyy-MM-dd');
        const endStr = format(endDate, 'yyyy-MM-dd');

        const reqs = [
          client.get('/attendance/today'),
          client.get(`/attendance/history?date_from=${startStr}&date_to=${endStr}`)
        ];
        if (user?.role === 'hr_officer') {
          reqs.push(client.get(`/attendance/history?date_from=${todayStr}&date_to=${todayStr}`));
        }
        
        const responses = await Promise.all(reqs);
        setTodayStatus(responses[0].data);
        setWeekHistory(responses[1].data.records);
        
        if (user?.role === 'hr_officer' && responses[2]) {
          setTeamAttendance(responses[2].data.records);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [user, weekOffset]);

  const handleCheckIn = async () => {
    try {
      await client.post('/attendance/check-in', { notes: '' });
      const res = await client.get('/attendance/today');
      setTodayStatus(res.data);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    try {
      await client.post('/attendance/check-out', { notes: '' });
      const res = await client.get('/attendance/today');
      setTodayStatus(res.data);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to check out');
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0 h-full flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Clock In Panel */}
        <GlassCard className="flex flex-col justify-center items-center p-8 text-center bg-gradient-to-b from-white to-[#F7F6F2]">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-df-lime-dark">
            <Clock size={32} />
          </div>
          
          <h2 className="text-4xl font-bold tracking-tight mb-2">
            {format(currentTime, 'h:mm:ss a')}
          </h2>
          <p className="text-df-muted font-medium mb-8">
            {format(currentTime, 'EEEE, MMMM d, yyyy')}
          </p>
          
          {loading ? (
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          ) : todayStatus?.check_out ? (
            <div className="p-4 rounded-xl bg-[#FFF0F0] border border-[#F2A6A0] w-full">
               <p className="font-semibold text-df-danger-text">Shift Completed</p>
               <p className="text-sm mt-1 text-df-danger-text opacity-80">You worked {todayStatus.worked_hours} hours today.</p>
            </div>
          ) : todayStatus?.is_checked_in ? (
            <div className="w-full space-y-4">
              <Button 
                className="w-full h-16 text-lg shadow-md bg-black text-white hover:bg-gray-800"
                icon={Square}
                onClick={handleCheckOut}
              >
                Clock Out
              </Button>
              <p className="text-sm text-df-muted font-medium">Checked in at {new Date(todayStatus.check_in).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          ) : (
            <Button 
              variant="primary" 
              className="w-full h-16 text-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
              icon={Play}
              onClick={handleCheckIn}
            >
              Clock In Now
            </Button>
          )}
        </GlassCard>

        {/* Weekly Summary */}
        <GlassCard className="lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">This Week</h3>
            <div className="flex gap-2">
              <button className="p-1.5 rounded-lg border border-df-border hover:bg-[#F7F6F2]" onClick={() => setWeekOffset(prev => prev - 1)}>
                <ChevronLeft size={16}/>
              </button>
              <button className="p-1.5 rounded-lg border border-df-border hover:bg-[#F7F6F2]" onClick={() => setWeekOffset(prev => prev + 1)}>
                <ChevronRight size={16}/>
              </button>
              {weekOffset !== 0 && (
                <button className="text-xs font-semibold text-df-muted hover:text-black ml-2" onClick={() => setWeekOffset(0)}>
                  Today
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 flex-1">
            {weekDays.map((day, i) => {
              const isToday = isSameDay(day, new Date());
              const isPast = day < new Date() && !isToday;
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;
              const dayStr = format(day, 'yyyy-MM-dd');
              const historyRec = weekHistory.find(r => r.date === dayStr);
              
              let statusClass = "border-df-border bg-white text-df-muted";
              let statusLabel = "-";
              
              if (isToday && todayStatus?.is_checked_in) {
                 statusClass = "border-df-lime bg-[#FAFFEB] text-black";
                 statusLabel = "In";
              } else if (historyRec) {
                 statusClass = historyRec.status === 'absent' ? "border-[#F2A6A0] bg-[#FFF0F0] text-[#702621]" : "border-[#BFE8C4] bg-[#F2FCF4] text-[#2A5A30]";
                 statusLabel = historyRec.worked_hours > 0 ? `${historyRec.worked_hours}h` : historyRec.status;
              } else if (isWeekend) {
                 statusClass = "border-transparent bg-[#F7F6F2] text-[#AAAAAA]";
                 statusLabel = "Off";
              }

              return (
                <div key={i} className="flex flex-col items-center">
                  <div className="text-xs font-semibold uppercase mb-2 text-df-muted">
                    {format(day, 'E')}
                  </div>
                  <div className={`
                    w-full flex-1 rounded-xl border-2 flex flex-col items-center justify-center min-h-[80px]
                    transition-all ${statusClass} ${isToday ? 'ring-2 ring-df-lime ring-offset-2' : ''}
                  `}>
                    <span className="text-lg font-bold mb-1">{format(day, 'd')}</span>
                    <span className="text-xs font-semibold">{statusLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

      </div>
      
      {/* HR Overview Section */}
      {user?.role === 'hr_officer' && (
        <GlassCard className="!p-0 overflow-hidden mt-6">
          <div className="p-6 border-b border-df-border flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <Users size={20} className="text-df-lime-dark" />
              Team Attendance Today
            </h3>
            <Badge variant="info">{teamAttendance.length} records</Badge>
          </div>
          <div className="divide-y divide-df-border">
            {teamAttendance.map(record => (
              <div key={record.id} className="p-4 flex items-center justify-between hover:bg-[#F7F6F2] transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar src={null} alt={record.employee_name} size="sm" />
                  <div>
                    <p className="font-semibold text-sm">{record.employee_name}</p>
                    <p className="text-xs text-df-muted">
                      {record.check_in ? `In: ${new Date(record.check_in).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'No punch in'}
                      {record.check_out ? ` | Out: ${new Date(record.check_out).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {record.worked_hours > 0 && <span className="text-xs text-df-muted font-medium">{record.worked_hours}h</span>}
                  <Badge variant={
                    record.status === 'present' ? 'success' :
                    record.status === 'late' ? 'warning' :
                    record.status === 'absent' ? 'danger' : 'info'
                  }>
                    {record.status}
                  </Badge>
                </div>
              </div>
            ))}
            {teamAttendance.length === 0 && !loading && (
              <div className="p-8 text-center text-df-muted">
                No team attendance records found for today.
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {/* Attendance Policy / Note */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-df-info bg-opacity-20 border border-df-info text-df-info-text mt-6">
         <AlertCircle size={20} className="shrink-0 mt-0.5" />
         <div>
            <h4 className="font-semibold text-sm">Shift Policy Reminder</h4>
            <p className="text-sm mt-1 opacity-90">Core hours are 9:00 AM to 5:00 PM. Clocking in after 9:15 AM will be marked as late. Ensure to clock out to log your worked hours correctly.</p>
         </div>
      </div>
    </div>
  );
};

export default Attendance;
