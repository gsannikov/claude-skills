import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';
import matter from 'gray-matter';
import { glob } from 'glob';
import { DATA_PATHS } from './paths';
import type { JobAnalysis, Idea, ReadingItem, Recipe, ActivityItem } from './shared-types';

export { JobAnalysis, Idea, ReadingItem, Recipe, ActivityItem };

export async function getJobs(): Promise<JobAnalysis[]> {
  try {
    const jobs: JobAnalysis[] = [];

    // 1. Fetch Analyzed Jobs
    try {
      await fs.access(DATA_PATHS.analyses);
      const files = await fs.readdir(DATA_PATHS.analyses);
      for (const file of files) {
        if (!file.endsWith('.yaml')) continue;
        const filePath = path.join(DATA_PATHS.analyses, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const data = yaml.parse(content);
        jobs.push({
          id: data.id || file.replace('.yaml', ''),
          title: data.title || 'Unknown Role',
          company: data.company || 'Unknown Company',
          status: data.status || 'backlog',
          priority: data.priority || 'Third',
          score: data.analysis?.score || 0,
          match_score: data.analysis?.components?.match || 0,
          salary_score: data.analysis?.components?.income || 0,
          growth_score: data.analysis?.components?.growth || 0,
          stress_score: data.analysis?.components?.stress || 0,
          location_score: data.analysis?.components?.location || 0,
          added_at: data.added_at || new Date().toISOString(),
          url: data.url,
          filePath: filePath
        });
      }
    } catch {
      // Ignore if analyzed dir missing
    }

    // 2. Fetch Pending Backlog
    try {
        const backlogPath = path.join(DATA_PATHS.career, 'jobs/backlog.yaml');
        await fs.access(backlogPath);
        const content = await fs.readFile(backlogPath, 'utf-8');
        const data = yaml.parse(content);
        
        if (data.jobs && data.jobs.pending) {
            for (const item of data.jobs.pending) {
                // Parse score string "73/100" or number
                let score = 0;
                if (typeof item.score === 'number') score = item.score;
                if (typeof item.score === 'string') score = parseFloat(item.score.split('/')[0]) || 0;

                jobs.push({
                    id: item.file?.replace('.md', '') || `pending-${Math.random().toString(36).substr(2, 9)}`,
                    title: item.role || 'Unknown Role',
                    company: item.company || 'Unknown Company',
                    status: 'backlog', // Display as backlog
                    priority: 'Third',
                    score: score,
                    added_at: new Date().toISOString(), // No date in backlog, use now
                    url: item.url,
                    filePath: backlogPath
                });
            }
        }
    } catch (e) {
        console.warn('Failed to load backlog:', e);
    }
    
    // Sort by date desc (or score if dates equal)
    return jobs.sort((a, b) => {
        const dateDiff = new Date(b.added_at).getTime() - new Date(a.added_at).getTime();
        if (dateDiff !== 0) return dateDiff;
        return (b.score || 0) - (a.score || 0);
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export async function getSystemStats() {
    // Real stats based on data volume
    const jobs = await getJobs();
    const ideas = await getIdeas();
    const recipes = await getRecipes();
    const reading = await getReadingList();
    
    // Calculate "knowledge load" as a percentage of some arbitrary goal (e.g. 1000 items)
    const totalItems = jobs.length + ideas.length + recipes.length + reading.length;
    const load = Math.min(Math.round((totalItems / 1000) * 100), 100);

    return {
        status: 'Operational',
        uptime: '99.9%', // Keeps this as 'availability' target
        cpu: load, // Re-purposed as "Knowledge Index"
        memory: process.memoryUsage().heapUsed / 1024 / 1024 // Real heap usage in MB
    }
}

export async function getActivityFeed(): Promise<ActivityItem[]> {
    const jobs = await getJobs();
    const ideas = await getIdeas();
    const recipes = await getRecipes();

    const activities: ActivityItem[] = [
        ...jobs.map(j => ({
            id: `job-${j.id}`,
            type: 'job' as const,
            title: j.title,
            date: j.added_at,
            url: `/career`, // internal link
            action: `Tracked application`
        })),
        ...ideas.map(i => ({
            id: `idea-${i.id}`,
            type: 'idea' as const,
            title: i.title,
            date: i.date,
            url: `/ideas`,
            action: `Captured idea`
        })),
        ...recipes.map(r => ({
            id: `recipe-${r.id}`,
            type: 'recipe' as const,
            title: r.name,
            date: r.source?.date_added || new Date().toISOString(), // Fallback
            url: `/recipes/${r.id}`,
            action: `Added recipe`
        }))
    ];

    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
}

export async function getIdeas(): Promise<Idea[]> {
    try {
        const ideasDir = path.join(DATA_PATHS.career, '../ideas-capture/expanded');
        try { await fs.access(ideasDir); } catch { return []; }

        const files = await fs.readdir(ideasDir);
        const ideas: Idea[] = [];

        for (const file of files) {
            if (!file.endsWith('.md')) continue;
            const filePath = path.join(ideasDir, file);
            const content = await fs.readFile(filePath, 'utf-8');
            const { data, content: body } = matter(content);
            
            ideas.push({
                id: file,
                title: data.title || file.replace('.md', ''),
                tags: data.tags || [],
                content: body,
                filePath,
                date: (await fs.stat(filePath)).mtime.toISOString()
            });
        }
        return ideas.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch {
        return [];
    }
}

export async function getReadingList(): Promise<ReadingItem[]> {
    try {
        const filePath = path.join(DATA_PATHS.readingList, 'reading-list.yaml');
        const content = await fs.readFile(filePath, 'utf-8');
        const data = yaml.parse(content) as any[];
        
        return data.map((item: any) => ({
            ...item,
            filePath // Point to main list file for now
        }));
    } catch {
        return [];
    }
}

export async function getRecipes(): Promise<Recipe[]> {
    try {
         const recipesDir = DATA_PATHS.recipes;
         const files = await glob(path.join(recipesDir, '**/*.yaml'));
         
         const recipes: Recipe[] = [];
         for(const file of files) {
             const content = await fs.readFile(file, 'utf-8');
             const data = yaml.parse(content);
             recipes.push({
                 id: path.basename(file, '.yaml'),
                 name: data.name || path.basename(file, '.yaml'),
                 name_en: data.name_en,
                 type: data.type,
                 icon: data.icon,
                 status: data.status || 'To try',
                 tags: data.tags || [],
                 prep_time: data.prep_time,
                 cook_time: data.cook_time,
                 servings: data.servings,
                 ingredients: data.ingredients || [],
                 instructions: data.instructions || [],
                 notes: data.notes || [],
                 source: data.source,
                 filePath: file
             });
         }
         return recipes;
    } catch {
        return [];
    }
}

export async function getRecipe(id: string): Promise<Recipe | null> {
    try {
        const recipes = await getRecipes();
        return recipes.find(r => r.id === id) || null;
    } catch {
        return null;
    }
}
