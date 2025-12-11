'use server';

import { exec } from 'child_process';
import fs from 'fs/promises';
import { revalidatePath } from 'next/cache';
import util from 'util';
import os from 'os';
import path from 'path';

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

export async function openDirectory(dirPath: string) {
  try {
    // Check if directory exists first
    const stats = await fs.stat(dirPath);
    if (!stats.isDirectory()) {
      return { success: false, error: 'Path is not a directory' };
    }
    
    // Use 'code' to open in VS Code if available, otherwise fallback to system 'open'
    try {
        await execAsync(`code "${dirPath}"`);
    } catch {
        // Fallback to system open (opens in Finder on macOS, file manager on Linux)
        await execAsync(`open "${dirPath}"`);
    }
    return { success: true };
  } catch (error) {
    console.error(`Failed to open directory ${dirPath}:`, error);
    return { success: false, error: 'Failed to open directory' };
  }
}

export async function openCollateral() {
  // Resolve collateral directory path
  // Default: ~/Projects/exocortex/collateral
  // You can customize this path as needed
  const homeDir = os.homedir();
  const collateralPath = path.join(homeDir, 'Projects', 'exocortex', 'collateral');
  
  return openDirectory(collateralPath);
}

export async function openCollateralInEditor() {
  try {
    // Resolve collateral directory path
    const homeDir = os.homedir();
    const collateralPath = path.join(homeDir, 'Projects', 'exocortex', 'collateral');
    
    // Check if directory exists
    const stats = await fs.stat(collateralPath);
    if (!stats.isDirectory()) {
      return { success: false, error: 'Collateral directory does not exist' };
    }
    
    // Try to open in VS Code first, then fallback to system default editor
    try {
      await execAsync(`code "${collateralPath}"`);
    } catch {
      // Fallback to system open (opens in Finder on macOS, file manager on Linux)
      // For opening in default editor, we can try 'open' with specific app on macOS
      if (os.platform() === 'darwin') {
        // Try to open with default editor using 'open -a'
        try {
          await execAsync(`open -a "Visual Studio Code" "${collateralPath}"`);
        } catch {
          await execAsync(`open "${collateralPath}"`);
        }
      } else {
        await execAsync(`xdg-open "${collateralPath}"`);
      }
    }
    return { success: true };
  } catch (error) {
    console.error(`Failed to open collateral in editor:`, error);
    return { success: false, error: 'Failed to open collateral in editor' };
  }
}
