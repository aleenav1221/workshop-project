import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Society = () => {
  const [workshops, setWorkshops] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkshops = async () => {
      if (!auth.currentUser) return;
      try {
        const q = query(collection(db, 'workshops'), where('createdBy', '==', auth.currentUser.email));
        const querySnapshot = await getDocs(q);
        const workshopsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setWorkshops(workshopsList);
      } catch (error) {
        console.error("Error fetching workshops:", error);
      }
      setLoading(false);
    };

    fetchWorkshops();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredWorkshops = workshops.filter(workshop =>
    workshop.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-[rgb(24,38,104)] p-4 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">Society Workshops</h1>
        <div>
          <button onClick={() => navigate("/profile")} className="mr-4 px-4 py-2 bg-gray-600 rounded hover:bg-gray-700">
            Profile
          </button>
          <button onClick={() => auth.signOut()} className="px-4 py-2 bg-red-500 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="p-6">
        <input
          type="text"
          placeholder="Search your workshops..."
          value={search}
          onChange={handleSearch}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Workshops Display */}
      <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-center">Loading workshops...</p>
        ) : filteredWorkshops.length > 0 ? (
          filteredWorkshops.map((workshop) => (
            <div key={workshop.id} className="bg-white rounded-lg shadow-md p-4">
              <img src={workshop.poster} alt={workshop.name} className="w-full h-40 object-cover rounded" />
              <h2 className="text-xl font-semibold mt-2">{workshop.name}</h2>
              <p className="text-gray-600">{workshop.description}</p>
              <p className="text-sm text-gray-500">📅 {workshop.date} | 🕒 {workshop.time}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No workshops found.</p>
        )}
      </div>
    </div>
  );
};

export default Society;
