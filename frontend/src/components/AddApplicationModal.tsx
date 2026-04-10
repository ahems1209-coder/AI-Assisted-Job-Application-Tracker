import { useState } from 'react';
import API from '../api/axiosInstance';
import { X, Sparkles, Loader2 } from 'lucide-react';

const AddApplicationModal = ({ isOpen, onClose, onRefresh }: any) => {
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ company: '', role: '', status: 'Applied' });

  const handleAIParse = async () => {
    setLoading(true);
    try {
      const { data } = await API.post('/applications/parse', { jdText });
      setFormData({ ...formData, company: data.company || '', role: data.role || '' });
    } catch (err) {
      alert("AI Parsing failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await API.post('/applications', formData);
      onRefresh();
      onClose();
      setFormData({ company: '', role: '', status: 'Applied' });
      setJdText('');
    } catch (err) {
      alert("Error saving job.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-slate-900">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-black flex items-center gap-2 text-slate-800 uppercase italic">
            <Sparkles className="text-blue-600" size={22} /> Add Job
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X /></button>
        </div>

        <div className="p-8 space-y-6">
          <textarea 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-32 text-sm outline-none focus:border-blue-500"
            placeholder="Paste Job Description here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
          <button 
            onClick={handleAIParse}
            disabled={loading || !jdText}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? "Analyzing..." : "Auto-Fill with AI"}
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" placeholder="Company Name" value={formData.company}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500"
              onChange={(e) => setFormData({...formData, company: e.target.value})}
            />
            <input 
              type="text" placeholder="Job Title" value={formData.role}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500"
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            />
          </div>
          
          <button 
            onClick={handleSave}
            disabled={!formData.company || !formData.role}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 disabled:opacity-50"
          >
            Save Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddApplicationModal;