import  { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const AddApplicationModal = ({ onClose }: { onClose: () => void }) => {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    salary: "",
    status: "Pending"
  });

  const handleAutoFill = async () => {
    if (!jobDescription.trim()) return alert("Paste a description first!");
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/applications/parse', { description: jobDescription });
      setFormData(prev => ({
        ...prev,
        company: data.company || "",
        role: data.role || "",
        location: data.location || "",
        salary: data.salary || ""
      }));
    } catch (err) {
      alert("AI failed. Ensure GROQ_API_KEY is in Railway Variables.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await axiosInstance.post('/applications', formData);
      alert("Saved successfully!");
      onClose();
    } catch (err) {
      alert("Error saving entry.");
    }
  };

  return (
    <div className="modal-container bg-gray-900 p-6 rounded-2xl text-white">
      <h2 className="text-xl font-bold mb-4">Analyze Job Posting</h2>
      <textarea 
        className="w-full p-3 bg-gray-800 rounded-lg mb-4"
        rows={6}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste details here..."
      />
      <button 
        onClick={handleAutoFill} 
        disabled={loading}
        className="w-full bg-indigo-600 py-3 rounded-xl font-bold mb-6 disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "✨ Auto-Fill with AI"}
      </button>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <input 
          className="bg-gray-800 p-3 rounded-lg" 
          placeholder="Company"
          value={formData.company}
          onChange={(e) => setFormData({...formData, company: e.target.value})}
        />
        <input 
          className="bg-gray-800 p-3 rounded-lg" 
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