import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getProfile } from "../api/auth";
import {
  FaHome,
  FaUpload,
  FaChartBar,
  FaHistory,
  FaUserCircle,
  FaKey,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const dropdownRef = useRef(null);

  const [userInfo, setUserInfo] = useState({
    name: localStorage.getItem("name") || "",
    email: localStorage.getItem("email") || "",
    profilePhoto: localStorage.getItem("profilePhoto") || "",
  });

  useEffect(() => {
    if (token) {
      getProfile()
        .then((data) => {
          if (data) {
            setUserInfo({
              name: data.name || "",
              email: data.email || "",
              profilePhoto: data.profilePhoto || "",
            });
            if (data.name) localStorage.setItem("name", data.name);
            if (data.email) localStorage.setItem("email", data.email);
            if (data.profilePhoto !== undefined) localStorage.setItem("profilePhoto", data.profilePhoto);
          }
        })
        .catch(() => {});
    }
  }, [token, location.pathname]);

  const userName = userInfo.name || localStorage.getItem("name") || "";
  const userEmail = userInfo.email || localStorage.getItem("email") || "";
  const userPhoto = userInfo.profilePhoto || localStorage.getItem("profilePhoto") || "";

  // Close the profile dropdown when clicking outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpen(false);
  }, [location.pathname]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/", label: "Home", icon: FaHome },
    { to: "/upload", label: "Upload", icon: FaUpload },
    { to: "/dashboard", label: "Dashboard", icon: FaChartBar },
    { to: "/history", label: "History", icon: FaHistory },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-6">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-white tracking-tight flex items-center gap-2 shrink-0"
        >
          <span className="text-blue-400">📄</span>
          Resume Analyzer
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">

          {(token ? navLinks : [{ to: "/", label: "Home", icon: FaHome }]).map(
            (link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive(link.to)
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <link.icon className="text-xs" />
                {link.label}
              </Link>
            )
          )}

          {token ? (
            <div className="relative ml-3" ref={dropdownRef}>

              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full hover:bg-slate-800 transition focus:outline-none"
              >
                {userPhoto ? (
                  <img
                    src={userPhoto}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {userName?.charAt(0).toUpperCase()}
                  </div>
                )}
                <FaChevronDown
                  className={`text-[10px] text-slate-400 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">

                  <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                    {userPhoto ? (
                      <img
                        src={userPhoto}
                        alt="Profile"
                        className="w-11 h-11 rounded-full object-cover border-2 border-blue-100 shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                        {userName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {userName}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">
                        {userEmail}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full flex items-center gap-3 text-left px-5 py-3 text-sm text-slate-700 hover:bg-slate-50 transition"
                  >
                    <FaUserCircle className="text-blue-600" />
                    My profile
                  </button>

                  <button
                    onClick={() => navigate("/forgot-password")}
                    className="w-full flex items-center gap-3 text-left px-5 py-3 text-sm text-slate-700 hover:bg-slate-50 transition"
                  >
                    <FaKey className="text-blue-600" />
                    Change password
                  </button>

                  <hr className="border-slate-100" />

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>

                </div>
              )}

            </div>
          ) : (
            <div className="flex items-center gap-3 ml-3">
              <Link
                to="/login"
                className="text-slate-300 hover:text-white text-sm font-medium transition px-3 py-2"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white text-xl"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>

      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-6 py-4 space-y-1">

          {token && (
            <div className="flex items-center gap-3 pb-3 mb-2 border-b border-slate-800">
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {userName?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">{userName}</p>
                <p className="text-slate-400 text-xs truncate">{userEmail}</p>
              </div>
            </div>
          )}

          {(token ? navLinks : [{ to: "/", label: "Home", icon: FaHome }]).map(
            (link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive(link.to)
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <link.icon className="text-sm" />
                {link.label}
              </Link>
            )
          )}

          {token ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
              >
                <FaUserCircle className="text-sm" />
                My profile
              </Link>
              <Link
                to="/forgot-password"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
              >
                <FaKey className="text-sm" />
                Change password
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/40 transition"
              >
                <FaSignOutAlt className="text-sm" />
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/login"
                className="text-center text-slate-300 hover:text-white text-sm font-medium py-2.5 rounded-lg hover:bg-slate-800/60 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold transition"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;