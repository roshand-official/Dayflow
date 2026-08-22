import React, { useState, useEffect } from 'react';
import { DollarSign, Download, Calendar, Activity, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import GlassCard from '../components/ui/GlassCard';
import KPICard from '../components/ui/KPICard';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const Payroll = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [data, setData] = useState({ payslips: [], summary: null });
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const fetchPayroll = async () => {
    try {
      const endpoint = user?.role === 'hr_officer' ? '/payroll/all' : '/payroll/my-slips';
      const res = await client.get(endpoint);
      setData(res.data);
    } catch (err) {
      console.error('Failed to load payroll data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, [user]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  const handleRunPayroll = async () => {
    setRunning(true);
    try {
      const res = await client.post('/payroll/run');
      toast.success(res.data?.message || "Payroll run successfully.");
      await fetchPayroll();
    } catch (err) {
      console.error('Failed to run payroll', err);
      toast.error(err.response?.data?.detail || "Failed to run payroll");
    } finally {
      setRunning(false);
    }
  };

  const handleDownloadSlip = async (id, period) => {
    try {
      toast.info('Generating PDF...');
      const response = await client.get(`/payroll/slip/${id}/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const empCode = user.employee_code || 'EMP';
      link.setAttribute('download', `Payslip_${empCode}_${period}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success('Payslip downloaded');
    } catch (error) {
      console.error('Download failed', error);
      toast.error('Failed to download payslip');
    }
  };

  const isHR = user?.role === 'hr_officer';
  const { payslips, summary } = data;

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
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payroll</h2>
          <p className="text-df-muted mt-1">{isHR ? 'Company-wide payroll overview.' : 'Your salary slips and details.'}</p>
        </div>
        {isHR && (
          <div className="flex items-center gap-3">
            <Button variant="primary" icon={Activity} onClick={handleRunPayroll} isLoading={running}>Run Payroll</Button>
          </div>
        )}
      </motion.div>

      {/* KPIs for HR */}
      {isHR && summary && (
        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <KPICard 
            title="Total Payroll" 
            value={`₹${(summary.total_payroll / 100000).toFixed(1)}L`} 
            subtitle="This cycle" 
            icon={DollarSign}
          />
          <KPICard 
            title="Employees" 
            value={summary.total_employees} 
            subtitle="Processed" 
            icon={CheckCircle}
          />
          <KPICard 
            title="Pending" 
            value={summary.pending_count} 
            subtitle="Awaiting review" 
            icon={Activity}
          />
          <KPICard 
            title="Avg Salary" 
            value={`₹${(summary.average_salary / 1000).toFixed(1)}k`} 
            subtitle="Per employee" 
            icon={Activity}
          />
        </motion.div>
      )}

      {/* Payslips List */}
      <motion.div variants={item}>
        <GlassCard className="!p-0 overflow-hidden">
          <div className="p-6 border-b border-df-border bg-[#F7F6F2]">
            <h3 className="font-bold text-lg">{isHR ? 'Recent Payslips' : 'My Payslips'}</h3>
          </div>
          
          <div className="divide-y divide-df-border">
            {payslips.map(slip => (
              <div key={slip.id} className="p-6 hover:bg-[#F7F6F2] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-df-border flex items-center justify-center shrink-0">
                    <Calendar className="text-df-muted" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-base mb-1">
                      {isHR ? slip.employee_name : `Payslip - ${slip.period}`}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-df-muted">
                      {isHR && <span>{slip.period}</span>}
                      {isHR && <span>•</span>}
                      <span>Generated: {new Date(slip.generated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-xs text-df-muted font-semibold uppercase mb-1">Net Pay</p>
                    <p className="font-bold text-lg text-[#2A5A30]">₹{slip.net_pay.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={slip.status === 'paid' ? 'success' : 'warning'}>
                      {slip.status}
                    </Badge>
                    <Button 
                      variant="secondary" size="sm" className="!px-3" title="Download Slip"
                      onClick={() => handleDownloadSlip(slip.id, slip.period)}
                    >
                      <Download size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {payslips.length === 0 && (
              <div className="p-12 text-center text-df-muted">
                No payslips found.
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default Payroll;
