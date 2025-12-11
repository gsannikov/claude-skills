import DashboardWidget from '../../components/DashboardWidget';
import ActionButtons from '../../components/ActionButtons';
import { BookOpen, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { getReadingList } from '../../lib/api';

export default async function ReadingPage() {
  const readingList = await getReadingList();
  
  const toRead = readingList.filter(item => item.status === 'to_read' || !item.status);
  const reading = readingList.filter(item => item.status === 'reading');
  const done = readingList.filter(item => item.status === 'done');

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reading List</h1>
        <p className="text-neutral-400">Curated articles, papers, and books for deep work.</p>
         <div className="text-sm text-neutral-500 mt-2">
            Loaded {readingList.length} items from local vault.
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardWidget title="To Read" icon={BookOpen}>
            <div className="space-y-3">
                 {toRead.length === 0 && <div className="text-sm text-neutral-500 italic">No items queued.</div>}
                 {toRead.map((item, i) => (
                    <ReadingCard key={i} item={item} />
                 ))}
            </div>
        </DashboardWidget>

        <div className="space-y-8">
             <DashboardWidget title="In Progress" icon={Clock} className="border-l-4 border-l-yellow-500/50">
                <div className="space-y-3">
                    {reading.length === 0 && <div className="text-sm text-neutral-500 italic">Nothing currently in progress.</div>}
                    {reading.map((item, i) => (
                        <ReadingCard key={i} item={item} accent="yellow" />
                    ))}
                </div>
            </DashboardWidget>
             <DashboardWidget title="Finished" icon={CheckCircle} className="opacity-75">
                <div className="space-y-3">
                   {done.length === 0 && <div className="text-sm text-neutral-500 italic">Nothing finished yet.</div>}
                    {done.map((item, i) => (
                        <ReadingCard key={i} item={item} accent="green" />
                    ))}
                </div>
            </DashboardWidget>
        </div>
      </div>
    </div>
  );
}

function ReadingCard({ item, accent = 'blue' }: any) {
    return (
        <div className="p-4 glass-panel border border-white/5 hover:bg-white/5 transition-colors relative group">
             <div className="absolute top-2 right-2">
                 <ActionButtons filePath={item.filePath} />
            </div>
            <div className="pr-8">
                <h3 className="font-medium text-lg mb-1 leading-snug">{item.title}</h3>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1 mb-2">
                    {item.url} <ExternalLink className="w-3 h-3" />
                </a>
                {item.summary && (
                    <p className="text-sm text-neutral-400 line-clamp-2">{item.summary}</p>
                )}
            </div>
        </div>
    )
}
