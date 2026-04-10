import  { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const AddApplicationModal = ({ onClose }: { onClose: () => void }) => {
  const [jobText, setJobText] = useState(""); // This is the state for the textarea
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ company: "", role: "" });

  const handleAutoFill = async () => {
    if (!jobText.trim()) return alert("Please paste a description!");

    setLoading(true);
    try {
      // We send 'description' as the key to match the backend
      const { data } = await axiosInstance.post('/applications/parse', { 
        description: jobText 
      });

      setFormData({
        company: data.company || "",
        role: data.role || ""
      });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "AI Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await axiosInstance.post('/applications', formData);
      alert("Application Saved!");
      onClose();
    } catch (err) {
      alert("Save failed.");
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl text-white">
      <h2 className="text-xl font-bold mb-4">Analyze Job Posting</h2>
      <textarea 
        className="w-full p-3 bg-gray-800 rounded-lg mb-4 text-sm"
        rows={5}
        value={jobText}
        onChange={(e) => setJobText(e.target.value)}
        placeholder="Paste text here..."
      />
      <button 
        onClick={handleAutoFill} 
        disabled={loading}
        className="w-full bg-indigo-600 py-3 rounded-xl font-bold mb-6"
      >
        {loading ? "Analyzing..." : "✨ Auto-Fill with AI"}
      </button>

      <div className="flex gap-4 mb-6">
        <input 
          className="bg-gray-800 p-3 rounded-lg w-1/2" 
          placeholder="Company"
          value={formData.company}
          onChange={(e) => setFormData({...formData, company: e.target.value})}
        />
        <input 
          className="bg-gray-800 p-3 rounded-lg w-1/2" 
          placeholder="Role"
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
        />
      </div>

      <div className="flex gap-4">
        <button onClick={onClose} className="flex-1 bg-gray-700 py-3 rounded-xl">Cancel</button>
        <button onClick={handleSave} className="flex-1 bg-white text-black py-3 rounded-xl font-bold">Save Entry</button>
      </div>
    </div>
  );
};

export default AddApplicationModal;