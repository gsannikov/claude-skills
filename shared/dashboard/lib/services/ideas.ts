import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { DATA_PATHS } from '../paths';
import type { Idea } from '../shared-types';

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
