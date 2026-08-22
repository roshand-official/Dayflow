import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Mail, Phone, MoreHorizontal, LayoutGrid, List as ListIcon, X } from 'lucide-react';
import client from '../api/client';
import GlassCard from '../components/ui/GlassCard';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const People = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterDept, setFilterDept] = useState('All');
  const [page, setPage] = useState(1);
  const itemsPerPageGrid = 8;
  const itemsPerPageTable = 10;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await client.get('/employees');
        setEmployees(res.data.employees);
      } catch (error) {
        console.error('Failed to fetch employees', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const departments = ['All', ...new Set(employees.map(e => e.department_name).filter(Boolean))];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.full_name.toLowerCase().includes(search.toLowerCase()) || 
      (emp.job_title && emp.job_title.toLowerCase().includes(search.toLowerCase()));
    const matchesDept = filterDept === 'All' || emp.department_name === filterDept;
    return matchesSearch && matchesDept;
  });

  const itemsPerPage = viewMode === 'grid' ? itemsPerPageGrid : itemsPerPageTable;
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Reset page when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [search, filterDept]);

  return (
    <div className="space-y-6 pb-20 md:pb-0 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 w-full max-w-md flex items-center bg-white rounded-xl border border-[#E8E6E1] px-4 h-12 shadow-sm">
          <Search size={20} className="text-[#777777] mr-3" />
          <input 
            type="text" 
            placeholder="Search by name or role..." 
            className="w-full bg-transparent outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end relative">
          <Button 
            variant={showFilters ? "primary" : "secondary"} 
            icon={Filter} 
            size="md" 
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>

          {showFilters && (
            <div className="absolute top-14 right-0 md:right-auto bg-white border border-[#E8E6E1] p-4 rounded-xl shadow-lg z-50 min-w-[200px]">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-sm">Filter by Department</h4>
                <button onClick={() => setShowFilters(false)} className="text-df-muted hover:text-black">
                  <X size={16} />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {departments.map(dept => (
                  <button
                    key={dept}
                    className={`text-left px-3 py-2 rounded-lg text-sm ${filterDept === dept ? 'bg-[#F7F6F2] font-semibold' : 'hover:bg-[#F7F6F2]'}`}
                    onClick={() => {
                      setFilterDept(dept);
                      setShowFilters(false);
                    }}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex bg-[#E8E6E1] p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-[#777777]'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm' : 'text-[#777777]'}`}
            >
              <ListIcon size={20} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      ) : viewMode === 'grid' ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          {paginatedEmployees.map(emp => (
            <GlassCard key={emp.id} className="group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-[#F7F6F2] to-white -z-10" />
              <div className="flex justify-between items-start mb-4">
                <Avatar src={emp.photo_url} alt={emp.full_name} size="lg" className="border-4 border-white shadow-sm" />
                <button className="p-2 text-df-muted hover:text-black hover:bg-[#F7F6F2] rounded-lg transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-bold truncate">{emp.full_name}</h3>
                <p className="text-sm text-df-muted truncate">{emp.job_title}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="neutral">{emp.department_name || 'No Dept'}</Badge>
                {emp.status === 'active' && <Badge variant="success">Active</Badge>}
                {emp.status === 'on_leave' && <Badge variant="warning">On Leave</Badge>}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-df-border">
                <div className="flex gap-2">
                  <button 
                    className="w-10 h-10 rounded-full border border-df-border flex items-center justify-center text-df-muted hover:text-black hover:border-black transition-all"
                    onClick={(e) => { e.stopPropagation(); alert(`Mailing ${emp.email}...`); }}
                  >
                    <Mail size={16} />
                  </button>
                  <button 
                    className="w-10 h-10 rounded-full border border-df-border flex items-center justify-center text-df-muted hover:text-black hover:border-black transition-all"
                    onClick={(e) => { e.stopPropagation(); alert(`Calling ${emp.phone || 'no number provided'}...`); }}
                  >
                    <Phone size={16} />
                  </button>
                </div>
                <Button variant="ghost" size="sm" className="px-0 group-hover:underline" onClick={() => navigate(`/people/${emp.id}`)}>View Profile</Button>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      ) : (
        <GlassCard className="!p-0 overflow-hidden flex-1">
          <div className="overflow-x-auto h-full max-h-[calc(100vh-220px)]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F7F6F2] sticky top-0 z-10 border-b border-df-border">
                <tr>
                  <th className="py-4 px-6 text-sm font-semibold text-df-muted">Employee</th>
                  <th className="py-4 px-6 text-sm font-semibold text-df-muted">Role & Dept</th>
                  <th className="py-4 px-6 text-sm font-semibold text-df-muted">Status</th>
                  <th className="py-4 px-6 text-sm font-semibold text-df-muted">Contact</th>
                  <th className="py-4 px-6 text-sm font-semibold text-df-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-df-border">
                {paginatedEmployees.map(emp => (
                  <tr key={emp.id} onClick={() => navigate(`/people/${emp.id}`)} className="hover:bg-[#F7F6F2] transition-colors group cursor-pointer">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar src={emp.photo_url} alt={emp.full_name} size="sm" />
                        <div>
                          <p className="font-semibold">{emp.full_name}</p>
                          <p className="text-xs text-df-muted">{emp.employee_code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-sm">{emp.job_title}</p>
                      <p className="text-xs text-df-muted">{emp.department_name}</p>
                    </td>
                    <td className="py-4 px-6">
                      {emp.status === 'active' && <Badge variant="success">Active</Badge>}
                      {emp.status === 'on_leave' && <Badge variant="warning">On Leave</Badge>}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm">{emp.email}</p>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        className="p-2 text-df-muted hover:text-black rounded-lg transition-colors"
                        onClick={(e) => { e.stopPropagation(); alert("More actions coming soon!"); }}
                      >
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm font-semibold text-df-muted">Page {page} of {totalPages}</span>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default People;
