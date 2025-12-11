import { Code, FileText } from 'lucide-react';
import { getCollateralFiles } from '../../lib/api';
import CollateralList from './CollateralList';
import CollateralActions from './CollateralActions';
import path from 'path';
import os from 'os';
import DashboardWidget from '../../components/DashboardWidget';

export default async function GeneratorPage() {
  const collateralFiles = await getCollateralFiles();
  
  // Resolve collateral directory path
  const homeDir = os.homedir();
  const collateralPath = path.join(homeDir, 'Projects', 'exocortex', 'collateral');

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-300">
          Exocortex Generator
        </h1>
        <p className="text-neutral-400 text-base">
          Skill scaffolding and development tools
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <CollateralActions collateralPath={collateralPath} />

        <div className="glass-panel p-6 opacity-50 cursor-not-allowed flex flex-col items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-neutral-500/10 border border-neutral-500/20 flex items-center justify-center">
            <Code className="w-6 h-6 text-neutral-500" />
          </div>
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-1">Generate Skill</h3>
            <p className="text-sm text-neutral-500">Coming soon</p>
          </div>
        </div>

        <div className="glass-panel p-6 opacity-50 cursor-not-allowed flex flex-col items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-neutral-500/10 border border-neutral-500/20 flex items-center justify-center">
            <FileText className="w-6 h-6 text-neutral-500" />
          </div>
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-1">Templates</h3>
            <p className="text-sm text-neutral-500">Coming soon</p>
          </div>
        </div>
      </div>

      <DashboardWidget title="Collateral Files" icon={FileText}>
        <CollateralList files={collateralFiles} />
      </DashboardWidget>
    </div>
  );
}
