import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

// Define the shape of your form data
interface FormData {
  company: string;
  role: string;
  location: string;
  salary: string;
  status: string;
}

const AddApplicationModal: React.FC = () => {
  // 1. Initialize all state hooks correctly
  const [jobDescription, setJobDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    company: "",
    role: "",
    location: "",
    salary: "",
    status: "Pending"
  });

  // 2. The Auto-Fill Function
  const handleAutoFill = async () => {
    if (!jobDescription) {
      alert("Please paste a job description first!");
      return;
    }

    try {
      setLoading(true);
      
      // Hit the Railway backend
      const response = await axiosInstance.post('/applications/parse', { 
        description: jobDescription 
      });

      // 3. Destructure with default values to prevent "undefined" errors
      const { 
        company = "", 
        role = "", 
        location = "", 
        salary = "" 
      } = response.data;
      
      // 4. Update state using the previous state (best practice)
      setFormData((prev) => ({
        ...prev,
        company: company,
        role: role,
        location: location,
        salary: salary,
      }));

      alert("AI has filled the form!");
    } catch (error: any) {
      console.error("AI Autofill Error:", error);
      alert("AI was unable to parse this. Check Railway logs for Groq errors.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-800 text-white">
      <h2 className="text-xl font-bold mb-4">Add New Application</h2>
      
      {/* Description Input */}
      <textarea
        className="w-full p-2 bg-gray-700 rounded mb-2"
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <button
        onClick={handleAutoFill}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "AI is thinking..." : "Auto-fill with AI"}
      </button>

      {/* Example Form Fields */}
      <div className="mt-4 space-y-2">
        <input 
          placeholder="Company" 
          className="w-full p-2 bg-gray-700"
          value={formData.company} 
          onChange={(e) => setFormData({...formData, company: e.target.value})}
        />
        <input 
          placeholder="Role" 
          className="w-full p-2 bg-gray-700"
          value={formData.role} 
          onChange={(e) => setFormData({...formData, role: e.target.value})}
        />
      </div>
    </div>
  );
};

export default AddApplicationModal;