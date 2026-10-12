const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
},

    fileName: {
      type: String,
      required: true,
    },

    extractedText: {
      type: String,
      required: true,
    },

    atsScore: Number,

    summary: String,

    strengths: [String],

    missingSkills: [String],

    grammarSuggestions: [String],

    recommendedRoles: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);