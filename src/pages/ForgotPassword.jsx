import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/auth";
import toast from "react-hot-toast";
import { FaEnvelope, FaKey } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Send OTP button clicked");

  setLoading(true);

  try {
    console.log("Calling API...");

    const data = await forgotPassword(email);

    console.log("API Success", data);

    toast.success(data.message);

    navigate("/verify-reset-otp", {
      state: { email },
    });

  } catch (err) {
    console.log("API Error", err);

    toast.error(
      err.response?.data?.message || "Failed to send OTP"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex justify-center items-center px-4">

      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md">

        <div className="flex justify-center mb-6">
          <FaKey className="text-6xl text-blue-600" />
        </div>

        <h2 className="text-3xl font-bold text-center">
          Forgot Password
        </h2>

        <p className="text-center text-gray-500 mt-3 mb-8">
          Enter your registered email.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div className="relative">

            <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full pl-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
          >
            {loading
              ? "Sending OTP..."
              : "Send OTP"}
          </button>

        </form>

        <div className="text-center mt-6">

          <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
};

export default ForgotPassword;