import  { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

interface FormData {
  company: string;
  role: string;
  location: string;
  salary: string;
}

const AddApplicationModal = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    company: "",
    role: "",
    location: "",
    salary: ""
  });

  const handleAutoFill = async () => {
    if (!jobDescription) return alert("Paste a description first!");
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/applications/parse', { 
        description: jobDescription 
      });
      
      setFormData({
        company: data.company || "",
        role: data.role || "",
        location: data.location || "",
        salary: data.salary || ""
      });
    } catch (err) {
      console.error(err);
      alert("AI failed. Check if GROQ_API_KEY is set in Railway Variables.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl">
      <textarea 
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste job description here..."
        className="w-full p-3 bg-gray-800 rounded-md mb-4"
        rows={5}
      />
      <button 
        onClick={handleAutoFill} 
        disabled={loading}
        className="w-full py-2 bg-blue-600 rounded-md font-bold mb-6"
      >
        {loading ? "AI is Analyzing..." : "✨ Auto-fill with AI"}
      </button>

      <div className="grid grid-cols-2 gap-4">
        <input value={formData.company} placeholder="Company" className="p-2 bg-gray-800" readOnly />
        <input value={formData.role} placeholder="Role" className="p-2 bg-gray-800" readOnly />
      </div>
    </div>
  );
};

export default AddApplicationModal;