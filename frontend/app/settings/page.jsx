"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [twoFactorStatus, setTwoFactorStatus] = useState(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);

  useEffect(() => {
    fetchUser();
    fetch2FAStatus();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8201/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetch2FAStatus = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8201/api/two-factor/status", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
      if (response.ok) {
        const status = await response.json();
        setTwoFactorStatus(status);
      }
    } catch (error) {
      console.error("Error fetching 2FA status:", error);
    }
  };

  const generateSecret = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setError("Please log in first");
      return;
    }
    
    setError("");
    setIsGenerating(true);
    
    // Test API connectivity first
    try {
      const testResponse = await fetch("http://localhost:8201/api/status");
    } catch (testError) {
      console.error("API connectivity test failed:", testError);
      setError(`Cannot connect to API: ${testError.message}`);
      setIsGenerating(false);
      return;
    }
    
    try {
      const response = await fetch("http://localhost:8201/api/two-factor/generate-secret", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Convert the otpauth URL to a QR code image URL
        const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.qr_code_url)}`;
        
        setQrCodeUrl(qrCodeImageUrl);
        setSecretKey(data.manual_entry_key);
        setShowSetupModal(true);
        setVerificationCode("");
      } else {
        const responseText = await response.text();
        console.error("API Error Response:", response.status, responseText);
        try {
          const errorData = JSON.parse(responseText);
          setError(errorData.message || "Failed to generate 2FA secret");
        } catch (parseError) {
          setError(`Server returned HTML instead of JSON. Status: ${response.status}`);
        }
      }
    } catch (error) {
      console.error("Error generating secret:", error);
      console.error("Error details:", error.message, error.stack);
      setError(`Failed to generate 2FA secret: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const enable2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    const token = localStorage.getItem("token");
    setError("");
    setIsEnabling(true);
    
    try {
      
      const response = await fetch("http://localhost:8201/api/two-factor/enable", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: secretKey,
          code: verificationCode,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setRecoveryCodes(data.recovery_codes);
        setShowRecoveryCodes(true);
        setShowSetupModal(false);
        fetch2FAStatus();
        setSuccess("Two-factor authentication enabled successfully!");
      } else {
        setError(data.message || "Failed to enable 2FA");
      }
    } catch (error) {
      console.error("Error enabling 2FA:", error);
      setError("Failed to enable 2FA");
    } finally {
      setIsEnabling(false);
    }
  };

  const disable2FA = async () => {
    if (!password) {
      setError("Please enter your password");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8201/api/two-factor/disable", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        fetch2FAStatus();
        setSuccess("Two-factor authentication disabled successfully!");
        setPassword("");
      } else {
        setError(data.message || "Failed to disable 2FA");
      }
    } catch (error) {
      console.error("Error disabling 2FA:", error);
      setError("Failed to disable 2FA");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Please log in to access settings</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-purple-900 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <button
            onClick={logout}
            className="text-purple-300 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* User Info */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <div className="text-white">{user.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <div className="text-white">{user.email}</div>
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Two-Factor Authentication</h2>
          
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-900/20 border border-green-500 text-green-300 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {twoFactorStatus && (
            <div className="mb-6">
              <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                <div>
                  <h3 className="text-lg font-medium text-white">Google Authenticator</h3>
                  <p className="text-gray-300">
                    {twoFactorStatus.two_factor_enabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <div>
                  {twoFactorStatus.two_factor_enabled ? (
                    <button
                      onClick={() => setPassword("")}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Disable
                    </button>
                  ) : (
                    <button
                      onClick={generateSecret}
                      disabled={isGenerating}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded transition-colors"
                    >
                      {isGenerating ? "Generating..." : "Enable"}
                    </button>
                  )}
                </div>
              </div>

              {/* Disable 2FA Form */}
              {twoFactorStatus.two_factor_enabled && password !== undefined && (
                <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                  <h4 className="text-white mb-2">Disable Two-Factor Authentication</h4>
                  <p className="text-gray-300 text-sm mb-4">
                    Enter your password to disable two-factor authentication.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="flex-1 px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      onClick={disable2FA}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Confirm Disable
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2FA Setup Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">Setup Google Authenticator</h3>
            
            <div className="mb-4">
              <p className="text-gray-300 text-sm mb-4">
                Scan this QR code with your Google Authenticator app:
              </p>
              {qrCodeUrl && (
                <div className="flex justify-center mb-4">
                  <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                </div>
              )}
            </div>

            <div className="mb-4">
              <p className="text-gray-300 text-sm mb-2">
                Or manually enter this key:
              </p>
              <div className="bg-slate-700 p-3 rounded text-white font-mono text-sm break-all">
                {secretKey}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Enter 6-digit code from your app:
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="w-full px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowSetupModal(false);
                  setVerificationCode("");
                  setError("");
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={enable2FA}
                disabled={isEnabling}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded transition-colors"
              >
                {isEnabling ? "Enabling..." : "Enable 2FA"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recovery Codes Modal */}
      {showRecoveryCodes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">Recovery Codes</h3>
            
            <div className="mb-4">
              <p className="text-gray-300 text-sm mb-4">
                Save these recovery codes in a safe place. You can use them to access your account if you lose your authenticator device.
              </p>
              <div className="bg-slate-700 p-4 rounded">
                <div className="grid grid-cols-2 gap-2">
                  {recoveryCodes.map((code, index) => (
                    <div key={index} className="text-white font-mono text-sm">
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  setShowRecoveryCodes(false);
                  setRecoveryCodes([]);
                  setSuccess("");
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition-colors"
              >
                I've Saved These Codes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
