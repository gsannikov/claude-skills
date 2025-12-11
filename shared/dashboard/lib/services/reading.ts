import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';
import { DATA_PATHS } from '../paths';
import type { ReadingItem } from '../shared-types';

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
