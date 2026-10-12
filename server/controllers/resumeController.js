const Resume = require("../models/Resume");
const { extractPDFText } = require("../services/pdfService");
const { analyzeResume } = require("../services/ai-service");

// ================= Upload Resume =================

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No resume uploaded",
      });
    }

    const text = await extractPDFText(req.file.path);

    const analysis = await analyzeResume(text);
    console.log("req.user:", req.user);

    const resume = new Resume({
      user: req.user.id,

      fileName: req.file.originalname,
      extractedText: text,

      atsScore: analysis.atsScore,
      summary: analysis.summary,
      strengths: analysis.strengths,
      missingSkills: analysis.missingSkills,
      grammarSuggestions: analysis.grammarSuggestions,
      recommendedRoles: analysis.recommendedRoles,
    });

    await resume.save();

    res.status(200).json({
      success: true,
      message: "Resume analyzed and saved successfully",
      resume,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Get My Resumes =================

exports.getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      resumes,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ================= Get One Resume =================

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Delete Resume =================

exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};