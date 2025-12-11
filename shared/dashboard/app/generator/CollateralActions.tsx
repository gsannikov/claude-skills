'use client';

import { FolderOpen } from 'lucide-react';
import { openCollateral } from '../actions';
import { useState } from 'react';

interface CollateralActionsProps {
  collateralPath: string;
}

export default function CollateralActions({ collateralPath }: CollateralActionsProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenCollateral = async () => {
    setIsOpening(true);
    try {
      const result = await openCollateral();
      if (!result.success) {
        alert(result.error || 'Failed to open collateral directory. Make sure it exists.');
      }
    } catch (error) {
      console.error('Failed to open collateral:', error);
      alert('Failed to open collateral directory.');
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <button
      onClick={handleOpenCollateral}
      disabled={isOpening}
      className="glass-panel p-6 hover:bg-white/5 hover:border-cyan-500/30 transition-all flex flex-col items-start gap-4 group cursor-pointer"
    >
      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
        <FolderOpen className="w-6 h-6 text-cyan-400" />
      </div>
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-1 group-hover:text-cyan-300 transition-colors">
          Open Collateral
        </h3>
        <p className="text-sm text-neutral-400">
          Open collateral directory in default editor
        </p>
        <p className="text-xs text-neutral-500 mt-2 font-mono truncate">
          {collateralPath}
        </p>
      </div>
      {isOpening && (
        <div className="text-xs text-cyan-400 animate-pulse">Opening...</div>
      )}
    </button>
  );
}
