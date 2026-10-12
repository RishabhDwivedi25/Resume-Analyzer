import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt, FaFilePdf, FaTimes, FaShieldAlt } from "react-icons/fa";
import { uploadResume } from "../api/resume";
import toast from "react-hot-toast";

function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const navigate = useNavigate();

  // Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];

    if (!droppedFile) return;

    if (droppedFile.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }

    setFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  // Upload Resume
  const handleUpload = async () => {
    if (!file) {
      toast("Please select a PDF resume.");
      return;
    }

    try {
      setLoading(true);

      const data = await uploadResume(file);

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return "";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center items-center p-6">
      <div className="w-full max-w-2xl">

        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <FaShieldAlt className="text-indigo-600" />
            Your resume stays private
          </span>
          <h1 className="text-4xl font-bold text-slate-900">
            Upload Your Resume
          </h1>
          <p className="text-slate-500 mt-3">
            Drop a PDF below and get your ATS score in seconds.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10">

          {!file ? (
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
                dragActive
                  ? "border-indigo-500 bg-indigo-50 scale-[1.01]"
                  : "border-slate-300 hover:border-indigo-300 hover:bg-slate-50"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div
                className={`w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-6 transition-transform duration-200 ${
                  dragActive ? "scale-110" : ""
                }`}
              >
                <FaCloudUploadAlt className="text-4xl text-indigo-600" />
              </div>

              <h2 className="text-xl font-semibold text-slate-900">
                {dragActive ? "Drop it right here" : "Drag & drop your resume"}
              </h2>

              <p className="text-slate-500 mt-2 mb-6 text-sm">
                or click below to browse your computer · PDF only
              </p>

              <label className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition">
                Browse Files
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];

                    if (
                      selectedFile &&
                      selectedFile.type !== "application/pdf"
                    ) {
                      toast.error("Please upload a PDF file.");
                      return;
                    }

                    setFile(selectedFile);
                  }}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="border-2 border-indigo-100 bg-indigo-50/50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4">
                <FaFilePdf className="text-3xl text-red-500" />
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="text-left">
                  <p className="font-semibold text-slate-900 max-w-xs truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {formatSize(file.size)} · Ready to analyze
                  </p>
                </div>
                {!loading && (
                  <button
                    onClick={() => setFile(null)}
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition shrink-0"
                    aria-label="Remove file"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl text-lg font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
          >
            {loading ? (
              <div className="flex justify-center items-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Resume...</span>
              </div>
            ) : (
              "Analyze Resume"
            )}
          </button>

          <p className="text-center text-xs text-slate-400 mt-4">
            We only use your resume to generate this analysis — nothing is shared.
          </p>

        </div>
      </div>
    </div>
  );
}

export default Upload;