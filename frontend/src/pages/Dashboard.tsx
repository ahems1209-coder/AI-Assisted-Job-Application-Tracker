import { useState, useEffect } from 'react';
import { DndContext, closestCorners, useDroppable, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, LogOut, Loader2, Sparkles, Copy } from 'lucide-react';
import API from '../api/axiosInstance';
import { JobCard } from '../components/JobCard';

const columns = ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'] as const;

// Droppable Column Wrapper
const KanbanColumn = ({ id, title, children, count }: any) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-4xl min-h-[70vh]">
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</h2>
        <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-bold">{count}</span>
      </div>
      {children}
    </div>
  );
};

export default function Dashboard() {
  const [apps, setApps] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jdText, setJdText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [formData, setFormData] = useState({ company: '', role: '', location: '', status: 'Applied' });

  const loadData = async () => {
    const res = await API.get('/applications');
    setApps(res.data);
  };

  useEffect(() => { loadData(); }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const appId = active.id as string;
    const newStatus = over.id as string;

    if (columns.includes(newStatus as any)) {
      setApps(prev => prev.map(a => a._id === appId ? { ...a, status: newStatus as any } : a));
      await API.patch(`/applications/${appId}/status`, { status: newStatus });
    }
  };

  const handleAIParse = async () => {
    setLoading(true);
    try {
      const res = await API.post('/applications/parse', { jdText });
      setFormData({ ...formData, company: res.data.company, role: res.data.role, location: res.data.location });
      setSuggestions(res.data.resumeSuggestions || []);
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    await API.post('/applications', formData);
    setShowModal(false);
    setFormData({ company: '', role: '', location: '', status: 'Applied' });
    setSuggestions([]);
    loadData();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-8 font-sans">
      <div className="flex justify-between items-center mb-12 max-w-7xl mx-auto">
        <h1 className="text-xl font-black italic tracking-tighter">AI JOB TRACKER</h1>
        <div className="flex items-center gap-6">
          <button onClick={() => { localStorage.removeItem('token'); window.location.href='/login' }} className="text-slate-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors"><LogOut size={14}/> Logout</button>
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-full flex items-center gap-2 font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all"><Plus size={18} /> Add Application</button>
        </div>
      </div>

      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {columns.map(col => {
            const columnApps = apps.filter(a => a.status === col);
            return (
              <KanbanColumn key={col} id={col} title={col} count={columnApps.length}>
                <SortableContext items={columnApps.map(a => a._id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4">
                    {columnApps.map(a => (
                      <JobCard key={a._id} app={a} onDelete={(id: string) => API.delete(`/applications/${id}`).then(loadData)} />
                    ))}
                    {columnApps.length === 0 && (
                      <div className="h-24 border-2 border-dashed border-slate-800/40 rounded-3xl flex items-center justify-center opacity-40">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Drop Here</span>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </KanbanColumn>
            );
          })}
        </div>
      </DndContext>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-slate-800 w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-6">Analyze Job Posting</h2>
            <textarea className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none mb-4 transition-all" placeholder="Paste JD here..." rows={5} value={jdText} onChange={(e) => setJdText(e.target.value)} />
            <button onClick={handleAIParse} className="w-full bg-indigo-600 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 mb-6 hover:bg-indigo-500">
              {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={16}/> Auto-Fill with AI</>}
            </button>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <input value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="bg-slate-800 p-3.5 rounded-xl text-sm border border-transparent focus:border-slate-600 outline-none" placeholder="Company" />
              <input value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="bg-slate-800 p-3.5 rounded-xl text-sm border border-transparent focus:border-slate-600 outline-none" placeholder="Role" />
            </div>

            {suggestions.length > 0 && (
              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-6 mb-8">
                <p className="text-[10px] font-black text-indigo-400 mb-4 uppercase tracking-widest">Tailored Resume Bullets</p>
                {suggestions.map((s, i) => (
                  <div key={i} className="flex justify-between items-start gap-4 mb-3 group">
                    <p className="text-[11px] text-slate-400 italic">"{s}"</p>
                    <button onClick={() => {navigator.clipboard.writeText(s); alert("Copied!")}} className="text-slate-600 hover:text-indigo-400"><Copy size={12}/></button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-4">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-800 py-3.5 rounded-2xl font-bold text-sm text-slate-500 hover:bg-slate-700">Cancel</button>
              <button onClick={handleSave} className="flex-1 bg-white text-black py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-200">Save Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}