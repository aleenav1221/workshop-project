import { useState } from "react";
import { auth } from "../firebase/config";
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate("/home");  // Redirecting to the profile page after login
    } catch (err) {
      console.log(err);
      setError("Invalid email or password. Please try again.");
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-[rgb(24,38,104)] p-4 text-white flex justify-between items-center">

        <h1 className="text-xl font-bold">Sahrdaya</h1>

      </nav>

      {/* Main content */}
      <div className="flex flex-col md:flex-row h-full flex-grow">
        {/* Background image on the left half */}
        <div 
          className="hidden md:block md:w-1/2 bg-cover bg-center" 
          style={{ backgroundImage: "url('/assets/sahrdaya.jpg')" }}
        ></div>
        
        {/* Sign-in card on the right half */}
        <div className="flex flex-col items-center justify-center md:w-1/2 w-full p-6">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96 max-w-full">
            <h2 className="text-2xl font-bold mb-4">Sign In</h2>
            {error && <p className="text-red-500">{error}</p>}
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full p-2 mb-2 border rounded"
            />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Sign In</button>
            <p className="mt-4">
              Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;