const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function analyzeResume(resumeText) {
const prompt = `
You are a strict ATS (Applicant Tracking System) resume analyzer used by top tech companies. You must be a harsh, objective grader — most resumes you see are mediocre, and your scores should reflect that. Do not be generous.

Score the resume using this exact rubric. For each category, assign points based on the criteria, then sum them for the final atsScore. Do not skip this step — you must reason through each category before outputting the total.

1. SKILLS (0-30 points)
   - 0-10: Few or no relevant skills listed, generic buzzwords only
   - 11-20: Some relevant skills, but missing key skills for the target role, or skills not backed by evidence in experience/projects
   - 21-30: Strong, specific, role-relevant skills that are clearly demonstrated elsewhere in the resume

2. PROJECTS (0-20 points)
   - 0-7: No projects, or projects with no measurable outcomes/impact
   - 8-14: Some projects, vague descriptions, no metrics or results
   - 15-20: Well-described projects with clear scope, technologies, and measurable outcomes

3. EXPERIENCE (0-20 points)
   - 0-7: Little/no relevant experience, or descriptions are just duty lists ("responsible for...")
   - 8-14: Relevant experience but weak impact — few numbers, results, or achievements
   - 15-20: Relevant experience with quantified achievements (%, $, time saved, scale, etc.)

4. EDUCATION (0-10 points)
   - 0-4: Missing, incomplete, or irrelevant to target roles
   - 5-7: Present but generic
   - 8-10: Relevant, well-presented, includes relevant coursework/honors if applicable

5. FORMATTING & ATS READABILITY (0-10 points)
   - 0-3: Poor structure, inconsistent formatting, likely to break ATS parsing (tables, columns, graphics, unusual fonts)
   - 4-7: Readable but inconsistent (uneven spacing, unclear section headers, inconsistent dates)
   - 8-10: Clean, standard sections, consistent formatting, ATS-parseable

6. GRAMMAR & WRITING QUALITY (0-10 points)
   - 0-3: Frequent grammar/spelling errors, inconsistent tense, unclear sentences
   - 4-7: Minor errors or awkward phrasing
   - 8-10: Clean, professional, consistent grammar and tense throughout

Rules:
- Be specific and critical. If information is missing or vague, score it low — do not assume competence that isn't demonstrated in the text.
- atsScore = sum of all six category scores (0-100 total). Do not adjust it afterward or apply a minimum floor.
- Return ONLY valid JSON, no markdown, no code fences.

Return JSON in this exact format:

{
  "atsScore": 0,
  "categoryScores": {
    "skills": 0,
    "projects": 0,
    "experience": 0,
    "education": 0,
    "formatting": 0,
    "grammar": 0
  },
  "summary": "",
  "strengths": [],
  "missingSkills": [],
  "grammarSuggestions": [],
  "recommendedRoles": []
}

Resume:
${resumeText}
`;
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
  });

  // AI Response
  const rawResponse = response.choices[0].message.content;

  // Remove markdown code blocks if present
  const cleanedResponse = rawResponse
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    const result = JSON.parse(cleanedResponse);

    // Ensure ATS score is a number between 0 and 100
    result.atsScore = Math.max(
      0,
      Math.min(100, Number(result.atsScore) || 0)
    );

return result;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return {
      atsScore: 0,
      summary: "Unable to analyze resume.",
      strengths: [],
      missingSkills: [],
      grammarSuggestions: [],
      recommendedRoles: [],
      rawResponse: cleanedResponse,
    };
  }
}

module.exports = {
  analyzeResume,
};