import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';
import { DATA_PATHS } from '../paths';
import type { JobAnalysis } from '../shared-types';

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
