import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyResetOTP from "./pages/VerifyResetOTP";
import ResetPassword from "./pages/ResetPassword";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import ResumeDetails from "./pages/ResumeDetails";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />

        <div className="content">
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/resume/:id" element={<ResumeDetails />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route
              path="/edit-profile"
              element={<EditProfile />}
            />
            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />
            <Route
              path="/verify-reset-otp"
              element={<VerifyResetOTP />}
            />
            <Route
              path="/reset-password"
              element={<ResetPassword />}
            />
            </Routes>
             
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;