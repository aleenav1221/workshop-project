import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [certificateFiles, setCertificateFiles] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.email);
          const userSnapshot = await getDoc(userRef);
          if (userSnapshot.exists()) {
            setUserData(userSnapshot.data());
          } else {
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCertificateUpload = async (workshopId) => {
    const file = certificateFiles[workshopId];
    if (!file) {
      alert("Please select a certificate file.");
      return;
    }

    // Simulating upload (Replace with actual storage solution like Firebase Storage)
    const fakeCertificateUrl = URL.createObjectURL(file);

    try {
      const userRef = doc(db, "users", auth.currentUser.email);
      const updatedWorkshops = userData.workshops.map(workshop =>
        workshop.id === workshopId ? { ...workshop, certificate: fakeCertificateUrl, certified: true } : workshop
      );

      await updateDoc(userRef, { workshops: updatedWorkshops });

      setUserData(prev => ({
        ...prev,
        workshops: updatedWorkshops
      }));

      alert("Certificate uploaded successfully!");
    } catch (error) {
      console.error("Error uploading certificate:", error);
      alert("Failed to upload certificate.");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading profile...</div>;
  if (!userData) return <div className="text-center mt-10 text-red-500">No user data found.</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-[rgb(24,38,104)] p-4 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">Sahrdaya</h1>
        <div>
          <button onClick={() => navigate("/")} className="mr-4 px-4 py-2 bg-gray-600 rounded hover:bg-gray-700">
            Home
          </button>
          <button onClick={() => auth.signOut()} className="px-4 py-2 bg-red-500 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-col md:flex-row items-start justify-center p-6 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/3">
          <h2 className="text-3xl font-semibold text-center mb-6">Profile</h2>
          <div className="space-y-4">
            {userData.profilePic && <img src={userData.profilePic} alt="Profile" className="w-32 h-32 rounded-full mx-auto" />}
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>SR No:</strong> {userData.srNo}</p>
            <p><strong>Year:</strong> {userData.year}</p>
            <p><strong>Class:</strong> {userData.class}</p>
            <p><strong>Section:</strong> {userData.section}</p>
            <p><strong>Bio:</strong> {userData.bio}</p>
            <p><strong>Skills:</strong> {userData.skills}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-2/3">
          <h2 className="text-2xl font-semibold text-center mb-4">Workshops Attended</h2>
          {userData.workshops && userData.workshops.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {userData.workshops.map((workshop) => (
                <div key={workshop.id} className="bg-gray-50 rounded-lg shadow-md p-4">
                  <img src={workshop.poster} alt="Workshop Poster" className="w-full h-40 object-cover rounded-lg" />
                  <h3 className="text-xl font-bold mt-2">{workshop.name}</h3>
                  <p className="text-gray-500">📅 {workshop.date} | 🕒 {workshop.time}</p>

                  {!workshop.certificate ? (
                    <div className="mt-4">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setCertificateFiles({ ...certificateFiles, [workshop.id]: e.target.files[0] })}
                        className="mb-2"
                      />
                      <button
                        onClick={() => handleCertificateUpload(workshop.id)}
                        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                      >
                        Upload Certificate
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <p className="text-green-500 font-semibold">Certificate Uploaded ✅</p>
                      <a href={workshop.certificate} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        View Certificate
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No workshops attended.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
