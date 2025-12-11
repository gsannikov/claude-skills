import fs from 'fs/promises';
import path from 'path';
import os from 'os';

export interface CollateralFile {
  name: string;
  filePath: string;
  size: number;
  modified: Date;
}

export async function getCollateralFiles(): Promise<CollateralFile[]> {
  try {
    // Resolve collateral directory path
    // Default: ~/Projects/exocortex/collateral
    // Match the path used in openCollateral action
    const homeDir = os.homedir();
    const collateralPath = path.join(homeDir, 'Projects', 'exocortex', 'collateral');
    
    // Check if directory exists
    try {
      await fs.access(collateralPath);
    } catch {
      return []; // Directory doesn't exist
    }
    
    const entries = await fs.readdir(collateralPath, { withFileTypes: true });
    const files: CollateralFile[] = [];
    
    for (const entry of entries) {
      if (entry.isFile()) {
        const filePath = path.join(collateralPath, entry.name);
        const stats = await fs.stat(filePath);
        files.push({
          name: entry.name,
          filePath,
          size: stats.size,
          modified: stats.mtime,
        });
      }
    }
    
    // Sort by modified date (newest first)
    files.sort((a, b) => b.modified.getTime() - a.modified.getTime());
    
    return files;
  } catch (error) {
    console.error('Failed to list collateral files:', error);
    return [];
  }
}
