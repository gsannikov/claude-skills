import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';
import { glob } from 'glob';
import { DATA_PATHS } from '../paths';
import type { Recipe } from '../shared-types';

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
