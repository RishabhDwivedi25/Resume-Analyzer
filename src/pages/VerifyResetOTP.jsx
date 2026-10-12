import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import { resendOTP } from "../api/auth";
import toast from "react-hot-toast";
import { FaShieldAlt, FaLock } from "react-icons/fa";


const VerifyResetOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleOTPChange = (e, index) => {
    const value = e.target.value;

    if (!/^[0-9]?$/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      otp[index] === "" &&
      index > 0
    ) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").trim();

    if (!/^\d{6}$/.test(pasted)) return;

    setOtp(pasted.split(""));
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const code = otp.join("");

      await API.post("/auth/verify-reset-otp", {
        email,
        otp: code,
      });

      toast.success("OTP Verified Successfully!");
     
      navigate("/reset-password", {
        state: {
          email,
        },
      });

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex justify-center items-center px-4">

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">

        <div className="flex flex-col items-center mb-8">

          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <FaLock className="text-blue-600 text-3xl" />
          </div>

          <h1 className="text-3xl font-bold">
            Resume Analyzer
          </h1>

          <p className="text-gray-500 mt-2">
            Secure Password Recovery
          </p>

        </div>

        <div className="flex justify-center mb-5">
          <FaShieldAlt className="text-blue-600 text-6xl" />
        </div>

        <h2 className="text-2xl font-bold text-center">
          Verify Reset OTP
        </h2>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Enter the OTP sent to
          <br />
          <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify}>

          <div
            className="flex justify-center gap-3 mb-8"
            onPaste={handlePaste}
          >

            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOTPChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 border-2 rounded-xl text-center text-2xl font-bold focus:border-blue-500 focus:outline-none"
              />
            ))}

          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

        <div className="text-center mt-6">

          {seconds > 0 ? (
            <p className="text-gray-500">
              Resend OTP in
              <span className="font-bold text-blue-600">
                {" "}
                {seconds}s
              </span>
            </p>
          ) : (
            <button
                type="button"
                onClick={handleResend}
                className="text-blue-600 font-semibold hover:underline"
              >
                Resend OTP
            </button>
          )}

        </div>

        <div className="text-center mt-6">

          <Link
            to="/forgot-password"
            className="text-gray-500 hover:text-blue-600"
          >
            ← Back
          </Link>

        </div>

      </div>

    </div>
  );
};

export default VerifyResetOTP;