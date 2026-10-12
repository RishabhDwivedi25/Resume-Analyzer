import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import generateReport from "../utils/generateReport";

import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaBriefcase,
  FaFileAlt,
  FaPenFancy,
} from "react-icons/fa";

function ResumeDetails() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const response = await API.get(`/resumes/${id}`);
      setResume(response.data.resume);
    } catch (error) {
      console.log(error);
    }
  };

  if (!resume) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-8">

          <h1 className="text-3xl font-bold text-center">
            Resume Analysis
          </h1>

          <p className="text-center text-gray-500 mt-2">
            {resume.fileName}
          </p>

          {/* ATS Score */}
          <div className="w-48 mx-auto mt-8">

            <CircularProgressbar
              value={resume.atsScore}
              text={`${resume.atsScore}`}
              styles={buildStyles({
                textSize: "18px",
                pathColor: "#2563eb",
                textColor: "#2563eb",
                trailColor: "#e5e7eb",
              })}
            />

          </div>

          <p className="text-center text-xl font-semibold mt-4">
            ATS Score
          </p>

          <div className="flex justify-center mt-4">

            {resume.atsScore >= 85 ? (
              <span className="bg-green-100 text-green-700 px-5 py-2 rounded-full font-semibold">
                Excellent Resume
              </span>
            ) : resume.atsScore >= 70 ? (
              <span className="bg-yellow-100 text-yellow-700 px-5 py-2 rounded-full font-semibold">
                Good Resume
              </span>
            ) : (
              <span className="bg-red-100 text-red-700 px-5 py-2 rounded-full font-semibold">
                Needs Improvement
              </span>
            )}

          </div>

        </div>

        {/* Summary */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <h2 className="text-2xl font-bold flex items-center gap-3">

            <FaFileAlt className="text-blue-600" />

            Summary

          </h2>

          <p className="mt-4 text-gray-700 leading-8">
            {resume.summary}
          </p>

        </div>

        {/* Strengths + Missing Skills */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">

          {/* Strengths */}

          <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-2xl font-bold text-green-700 mb-6">
              ✅ Strengths
            </h2>

            <ul className="space-y-4">

              {resume.strengths.map((item, index) => (

                <li
                  key={index}
                  className="flex items-start gap-3"
                >
                  <FaCheckCircle className="text-green-600 mt-1" />

                  <span>{item}</span>

                </li>

              ))}

            </ul>

          </div>

          {/* Missing Skills */}

          <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-2xl font-bold text-yellow-600 mb-6">
              ⚠ Missing Skills
            </h2>

            <ul className="space-y-4">

              {resume.missingSkills.map((item, index) => (

                <li
                  key={index}
                  className="flex items-start gap-3"
                >
                  <FaExclamationTriangle className="text-yellow-500 mt-1" />

                  <span>{item}</span>

                </li>

              ))}

            </ul>

          </div>

        </div>

        {/* Grammar */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">

            <FaPenFancy className="text-blue-600" />

            Grammar Suggestions

          </h2>

          <ul className="space-y-4">

            {resume.grammarSuggestions.map((item, index) => (

              <li
                key={index}
                className="bg-blue-50 rounded-xl p-4"
              >
                {item}
              </li>

            ))}

          </ul>

        </div>

        {/* Recommended Roles */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">

            <FaBriefcase className="text-blue-600" />

            Recommended Roles

          </h2>

          <div className="flex flex-wrap gap-4">

            {resume.recommendedRoles.map((item, index) => (

              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-5 py-3 rounded-full font-semibold"
              >
                {item}
              </span>

            ))}
        
         </div>
         <button
          onClick={() => generateReport(resume)}
          className="mt-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          📄 Download PDF Report
        </button>

        </div>

      </div>
    </div>
  );
}

export default ResumeDetails;