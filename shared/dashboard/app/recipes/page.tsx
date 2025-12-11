import { getRecipes } from '@/lib/api';
import Link from 'next/link';
import { Clock, Users, ArrowRight } from 'lucide-react';

export default async function RecipesPage() {
  const recipes = await getRecipes();
  
  // Group by type/tag could go here
  
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
          Recipe Collection
        </h1>
        <p className="text-neutral-400 mt-1">{recipes.length} culinary algorithms</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="group">
            <div className="glass-panel p-6 h-full hover:border-emerald-500/30 transition-all hover:bg-white/5 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl">{recipe.icon || '🍳'}</div>
                <div className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wider ${
                    recipe.status === 'Perfected' ? 'bg-emerald-500/20 text-emerald-300' : 
                    'bg-neutral-800 text-neutral-400'
                }`}>
                    {recipe.status}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-1 group-hover:text-emerald-300 transition-colors">
                {recipe.name}
              </h3>
              <p className="text-neutral-500 text-sm mb-4">{recipe.name_en}</p>
              
              <div className="flex items-center gap-4 mt-auto text-sm text-neutral-400">
                {recipe.prep_time && (
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {recipe.prep_time}
                    </div>
                )}
                {recipe.servings && (
                    <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {recipe.servings}
                    </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-neutral-500">
                 <div className="flex gap-2">
                    {recipe.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="bg-white/5 px-2 py-0.5 rounded">#{tag}</span>
                    ))}
                 </div>
                 <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
