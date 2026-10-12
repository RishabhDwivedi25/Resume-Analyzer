import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generateReport = (resume) => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("Resume Analysis Report", 14, 20);

  doc.setFontSize(14);
  doc.text(`File Name: ${resume.fileName}`, 14, 35);
  doc.text(`ATS Score: ${resume.atsScore}/100`, 14, 45);

  doc.setFontSize(16);
  doc.text("Summary", 14, 60);

  doc.setFontSize(12);
  doc.text(resume.summary || "No summary available", 14, 70, {
    maxWidth: 180,
  });

  let y = 95;

  autoTable(doc, {
    startY: y,
    head: [["Strengths"]],
    body: resume.strengths.map((item) => [item]),
  });

  y = doc.lastAutoTable.finalY + 10;

  autoTable(doc, {
    startY: y,
    head: [["Missing Skills"]],
    body: resume.missingSkills.map((item) => [item]),
  });

  y = doc.lastAutoTable.finalY + 10;

  autoTable(doc, {
    startY: y,
    head: [["Grammar Suggestions"]],
    body: resume.grammarSuggestions.map((item) => [item]),
  });

  y = doc.lastAutoTable.finalY + 10;

  autoTable(doc, {
    startY: y,
    head: [["Recommended Roles"]],
    body: resume.recommendedRoles.map((item) => [item]),
  });

  doc.save("Resume_Analysis_Report.pdf");
};

export default generateReport;