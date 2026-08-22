import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, Briefcase, FileText, CheckCircle, AlertTriangle, Info, Bell, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { supabase } from '../api/supabase';
import KPICard from '../components/ui/KPICard';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { cn } from '../utils/helpers';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [kpis, setKpis] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [coverageData, setCoverageData] = useState([]);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [kpiRes, actRes, covRes] = await Promise.all([
          client.get('/dashboard/kpis'),
          client.get('/dashboard/activity'),
          client.get('/dashboard/coverage'),
        ]);
        
        setKpis(kpiRes.data);
        setActivityFeed(actRes.data);
        setCoverageData(covRes.data);
        
        if (user?.role === 'hr_officer') {
          try {
            const alertRes = await client.get('/alerts');
            setAlerts(alertRes.data.alerts);
          } catch (e) {
            console.error('Failed to load alerts', e);
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Supabase fetch separately so it doesn't block dashboard
    const fetchTodos = async () => {
      try {
        const { data, error } = await supabase.from('todos').select();
        if (data && !error) setTodos(data);
      } catch (e) {
        console.error('Supabase todos fetch failed (non-blocking)', e);
      }
    };

    fetchDashboardData();
    fetchTodos();
  }, [user]);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return t('dashboard.greeting_morning');
    if (hour < 17) return t('dashboard.greeting_afternoon');
    return t('dashboard.greeting_evening');
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await client.put(`/alerts/${alertId}/resolve`);
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    } catch (err) {
      console.error('Failed to resolve alert', err);
    }
  };

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

  if (loading || !kpis) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-df-lime"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8 pb-20 md:pb-0"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="relative">
          <h2 className="text-3xl font-bold tracking-tight z-10 relative">
            {getTimeGreeting()}, {user?.employee_name?.split(' ')[0] || 'Admin'}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-df-muted">{time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <span className="text-df-muted">•</span>
            <p className="font-semibold">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
          </div>
          
          <motion.div 
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-12 w-8 h-8 rounded-full bg-df-lime opacity-30 blur-md -z-10"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={Clock} onClick={() => navigate('/attendance')}>{t('dashboard.clock_in')}</Button>
          <Button variant="primary" onClick={() => navigate('/leave')}>{t('dashboard.apply_leave')}</Button>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <KPICard 
          title={t('dashboard.attendance')} 
          value={`${kpis.attendance_rate}%`} 
          subtitle={t('dashboard.todays_rate')} 
          icon={Users}
          trend={{ value: 2.5, isPositive: true }}
          animated
        />
        <KPICard 
          title={t('dashboard.on_leave')} 
          value={kpis.on_leave} 
          subtitle={t('dashboard.currently_out')} 
          icon={Briefcase}
          animated
        />
        <KPICard 
          title={t('dashboard.pending_actions')} 
          value={kpis.pending_actions} 
          subtitle={t('dashboard.requires_attention')} 
          icon={Bell}
          animated
        />
        <KPICard 
          title={t('dashboard.total_payroll')} 
          value={`$${(kpis.total_payroll / 1000).toFixed(1)}k`} 
          subtitle={t('dashboard.this_month')} 
          icon={FileText}
          animated
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <motion.div variants={item} className="lg:col-span-2 space-y-8">
          {user?.role === 'hr_officer' && (
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Activity className="text-df-lime-dark" size={20} />
                    {t('dashboard.attention_center')}
                  </h3>
                  <p className="text-sm text-df-muted mt-1">{t('dashboard.ai_flagged')}</p>
                </div>
                <Badge variant={alerts.length > 0 ? "warning" : "success"}>
                  {alerts.length} {t('common.alerts')}
                </Badge>
              </div>

              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-df-success flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="text-df-success-text" size={24} />
                  </div>
                  <p className="font-medium text-df-success-text">{t('dashboard.all_clear')}</p>
                  <p className="text-sm text-df-muted mt-1">{t('dashboard.no_alerts')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map(alert => (
                    <div key={alert.id} className="flex gap-4 p-4 rounded-xl border border-df-border bg-df-bg">
                      <div className="flex-shrink-0 mt-1">
                        {alert.severity === 'critical' ? (
                          <AlertTriangle className="text-df-danger-text" size={20} />
                        ) : alert.severity === 'warning' ? (
                          <AlertTriangle className="text-df-warning-text" size={20} />
                        ) : (
                          <Info className="text-df-info-text" size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-sm">{alert.title}</h4>
                          <span className="text-xs text-df-muted border border-df-border rounded px-2 py-0.5 bg-df-surface">
                            {new Date(alert.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <p className="text-sm text-df-muted mb-3">{alert.description}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold">{t('common.action')}: {alert.recommended_action}</p>
                          <button 
                            className="text-xs font-bold underline hover:text-df-lime-dark transition-colors"
                            onClick={() => handleResolveAlert(alert.id)}
                          >
                            {t('dashboard.resolve')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          )}

          <GlassCard>
            <h3 className="text-lg font-bold mb-6">{t('dashboard.recent_activity')}</h3>
            <div className="space-y-4">
              {activityFeed.map((act, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-df-border bg-df-bg transition-colors hover:border-df-muted">
                  <div className="w-10 h-10 rounded-full bg-df-bg flex items-center justify-center shrink-0 border border-df-border">
                    <Briefcase size={18} className="text-df-muted" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{act.title}</p>
                    <p className="text-xs text-df-muted mt-1">{new Date(act.time).toLocaleString()}</p>
                    <Badge variant={act.status === 'approved' ? 'success' : act.status === 'pending' ? 'warning' : 'danger'} className="mt-2">
                      {act.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {activityFeed.length === 0 && (
                <div className="text-center text-sm text-df-muted py-4">{t('dashboard.no_activity')}</div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={item} className="space-y-6">
          <GlassCard>
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-df-lime animate-pulse"></span>
              {t('dashboard.live_coverage')}
            </h3>
            <p className="text-sm text-df-muted mb-6">{t('dashboard.staffing_coverage')}</p>
            
            <div className="space-y-5">
              {Array.isArray(coverageData) && coverageData.map((cov, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold">{cov.department}</span>
                    <span className={`text-sm font-bold ${cov.coverage_pct < 70 ? 'text-df-danger-text' : 'text-df-success-text'}`}>{cov.coverage_pct}%</span>
                  </div>
                  <div className="w-full bg-df-border h-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${cov.coverage_pct < 70 ? 'bg-df-danger' : 'bg-df-lime'}`} style={{ width: `${cov.coverage_pct}%` }} />
                  </div>
                  <p className="text-[10px] text-df-muted mt-1 text-right">{cov.on_leave} {t('dashboard.on_leave_count')}</p>
                </div>
              ))}
              {(!Array.isArray(coverageData) || coverageData.length === 0) && (
                <div className="text-center text-sm text-df-muted py-4">{t('dashboard.no_coverage')}</div>
              )}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-bold mb-4">{t('dashboard.quick_links')}</h3>
            <div className="space-y-2">
              <button 
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-df-bg transition-colors group"
                onClick={() => navigate('/people')}
              >
                <span className="text-sm font-medium">{t('dashboard.company_policy')}</span>
                <span className="text-df-muted group-hover:text-df-text transition-colors">→</span>
              </button>
              <button 
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-df-bg transition-colors group"
                onClick={() => navigate('/leave')}
              >
                <span className="text-sm font-medium">{t('dashboard.holiday_calendar')}</span>
                <span className="text-df-muted group-hover:text-df-text transition-colors">→</span>
              </button>
              <button 
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-df-bg transition-colors group"
                onClick={() => navigate('/payroll')}
              >
                <span className="text-sm font-medium">{t('dashboard.submit_expense')}</span>
                <span className="text-df-muted group-hover:text-df-text transition-colors">→</span>
              </button>
            </div>
          </GlassCard>

          {/* Supabase Todos */}
          <GlassCard>
            <h3 className="text-xl font-bold mb-4">{t('dashboard.supabase_todos')}</h3>
            <div className="space-y-3">
              {todos.length > 0 ? (
                todos.map(todo => (
                  <div key={todo.id} className="p-3 rounded-xl bg-df-bg border border-df-border flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-df-lime"></span>
                    <span className="font-medium text-sm">{todo.name || todo.title || JSON.stringify(todo)}</span>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-df-muted text-sm border border-dashed border-df-border rounded-xl">
                  {t('dashboard.no_todos')}
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
