import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';

const Login = () => {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password. Try hr@dayflow.com / dayflow123');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'hr') {
      setEmail('hr@dayflow.com');
      setPassword('dayflow123');
    } else {
      setEmail('ananya@dayflow.com');
      setPassword('dayflow123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F6F2] p-4 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#D7FF00] opacity-20 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#BFDCE8] opacity-30 blur-[100px]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#D7FF00] text-black text-3xl font-bold mb-4 shadow-sm">
            D
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to DayFlow</h1>
          <p className="text-[#777777]">HR, without the busywork.</p>
        </div>

        <GlassCard className="!p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-[#FFF0F0] text-df-danger-text text-sm font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Work Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@dayflow.com"
                  className="w-full h-12 px-4 rounded-xl border border-[#E8E6E1] bg-[#F7F6F2] focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 px-4 rounded-xl border border-[#E8E6E1] bg-[#F7F6F2] focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>
          
          <div className="mt-8 border-t border-[#E8E6E1] pt-6">
            <p className="text-sm text-center text-df-muted font-medium mb-4">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" size="sm" onClick={() => handleFillDemo('hr')}>
                HR Officer
              </Button>
              <Button variant="secondary" size="sm" onClick={() => handleFillDemo('emp')}>
                Employee
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Login;
