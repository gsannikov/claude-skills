'use client';

import { Edit, Trash2 } from 'lucide-react';
import { openFile, deleteFile } from '../app/actions';
import { useState } from 'react';

interface ActionButtonsProps {
  filePath: string;
  onDelete?: () => void;
}

export default function ActionButtons({ filePath, onDelete }: ActionButtonsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpen = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    await openFile(filePath);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    setIsDeleting(true);
    const res = await deleteFile(filePath);
    setIsDeleting(false);
    
    if (res.success && onDelete) {
        onDelete();
    }
  };

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button 
        onClick={handleOpen}
        className="p-1.5 hover:bg-blue-500/20 text-neutral-400 hover:text-blue-400 rounded-md transition-colors"
        title="Open in Editor"
      >
        <Edit className="w-3 h-3" />
      </button>
      <button 
        onClick={handleDelete}
        className="p-1.5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 rounded-md transition-colors"
        title="Delete File"
        disabled={isDeleting}
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}
