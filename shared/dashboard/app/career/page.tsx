import { getJobs } from '@/lib/api';
import { ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';

export default async function CareerPage() {
  const jobs = await getJobs();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
          Career Database
        </h1>
        <p className="text-neutral-400 mt-1">{jobs.length} analyzed positions</p>
      </header>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/10 text-neutral-400 text-xs uppercase tracking-wider bg-white/5">
                        <th className="p-4 font-medium">Role</th>
                        <th className="p-4 font-medium">Company</th>
                        <th className="p-4 font-medium text-center">Match</th>
                        <th className="p-4 font-medium text-center">Score</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {jobs.map(job => (
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
                                {job.score && (
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
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
