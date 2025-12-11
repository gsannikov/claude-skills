import DashboardWidget from '../../components/DashboardWidget';
import ActionButtons from '../../components/ActionButtons';
import { Lightbulb, Plus, Star, FileText } from 'lucide-react';
import { getIdeas } from '../../lib/api';

export default async function IdeasPage() {
  const ideas = await getIdeas();

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end mb-8">
        <div>
            <h1 className="text-3xl font-bold mb-2">Ideas & Notes</h1>
            <p className="text-neutral-400">Capture, organize, and develop your thoughts.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors font-medium">
            <Plus className="w-4 h-4" />
            New Idea
        </button>
      </header>

      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {ideas.length === 0 && (
            <div className="text-neutral-500 p-8 glass-panel text-center col-span-full">
                No ideas found in ideas-capture/expanded
            </div>
        )}
        {ideas.map((idea) => (
            <div key={idea.id} className="glass-panel p-6 hover:border-purple-500/30 transition-colors group cursor-pointer break-inside-avoid relative mb-6">
                <div className="absolute top-2 right-2">
                    <ActionButtons filePath={idea.filePath} />
                </div>
                <div className="flex justify-between items-start mb-4 pr-8">
                    <div className="flex gap-2 flex-wrap">
                        {idea.tags && idea.tags.length > 0 ? idea.tags.map(tag => (
                             <span key={tag} className="px-2 py-1 rounded-md bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20">
                                {tag}
                            </span>
                        )) : (
                            <span className="px-2 py-1 rounded-md bg-neutral-500/10 text-neutral-400 text-xs font-medium border border-neutral-500/20">
                                Note
                            </span>
                        )}
                    </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-300 transition-colors">{idea.title}</h3>
                <p className="text-sm text-neutral-400 line-clamp-4 leading-relaxed">
                    {idea.content || "No content preview available."}
                </p>
                <div className="mt-4 pt-4 border-t border-white/5 text-xs text-neutral-600 flex justify-between items-center">
                    <span>{new Date(idea.date).toLocaleDateString()}</span>
                    <FileText className="w-3 h-3" />
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
