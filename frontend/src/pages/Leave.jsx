import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Umbrella, HeartPulse, Clock } from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';

const Leave = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [balances, setBalances] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({
    leave_type_id: '',
    date_from: '',
    date_to: '',
    reason: ''
  });
  const [applyError, setApplyError] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balRes, reqRes] = await Promise.all([
          client.get('/leave/balance'),
          client.get('/leave/requests')
        ]);
        setBalances(balRes.data);
        setRequests(reqRes.data.requests);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleReview = async (id, status) => {
    try {
      await client.put(`/leave/${id}/review`, { status, comment: 'Reviewed by HR' });
      toast.success(`Request ${status} successfully`);
      // Refresh requests
      const reqRes = await client.get('/leave/requests');
      setRequests(reqRes.data.requests);
    } catch (err) {
      toast.error('Failed to review request');
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplyError('');
    setApplying(true);
    try {
      await client.post('/leave/apply', {
        ...applyForm,
        leave_type_id: parseInt(applyForm.leave_type_id)
      });
      setShowApplyModal(false);
      setApplyForm({ leave_type_id: '', date_from: '', date_to: '', reason: '' });
      toast.success('Leave request submitted successfully');
      // Refresh data
      const [balRes, reqRes] = await Promise.all([
        client.get('/leave/balance'),
        client.get('/leave/requests')
      ]);
      setBalances(balRes.data);
      setRequests(reqRes.data.requests);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to apply for leave';
      setApplyError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setApplying(false);
    }
  };

  const getIconForLeaveType = (name) => {
    if (name.includes('Sick')) return <HeartPulse size={20} />;
    if (name.includes('Unpaid')) return <Clock size={20} />;
    return <Umbrella size={20} />;
  };

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      
      {/* Leave Balances Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Balances</h2>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowApplyModal(true)}>Apply Leave</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {balances.map(b => (
            <GlassCard key={b.leave_type_id} className="relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 w-full h-1" 
                style={{ backgroundColor: b.color || '#D7FF00' }} 
              />
              <div className="flex justify-between items-start mb-4">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: `${b.color}30`, color: '#111' }}
                >
                  {getIconForLeaveType(b.leave_type_name)}
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold">{b.remaining_days}</span>
                  <span className="text-df-muted text-sm ml-1">days left</span>
                </div>
              </div>
              <h3 className="font-semibold text-lg">{b.leave_type_name}</h3>
              <div className="w-full bg-[#F7F6F2] h-2 rounded-full mt-4 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${(b.used_days / b.total_days) * 100}%`,
                    backgroundColor: b.color || '#D7FF00' 
                  }} 
                />
              </div>
              <p className="text-xs text-df-muted mt-2 text-right">
                {b.used_days} of {b.total_days} used
              </p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <GlassCard className="!p-0 overflow-hidden">
        <div className="p-6 border-b border-df-border">
          <h2 className="text-xl font-bold">Leave Requests</h2>
        </div>
        
        {loading ? (
           <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div></div>
        ) : (
          <div className="divide-y divide-df-border">
            {requests.map(req => (
              <div key={req.id} className="p-6 hover:bg-[#F7F6F2] transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div className="flex items-start gap-4">
                    {user?.role === 'hr_officer' && (
                      <Avatar src={null} alt={req.employee_name} size="md" />
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {user?.role === 'hr_officer' && <span className="font-bold">{req.employee_name}</span>}
                        <Badge variant={
                          req.status === 'approved' ? 'success' : 
                          req.status === 'rejected' ? 'danger' : 'warning'
                        }>
                          {req.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold">{req.leave_type_name} ({req.days} days)</p>
                      <p className="text-sm text-df-muted">
                        {new Date(req.date_from).toLocaleDateString()} - {new Date(req.date_to).toLocaleDateString()}
                      </p>
                      {req.reason && <p className="text-sm text-df-muted mt-2 max-w-xl italic">"{req.reason}"</p>}
                    </div>
                  </div>

                  {user?.role === 'hr_officer' && req.status === 'pending' ? (
                    <div className="flex flex-col items-end gap-3 min-w-[200px]">
                      {/* Coverage Impact Panel */}
                      <div className="bg-white border border-df-border rounded-lg p-3 w-full shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-df-muted uppercase">Coverage Risk</span>
                          <span className={`text-xs font-bold ${req.coverage_risk < 50 ? 'text-df-danger-text' : 'text-[#2A5A30]'}`}>
                            {req.coverage_risk}%
                          </span>
                        </div>
                        <div className="w-full bg-[#E8E6E1] h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${req.coverage_risk < 50 ? 'bg-[#F2A6A0]' : 'bg-[#D7FF00]'}`} 
                            style={{ width: `${req.coverage_risk}%` }} 
                          />
                        </div>
                        <p className="text-[10px] text-df-muted mt-1 text-right">{req.department_name}</p>
                      </div>
                      
                      <div className="flex gap-2 w-full">
                        <Button 
                          variant="secondary" size="sm" className="flex-1 !bg-white hover:!bg-[#FFE5E5] hover:text-[#702621]"
                          onClick={() => handleReview(req.id, 'rejected')}
                        >
                          Reject
                        </Button>
                        <Button 
                          variant="primary" size="sm" className="flex-1"
                          onClick={() => handleReview(req.id, 'approved')}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-right">
                      <p className="text-xs text-df-muted">Applied on {new Date(req.created_at).toLocaleDateString()}</p>
                    </div>
                  )}

                </div>
              </div>
            ))}
            
            {requests.length === 0 && (
              <div className="p-8 text-center text-df-muted">
                No leave requests found.
              </div>
            )}
          </div>
        )}
      </GlassCard>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <GlassCard className="w-full max-w-md relative">
            <button 
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 text-df-muted hover:text-black transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-6">Apply Leave</h2>
            
            <form onSubmit={handleApply} className="space-y-4">
              {applyError && (
                <div className="p-3 bg-[#FFF0F0] text-[#702621] text-sm rounded-lg">
                  {applyError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold mb-1">Leave Type</label>
                <select 
                  required
                  className="w-full h-10 px-3 rounded-lg border border-df-border bg-[#F7F6F2] outline-none focus:border-black"
                  value={applyForm.leave_type_id}
                  onChange={(e) => setApplyForm({...applyForm, leave_type_id: e.target.value})}
                >
                  <option value="">Select type...</option>
                  {balances.map(b => (
                    <option key={b.leave_type_id} value={b.leave_type_id}>
                      {b.leave_type_name} ({b.remaining_days} days left)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">From Date</label>
                  <input 
                    type="date" required
                    className="w-full h-10 px-3 rounded-lg border border-df-border bg-[#F7F6F2] outline-none focus:border-black"
                    value={applyForm.date_from}
                    onChange={(e) => setApplyForm({...applyForm, date_from: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">To Date</label>
                  <input 
                    type="date" required
                    className="w-full h-10 px-3 rounded-lg border border-df-border bg-[#F7F6F2] outline-none focus:border-black"
                    value={applyForm.date_to}
                    onChange={(e) => setApplyForm({...applyForm, date_to: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Reason (Optional)</label>
                <textarea 
                  className="w-full p-3 rounded-lg border border-df-border bg-[#F7F6F2] outline-none focus:border-black h-24 resize-none"
                  placeholder="Why are you taking leave?"
                  value={applyForm.reason}
                  onChange={(e) => setApplyForm({...applyForm, reason: e.target.value})}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-df-border">
                <Button variant="secondary" onClick={() => setShowApplyModal(false)} type="button">Cancel</Button>
                <Button variant="primary" type="submit" isLoading={applying}>Submit Request</Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Leave;
