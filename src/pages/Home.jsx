import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const workshopCollection = collection(db, "workshops");
        const workshopSnapshot = await getDocs(workshopCollection);
        const workshopList = workshopSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setWorkshops(workshopList);
      } catch (err) {
        console.error("Error fetching workshops:", err);
        setError("Failed to load workshops.");
      }
      setLoading(false);
    };

    fetchWorkshops();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleViewDetails = (workshop) => {
    setSelectedWorkshop(workshop);
  };

  const handleCloseModal = () => {
    setSelectedWorkshop(null);
  };

  if (loading) return <div className="text-center mt-10">Loading workshops...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-[rgb(24,38,104)] p-4 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">Sahrdaya</h1>
        <div>
          <button onClick={() => navigate("/profile")} className="mr-4 px-4 py-2 bg-gray-600 rounded hover:bg-gray-700">
            Profile
          </button>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-500 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </nav>

      {/* Workshops Section */}
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Workshops</h2>
        {workshops.length === 0 ? (
          <p className="text-center text-gray-600">No workshops available.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((workshop) => (
              <div key={workshop.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src={workshop.poster} alt="Workshop Poster" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{workshop.name}</h3>
                  <p className="text-gray-600">
                    {workshop.description.length > 100
                      ? workshop.description.substring(0, 100) + "..."
                      : workshop.description}
                  </p>
                  <button 
                    onClick={() => handleViewDetails(workshop)} 
                    className="mt-3 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for workshop details */}
      {selectedWorkshop && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold">{selectedWorkshop.name}</h2>
            <p className="mt-2 text-gray-700">{selectedWorkshop.description}</p>
            <p className="mt-2 text-sm text-gray-500">📅 {selectedWorkshop.date} | 🕒 {selectedWorkshop.time}</p>
            <button 
              className="mt-4 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Register
            </button>
            <button 
              onClick={handleCloseModal} 
              className="mt-2 w-full bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
