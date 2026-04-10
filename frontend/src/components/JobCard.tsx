import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Briefcase, Trash2, MapPin } from 'lucide-react';

export const JobCard = ({ app, onDelete }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: app._id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div 
      ref={setNodeRef} style={style}
      className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700/50 relative group hover:border-indigo-500/50 transition-all shadow-xl"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <h3 className="font-bold text-sm text-slate-100 pr-6 leading-tight">{app.role}</h3>
        <p className="text-xs text-slate-400 mt-2 flex items-center gap-2 font-medium">
          <Briefcase size={12}/> {app.company}
        </p>
        {app.location && (
          <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
            <MapPin size={10}/> {app.location}
          </p>
        )}
      </div>

      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(app._id); }}
        className="absolute top-4 right-4 text-slate-600 hover:text-red-500 transition-opacity opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};