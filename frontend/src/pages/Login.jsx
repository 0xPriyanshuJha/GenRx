import { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/login", {
        username: userID,
        password: password,
      });
      localStorage.setItem("token", response.data.access_token);
      setMessage("Login successful!");
    } catch (error) {
      setMessage("Login failed: " + error.response.data.detail);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/google-auth?code=${credentialResponse.credential}`
      );
      localStorage.setItem("token", response.data.access_token);
      setMessage("Google Login successful!");
    } catch (error) {
      setMessage("Google Login failed");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-96 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-center mb-4">Login</h2>
        {message && <p className="text-center text-red-500">{message}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="User ID"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <div className="text-center my-4 text-gray-500">OR</div>
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
          <GoogleLogin onSuccess={handleGoogleLogin} onError={() => console.log("Login Failed")} />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default Login;
