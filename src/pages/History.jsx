import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { deleteResume } from "../api/resume";
import toast from "react-hot-toast";

import {
  FaFilePdf,
  FaEye,
  FaTrash,
  FaCalendarAlt,
  FaSearch,
  FaStar,
  FaUpload,
} from "react-icons/fa";

function History() {
  const [resumes, setResumes] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await API.get("/resumes/my");
      setResumes(response.data.resumes);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmDelete) return;

    try {
      await deleteResume(id);
      fetchResumes();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete resume.");
    }
  };

  const getBadgeStyle = (score) => {
    if (score >= 80) return "bg-green-100 text-green-700 ring-1 ring-green-600/20";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20";
    return "bg-red-100 text-red-700 ring-1 ring-red-600/20";
  };

  const getBarColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Derived stats
  const stats = useMemo(() => {
    if (resumes.length === 0) return null;
    const scores = resumes.map((r) => r.atsScore);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const best = Math.max(...scores);
    return { total: resumes.length, avg, best };
  }, [resumes]);

  const bestId = useMemo(() => {
    if (resumes.length === 0) return null;
    return resumes.reduce((a, b) => (a.atsScore >= b.atsScore ? a : b))._id;
  }, [resumes]);

  // Filtered + sorted list
  const visibleResumes = useMemo(() => {
    let list = resumes.filter((r) =>
      r.fileName.toLowerCase().includes(query.toLowerCase())
    );
    if (sortBy === "recent") {
      list = [...list].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortBy === "score") {
      list = [...list].sort((a, b) => b.atsScore - a.atsScore);
    } else if (sortBy === "name") {
      list = [...list].sort((a, b) => a.fileName.localeCompare(b.fileName));
    }
    return list;
  }, [resumes, query, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              My Resume History
            </h1>
            <p className="text-slate-500 mt-2">
              Every version you've analyzed, in one place.
            </p>
          </div>
          <button
            onClick={() => navigate("/upload")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition"
          >
            <FaUpload className="text-xs" />
            Upload New
          </button>
        </div>

        {resumes.length === 0 ? (

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
            <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center mx-auto mb-5">
              <FaFilePdf className="text-3xl text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">
              No Resume Uploaded
            </h2>
            <p className="text-slate-500 mt-3 mb-6">
              Upload your first resume to start analyzing it.
            </p>
            <button
              onClick={() => navigate("/upload")}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition"
            >
              <FaUpload className="text-xs" />
              Upload Resume
            </button>
          </div>

        ) : (

          <>
            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-6 py-5">
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-sm text-slate-500 mt-1">Resumes analyzed</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-6 py-5">
                <p className="text-2xl font-bold text-slate-900">{stats.avg}</p>
                <p className="text-sm text-slate-500 mt-1">Average ATS score</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-6 py-5">
                <p className="text-2xl font-bold text-indigo-600">{stats.best}</p>
                <p className="text-sm text-slate-500 mt-1">Best score</p>
              </div>
            </div>

            {/* Search + sort */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="relative flex-1 min-w-[220px]">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by file name..."
                  className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="recent">Sort: Most recent</option>
                <option value="score">Sort: Highest score</option>
                <option value="name">Sort: File name</option>
              </select>
            </div>

            {visibleResumes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center text-slate-500">
                No resumes match "{query}".
              </div>
            ) : (
              <div className="space-y-5">
                {visibleResumes.map((resume) => (
                  <div
                    key={resume._id}
                    className="relative bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-100 transition-all duration-200 p-8"
                  >
                    {resume._id === bestId && (
                      <span className="absolute -top-3 left-8 flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                        <FaStar className="text-[10px]" />
                        Best score
                      </span>
                    )}

                    {/* Top Section */}
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                            <FaFilePdf className="text-red-500 text-xl" />
                          </div>
                          <h2 className="text-xl font-bold text-slate-900">
                            {resume.fileName}
                          </h2>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm mt-3 ml-14">
                          <FaCalendarAlt className="text-slate-400" />
                          {resume.createdAt &&
                            new Date(resume.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`${getBadgeStyle(
                            resume.atsScore
                          )} px-4 py-1.5 rounded-full font-semibold text-sm`}
                        >
                          ATS {resume.atsScore}/100
                        </span>
                        <div className="w-28 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full ${getBarColor(resume.atsScore)} transition-all duration-700`}
                            style={{ width: `${resume.atsScore}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="mt-6 md:pl-14">
                      <h3 className="font-semibold text-slate-800 mb-2 text-sm uppercase tracking-wide">
                        Summary
                      </h3>
                      <p className="text-slate-600 leading-7 text-sm">
                        {resume.summary.length > 180
                          ? resume.summary.substring(0, 180) + "..."
                          : resume.summary}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-3 mt-8 md:pl-14">
                      <button
                        onClick={() => navigate(`/resume/${resume._id}`)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition"
                      >
                        <FaEye />
                        View Details
                      </button>
                      <button
                        onClick={() => handleDelete(resume._id)}
                        className="flex items-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 px-5 py-2.5 rounded-lg font-semibold text-sm transition"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default History;