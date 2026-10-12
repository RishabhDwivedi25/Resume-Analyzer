import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaUser,
  FaPhone,
  FaSave,
  FaArrowLeft,
} from "react-icons/fa";

const EditProfile = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();

      setName(data.user.name);
      setPhone(data.user.phone || "");
    } catch {
      toast.error("Failed to load profile");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await updateProfile({
        name,
        phone,
      });

      toast.success("Profile Updated");

      navigate("/profile");

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Update Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex justify-center items-center px-4">

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 mb-6"
        >
          <FaArrowLeft />
          Back
        </button>

        <h2 className="text-3xl font-bold text-center mb-8">
          Edit Profile
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div className="relative">

            <FaUser className="absolute left-4 top-4 text-gray-400"/>

            <input
              className="w-full border rounded-xl py-3 pl-12 pr-4"
              placeholder="Full Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />

          </div>

          <div className="relative">

            <FaPhone className="absolute left-4 top-4 text-gray-400"/>

            <input
              className="w-full border rounded-xl py-3 pl-12 pr-4"
              placeholder="Phone Number"
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
            />

          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex justify-center items-center gap-3"
          >
            <FaSave />

            {loading
              ? "Saving..."
              : "Save Changes"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default EditProfile;