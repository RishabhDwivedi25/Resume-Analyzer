import API from "./api";

// Signup
export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

// Login
export const loginUser = async (userData) => {
  const response = await API.post("/auth/login", userData);
  return response.data;
};

// Google Login / Signup
export const googleLogin = async (credential) => {
  const response = await API.post("/auth/google", { credential });
  return response.data;
};

// Forgot Password
export const forgotPassword = async (email) => {
  const response = await API.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

// Reset Password
export const resetPassword = async (email, password) => {
  const response = await API.post("/auth/reset-password", {
    email,
    password,
  });

  return response.data;
};

// Resend OTP
export const resendOTP = async (email) => {
  const response = await API.post("/auth/resend-otp", {
    email,
  });

  return response.data;
};

// Get Profile
export const getProfile = async () => {
  const response = await API.get("/profile");
  return response.data;
};

// Update Profile
export const updateProfile = async (data) => {
  const response = await API.put("/profile", data);
  return response.data;
};

// Upload Photo
export const uploadPhoto = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await API.put("/profile/photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Remove Photo
export const removePhoto = async () => {
  const response = await API.delete("/profile/photo");
  return response.data;
};