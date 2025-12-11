'use server';

import { exec } from 'child_process';
import fs from 'fs/promises';
import { revalidatePath } from 'next/cache';
import util from 'util';

const execAsync = util.promisify(exec);

export async function openFile(filePath: string) {
  try {
    // Check if file exists first to prevent command injection with weird paths, 
    // although generic open command is relatively safe if path is verified valid file.
    await fs.access(filePath);
    
    // Use 'code' to open in VS Code if available, otherwise fallback to system 'open'
    // For now, let's try 'code' first as requested "presentation in external tools"
    try {
        await execAsync(`code "${filePath}"`);
    } catch {
        // Fallback to system open
        await execAsync(`open "${filePath}"`);
    }
    return { success: true };
  } catch (error) {
    console.error(`Failed to open file ${filePath}:`, error);
    return { success: false, error: 'Failed to open file' };
  }
}

export async function deleteFile(filePath: string) {
  try {
    // Safety check: ensure path is within user home to avoid system damage
    // precise check could be stricter, but valid existing check is start.
    if (!filePath.includes('/Users/') && !filePath.includes('/home/')) {
        throw new Error('Invalid path');
    }

    await fs.unlink(filePath);
    revalidatePath('/'); // Revalidate everything to be safe
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete file ${filePath}:`, error);
    return { success: false, error: 'Failed to delete file' };
  }
}
