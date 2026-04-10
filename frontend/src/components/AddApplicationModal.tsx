import  { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const AddApplicationModal = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    salary: ""
  });

  const handleAutoFill = async () => {
    if (!jobDescription.trim()) return alert("Please paste a description!");

    setLoading(true);
    try {
      // Sending EXACTLY { "description": "text" }
      const response = await axiosInstance.post('/applications/parse', { 
        description: jobDescription 
      });

      const { company, role, location, salary } = response.data;
      
      setFormData({
        company: company || "",
        role: role || "",
        location: location || "",
        salary: salary || ""
      });
    } catch (error: any) {
      console.error("Autofill error:", error.response?.data || error.message);
      alert("Failed to parse. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      <textarea
        className="w-full p-2 bg-gray-800 text-white rounded"
        rows={6}
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      <button
        onClick={handleAutoFill}
        disabled={loading}
        className="w-full mt-2 bg-blue-600 py-2 rounded font-bold text-white disabled:bg-gray-600"
      >
        {loading ? "AI Working..." : "Auto-fill with AI"}
      </button>

      <div className="mt-4 grid grid-cols-1 gap-2">
        <input 
          className="p-2 bg-gray-700 text-white" 
          placeholder="Company" 
          value={formData.company} 
          onChange={(e) => setFormData({...formData, company: e.target.value})}
        />
        <input 
          className="p-2 bg-gray-700 text-white" 
          placeholder="Role" 
          value={formData.role} 
          onChange={(e) => setFormData({...formData, role: e.target.value})}
        />
      </div>
    </div>
  );
};

export default AddApplicationModal;