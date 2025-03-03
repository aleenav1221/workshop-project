import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const usersCollection = collection(db, 'users');
          const q = query(usersCollection, where("email", "==", user.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0]; // Get the first matching document
            setUserData(userDoc.data());
          } else {
            console.log("No matching user found.");
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

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!userData) {
    return <div className="flex justify-center items-center min-h-screen">No user data found.</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">Profile</h2>
        <div className="space-y-4">
          <div className="flex justify-center">
            {userData.profilePic && <img src={userData.profilePic} alt="Profile" className="w-32 h-32 rounded-full" />}
          </div>
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
    </div>
  );
};

export default Profile;
