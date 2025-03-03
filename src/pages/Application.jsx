import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { addDoc, collection } from 'firebase/firestore';
import axios from 'axios';

const WorkshopApplication = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    poster: null,
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, poster: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    setSuccess('');
  
    if (!formData.poster) {
      setError('Please upload a poster.');
      setUploading(false);
      return;
    }
  
    try {
      console.log("Uploading poster...");
      const imgForm = new FormData();
      imgForm.append('image', formData.poster);
  
      const imgbbResponse = await axios.post(`https://api.imgbb.com/1/upload?key=a58c530da3db7f523fb3a9a37ba30932`, imgForm);
      console.log("ImgBB Response:", imgbbResponse.data);
  
      if (!imgbbResponse.data.success) {
        throw new Error("ImgBB upload failed");
      }
  
      const posterUrl = imgbbResponse.data.data.url;
  
      console.log("Adding workshop to Firestore...");
      await addDoc(collection(db, 'workshops'), {
        name: formData.name,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        poster: posterUrl,
        createdBy: auth.currentUser?.email,
        createdAt: new Date(),
      });
  
      setSuccess('Workshop submitted successfully!');
      setFormData({ name: '', description: '', date: '', time: '', poster: null });
    } catch (err) {
      console.error("Error:", err.message || err);
      setError('Failed to submit workshop. Please try again.');
    }
    setUploading(false);
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">Workshop Application</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Workshop Name" onChange={handleChange} required className="w-full p-2 border rounded" />
          <textarea name="description" placeholder="Description" onChange={handleChange} required className="w-full p-2 border rounded"></textarea>
          <input type="date" name="date" onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="time" name="time" onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="file" onChange={handleFileChange} required className="w-full p-2 border rounded" />
          <button type="submit" disabled={uploading} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            {uploading ? 'Uploading...' : 'Submit Workshop'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkshopApplication;
