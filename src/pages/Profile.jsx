import React, { useEffect, useState } from "react";
import { getProfile } from "../api/auth";
import { uploadPhoto } from "../api/auth";
import { removePhoto } from "../api/auth";
import {
  FaCamera,
  FaPen,
  FaKey,
  FaSignOutAlt,
  FaCheck,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      if (data) {
        if (data.name) localStorage.setItem("name", data.name);
        if (data.email) localStorage.setItem("email", data.email);
        if (data.profilePhoto !== undefined) localStorage.setItem("profilePhoto", data.profilePhoto || "");
      }
    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");

    toast.success("Logged out successfully");

    navigate("/login");
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setUploading(true);

    try {
      await uploadPhoto(file);

      toast.success("Profile photo updated");

      loadProfile();
    } catch (err) {
      console.log(err);
      console.log(err.response?.data);

      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      await removePhoto();

      toast.success("Profile photo removed");

      loadProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove photo");
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-center">
        <p className="text-[#475569] text-sm tracking-wide">
          Loading profile...
        </p>
      </div>
    );
  }

  const { user, totalResumes } = profile;

  const joined = new Date(user.createdAt).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .pf-serif { font-family: 'Fraunces', serif; }
        .pf-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      <div className="max-w-md mx-auto">

        {/* Passport panel */}
        <div className="rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.06),0_12px_28px_-8px_rgba(15,23,42,0.18)]">

          {/* Bio-data header — gradient + hairline texture layered in one background */}
          <div
            className="relative px-6 pt-7 pb-8"
            style={{
              backgroundImage: `repeating-linear-gradient(115deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 7px), linear-gradient(135deg, #2563EB, #4F46E5)`,
            }}
          >

            <p className="pf-mono text-[10px] tracking-[0.2em] text-white/90 uppercase mb-5">
              Career Profile · No. {user._id ? user._id.slice(-6).toUpperCase() : "000000"}
            </p>

            <div className="flex items-end gap-4">

              {/* Photo box */}
              <div className="relative shrink-0">
                <input
                  type="file"
                  id="photo"
                  hidden
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />

                <label
                  htmlFor="photo"
                  className="group relative block w-[84px] h-[104px] rounded-md overflow-hidden border-2 border-white shadow-md cursor-pointer bg-white"
                >
                  <img
                    src={
                      user.profilePhoto ||
                      `https://ui-avatars.com/api/?name=${user.name}&background=EFF6FF&color=2563EB`
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-[#0F172A]/0 group-hover:bg-[#0F172A]/50 flex items-center justify-center transition">
                    <FaCamera className="text-white text-sm opacity-0 group-hover:opacity-100 transition" />
                  </div>

                  {uploading && (
                    <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                      <span className="pf-mono text-[9px] font-semibold text-[#2563EB]">
                        UPLOADING
                      </span>
                    </div>
                  )}
                </label>
              </div>

              {/* Name + email */}
              <div className="pb-1 min-w-0">
                <h1 className="pf-serif text-[26px] leading-[1.05] font-medium text-white truncate">
                  {user.name}
                </h1>
                <p className="pf-mono text-[10px] tracking-[0.12em] text-white/90 uppercase mt-1.5">
                  {user.email}
                </p>
              </div>
            </div>

            {user.profilePhoto && (
              <button
                onClick={handleRemovePhoto}
                className="pf-mono text-[10px] tracking-wide uppercase text-white/90 hover:text-white transition mt-3 underline underline-offset-2"
              >
                Remove photo
              </button>
            )}

            {/* Verified stamp */}
            <div
              className="absolute top-5 right-5 w-[64px] h-[64px] rounded-full border-2 border-white bg-white/10 flex flex-col items-center justify-center text-center rotate-[-10deg]"
              title="Verified account"
            >
              <FaCheck className="text-white text-[12px] mb-0.5" />
              <span className="pf-mono text-[7px] tracking-[0.08em] text-white uppercase leading-tight font-semibold">
                Verified<br />Account
              </span>
            </div>
          </div>

          {/* Data field strip */}
          <div className="bg-white grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200">
            <div className="px-6 py-4">
              <p className="pf-mono text-[10px] tracking-[0.12em] text-[#64748B] uppercase mb-1">
                Resumes analyzed
              </p>
              <p className="pf-serif text-2xl text-[#0F172A]">{totalResumes}</p>
            </div>
            <div className="px-6 py-4">
              <p className="pf-mono text-[10px] tracking-[0.12em] text-[#64748B] uppercase mb-1">
                Member since
              </p>
              <p className="pf-serif text-2xl text-[#0F172A]">{joined}</p>
            </div>
          </div>

          {/* Info fields */}
          <div className="bg-white px-6 py-5">
            <div className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-slate-200 pb-2.5">
                <span className="pf-mono text-[10px] tracking-[0.12em] text-[#64748B] uppercase">
                  Full name
                </span>
                <span className="text-sm font-medium text-[#0F172A]">
                  {user.name}
                </span>
              </div>

              <div className="flex items-baseline justify-between border-b border-slate-200 pb-2.5">
                <span className="pf-mono text-[10px] tracking-[0.12em] text-[#64748B] uppercase">
                  Email
                </span>
                <span className="text-sm font-medium text-[#0F172A] truncate ml-4">
                  {user.email}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="pf-mono text-[10px] tracking-[0.12em] text-[#64748B] uppercase">
                  Phone
                </span>
                <span className="text-sm font-medium text-[#0F172A]">
                  {user.phone || "Not added"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 mt-6">
          <button
            onClick={() => navigate("/edit-profile")}
            className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold py-3 rounded-xl transition"
          >
            <FaPen className="text-xs" />
            Edit profile
          </button>

          <button
            onClick={() => navigate("/forgot-password")}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-[#0F172A] text-sm font-semibold py-3 rounded-xl transition"
          >
            <FaKey className="text-xs" />
            Change password
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-[#DC2626] hover:bg-red-50 text-sm font-semibold py-3 rounded-xl transition"
          >
            <FaSignOutAlt className="text-xs" />
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;