import { getJobs } from './jobs';
import { getIdeas } from './ideas';
import { getRecipes } from './recipes';
import { getReadingList } from './reading';
import type { ActivityItem } from '../shared-types';

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
