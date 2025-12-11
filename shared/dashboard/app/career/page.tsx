import CareerTable from './CareerTable';
import { getJobs } from '@/lib/api';

export default async function CareerPage() {
  const jobs = await getJobs();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
          Career Database
        </h1>
        <p className="text-neutral-400 mt-1">{jobs.length} analyzed positions</p>
      </header>

      <CareerTable initialJobs={jobs} />
    </div>
  );
}
