'use client';

import { useState, useMemo } from 'react';
import { ExternalLink, FileText, ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { JobAnalysis } from '@/lib/shared-types';

interface CareerTableProps {
  initialJobs: JobAnalysis[];
}

type SortKey = keyof JobAnalysis | 'match_score' | 'salary_score' | 'growth_score' | 'stress_score' | 'location_score';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

export default function CareerTable({ initialJobs }: CareerTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'added_at', direction: 'desc' });

  const handleSort = (key: SortKey) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const filteredJobs = useMemo(() => {
    return initialJobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [initialJobs, search, statusFilter]);

  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof JobAnalysis];
      let bValue: any = b[sortConfig.key as keyof JobAnalysis];

      // Handle nested or undefined values safely if needed, though types suggest flat structure for most
      // For score components which are optional props on JobAnalysis? 
      // Actually JobAnalysis interface has flat score props now based on api.ts view
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredJobs, sortConfig]);

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-20" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-3 h-3 ml-1 text-cyan-400" />
      : <ArrowDown className="w-3 h-3 ml-1 text-cyan-400" />;
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search roles or companies..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-900/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
           <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-900/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-neutral-300 focus:outline-none focus:border-cyan-500/50 transition-colors"
           >
             <option value="all">All Statuses</option>
             <option value="backlog">Backlog</option>
             <option value="applied">Applied</option>
             <option value="interviewing">Interviewing</option>
             <option value="offer">Offer</option>
             <option value="rejected">Rejected</option>
           </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/10 text-neutral-400 text-xs uppercase tracking-wider bg-white/5">
                        <th className="p-4 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('title')}>
                            <div className="flex items-center">Role <SortIcon columnKey="title" /></div>
                        </th>
                        <th className="p-4 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('company')}>
                            <div className="flex items-center">Company <SortIcon columnKey="company" /></div>
                        </th>
                        <th className="p-4 font-medium text-center cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('match_score')}>
                            <div className="flex items-center justify-center">Match <SortIcon columnKey="match_score" /></div>
                        </th>
                        <th className="p-4 font-medium text-center cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('score')}>
                            <div className="flex items-center justify-center">Score <SortIcon columnKey="score" /></div>
                        </th>
                        <th className="p-4 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('status')}>
                            <div className="flex items-center">Status <SortIcon columnKey="status" /></div>
                        </th>
                        <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {sortedJobs.map(job => (
                        <tr key={job.id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-4">
                                <div className="font-semibold text-white">{job.title}</div>
                                <div className="text-xs text-neutral-500">{new Date(job.added_at).toLocaleDateString()}</div>
                            </td>
                            <td className="p-4 text-neutral-300">{job.company}</td>
                            <td className="p-4">
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-24 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" 
                                            style={{ width: `${job.match_score || 0}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-mono text-neutral-500 w-8 text-right">{job.match_score}</span>
                                </div>
                            </td>
                            <td className="p-4 text-center">
                                {job.score !== undefined && (
                                    <span className={`text-lg font-bold ${
                                        job.score >= 70 ? 'text-green-400' :
                                        job.score >= 50 ? 'text-yellow-400' : 'text-red-400'
                                    }`}>
                                        {job.score}
                                    </span>
                                )}
                            </td>
                            <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                    job.status === 'interviewing' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                    job.status === 'offer' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                    job.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                    'bg-neutral-800 text-neutral-400 border-white/5'
                                }`}>
                                    {job.status}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex justify-end gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                                    {job.url && (
                                        <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-cyan-400 transition-colors" title="View Job">
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                    {/* Placeholder for local file link - potentially via a localized API route in future */}
                                    <span className="text-neutral-600 cursor-not-allowed" title="Analysis View">
                                        <FileText className="w-4 h-4" />
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {sortedJobs.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-neutral-500">
                                No jobs found matching your criteria.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
