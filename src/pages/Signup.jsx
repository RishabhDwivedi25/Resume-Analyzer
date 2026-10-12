import React, { useState } from "react";
import { registerUser, googleLogin } from "../api/auth";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaFileAlt,
} from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    )
      return 3;
    return 2;
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = await registerUser({
        name,
        email,
        password,
      });

      toast.success(data.message);

      navigate("/verify-otp", {
        state: {
          email,
        },
      });

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const data = await googleLogin(credentialResponse.credential);

      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("profilePhoto", data.user.profilePhoto || "");

      toast.success("Google Registration successful!");

      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Google Auth failed"
      );
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Sign-In failed. Please try again.");
  };

const handleResend = async () => {
  try {
    const data = await resendOTP(email);

    toast.success(data.message);

    setOtp(["", "", "", "", "", ""]);

    setSeconds(60);

    document.getElementById("otp-0")?.focus();

  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      "Failed to resend OTP"
    );
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center px-4">

      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8">

        {/* Logo */}

        <div className="flex flex-col items-center mb-8">

          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <FaFileAlt className="text-blue-600 text-3xl" />
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Resume Analyzer
          </h1>

          <p className="text-gray-500 mt-2 text-center">
            AI-Powered Resume Screening
          </p>

        </div>

        <h2 className="text-2xl font-bold text-center mb-2">
          Create Account 🚀
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Join and analyze your resume with AI
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}

          <div className="relative">
            <FaUser className="absolute left-4 top-4 text-gray-400" />

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}

          <div className="relative">
            <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}

          <div className="relative">

            <FaLock className="absolute left-4 top-4 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

          </div>

          {/* Password Strength */}

          <div>

            <div className="w-full bg-gray-200 rounded-full h-2">

              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  strength === 1
                    ? "bg-red-500 w-1/3"
                    : strength === 2
                    ? "bg-yellow-500 w-2/3"
                    : strength === 3
                    ? "bg-green-500 w-full"
                    : "w-0"
                }`}
              />

            </div>

            <p className="text-sm text-gray-500 mt-2">
              {strength === 0 && "Enter a password"}
              {strength === 1 && "Weak Password"}
              {strength === 2 && "Medium Password"}
              {strength === 3 && "Strong Password"}
            </p>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-300 disabled:bg-gray-400"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Divider & Google Login */}
        <div className="mt-6">
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-gray-300 w-full"></div>
            <span className="bg-white px-3 text-xs text-gray-500 font-semibold uppercase absolute">
              OR
            </span>
          </div>

          <div className="flex justify-center w-full min-h-[44px]">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              shape="pill"
              theme="outline"
              size="large"
              width="350"
            />
          </div>
        </div>

        <p className="text-center mt-8 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Signup;