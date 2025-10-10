"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8201/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Грешка при вход.");
        return;
      }

      localStorage.setItem("token", data.token);
      
      // Redirect based on user role
      if (data.user && data.user.role === 'admin') {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Грешка при връзката със сървъра.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetMessage("");
    
    try {
      const res = await fetch("http://localhost:8201/api/password/send-reset-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResetMessage(data.message || "Error sending reset link.");
        return;
      }

      setResetMessage(data.message);
      setResetEmail("");
    } catch (err) {
      console.error(err);
      setResetMessage("Error connecting to server.");
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Side - Logo Space */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-800 via-purple-900 to-indigo-900 flex-col justify-center items-center p-12">
        <div className="text-center">
          {/* RateMyAI Logo */}
          <div className="mb-6">
            {/* Purple Star Icon */}
            <div className="relative w-64 h-64 mx-auto mb-8">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Main star fill */}
                <polygon
                  points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
                  fill="#7c3aed"
                  stroke="#5b21b6"
                  strokeWidth="2"
                  className="drop-shadow-lg"
                />
                {/* Faceted interior design */}
                <polygon
                  points="50,5 50,35 61,35"
                  fill="#8b5cf6"
                />
                <polygon
                  points="50,5 50,35 39,35"
                  fill="#7c3aed"
                />
                <polygon
                  points="50,35 68,57 79,91 50,70"
                  fill="#8b5cf6"
                />
                <polygon
                  points="50,35 32,57 21,91 50,70"
                  fill="#7c3aed"
                />
                <polygon
                  points="50,35 32,57 5,35"
                  fill="#6d28d9"
                />
                <polygon
                  points="50,35 68,57 95,35"
                  fill="#6d28d9"
                />
                
                {/* Connection lines */}
                <line x1="50" y1="5" x2="50" y2="70" stroke="#5b21b6" strokeWidth="2"/>
                <line x1="50" y1="5" x2="32" y2="57" stroke="#5b21b6" strokeWidth="2"/>
                <line x1="50" y1="5" x2="68" y2="57" stroke="#5b21b6" strokeWidth="2"/>
                <line x1="32" y1="57" x2="68" y2="57" stroke="#5b21b6" strokeWidth="2"/>
                <line x1="50" y1="70" x2="21" y2="91" stroke="#5b21b6" strokeWidth="2"/>
                <line x1="50" y1="70" x2="79" y2="91" stroke="#5b21b6" strokeWidth="2"/>
                
                {/* Connection points */}
                <circle cx="50" cy="5" r="4" fill="#ffffff" stroke="#5b21b6" strokeWidth="2"/>
                <circle cx="50" cy="70" r="4" fill="#ffffff" stroke="#5b21b6" strokeWidth="2"/>
                <circle cx="21" cy="91" r="4" fill="#ffffff" stroke="#5b21b6" strokeWidth="2"/>
                <circle cx="79" cy="91" r="4" fill="#ffffff" stroke="#5b21b6" strokeWidth="2"/>
                <circle cx="5" cy="35" r="4" fill="#ffffff" stroke="#5b21b6" strokeWidth="2"/>
                <circle cx="95" cy="35" r="4" fill="#ffffff" stroke="#5b21b6" strokeWidth="2"/>
                <circle cx="32" cy="57" r="4" fill="#ffffff" stroke="#5b21b6" strokeWidth="2"/>
                <circle cx="68" cy="57" r="4" fill="#ffffff" stroke="#5b21b6" strokeWidth="2"/>
                <circle cx="50" cy="35" r="4" fill="#ffffff" stroke="#5b21b6" strokeWidth="2"/>
              </svg>
            </div>
            
            {/* RateMyAI Text */}
            <h1 className="text-6xl font-bold text-white tracking-wide mb-4">
              RateMyAI
            </h1>
            
            {/* Tagline */}
            <p className="text-xl text-purple-100 font-medium leading-relaxed">
              Empowering your teams to discover smarter tools.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Deep Navy with Login Form */}
      <div className="w-full lg:w-1/2 bg-slate-900 flex flex-col justify-center items-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="text-left mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Sign in to your AI Tools account</p>
          </div>
        
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Sign In
            </button>
          </form>
        
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-slate-400 hover:text-purple-400 text-sm transition-colors"
            >
              Forgot password?
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-center">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl w-11/12 max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white text-center mb-6">Reset Password</h3>
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail("");
                    setResetMessage("");
                  }}
                  className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
            {resetMessage && (
              <div className={`mt-4 p-3 rounded-lg text-center ${
                resetMessage.includes("success") 
                  ? "bg-green-900/50 border border-green-700 text-green-200" 
                  : "bg-red-900/50 border border-red-700 text-red-200"
              }`}>
                {resetMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}