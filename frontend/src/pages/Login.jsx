import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const handleGoogleLogin = (response) => {
    // Send the token to the backend
    fetch("http://localhost:8000/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: response.credential }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Backend response:", data))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <GoogleOAuthProvider clientId="<YOUR_CLIENT_ID>">
      <div className="min-h-screen flex items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl max-md:max-w-md w-full">
          <div>
            <h2 className="lg:text-5xl text-3xl font-extrabold lg:leading-[55px] text-gray-800">
              Seamless Login for Exclusive Access
            </h2>
            <p className="text-sm mt-6 text-gray-800">
              Immerse yourself in a hassle-free login journey.
            </p>
          </div>
          <div>
            <h3 className="text-gray-800 text-3xl font-extrabold mb-8">
              Sign in
            </h3>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.error("Google Login Error")}
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
