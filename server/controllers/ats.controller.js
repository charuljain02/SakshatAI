import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

import { askAi } from "../services/openRouter.service.js";

/* =========================================================
   HELPER: EXTRACT TEXT FROM PDF
========================================================= */

const extractResumeText = async (filepath) => {

  const fileBuffer = await fs.promises.readFile(filepath);

  const uint8Array = new Uint8Array(fileBuffer);

  const pdf = await pdfjsLib.getDocument({
    data: uint8Array,
  }).promise;

  let resumeText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {

    const page = await pdf.getPage(pageNum);

    const content = await page.getTextContent();

    const pageText = content.items
      .map((item) => item.str)
      .join(" ");

    resumeText += pageText + "\n";
  }

  resumeText = resumeText
    .replace(/\s+/g, " ")
    .trim();

  return resumeText;
};

/* =========================================================
   CHECK ATS SCORE
========================================================= */

export const checkAtsScore = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: "Resume required",
      });
    }

    const { jobDescription } = req.body;

    if (!jobDescription || !jobDescription.trim()) {

      // DELETE FILE
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        success: false,
        message: "Job description required",
      });
    }

    const filepath = req.file.path;

    // EXTRACT TEXT
    const resumeText = await extractResumeText(filepath);

    // DELETE FILE (no longer needed once text is extracted)
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    if (!resumeText) {

      return res.status(400).json({
        success: false,
        message: "Could not extract text from resume. Try a different PDF.",
      });
    }

    // AI PROMPT
    const messages = [

      {
        role: "system",

        content: `
You are an Applicant Tracking System (ATS) simulation engine used by recruiters.

Compare the RESUME against the JOB DESCRIPTION exactly like a real ATS parser would.

Return ONLY valid JSON in this exact shape:

{
  "atsScore": 0,
  "verdict": "string (one short sentence)",
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "sectionScores": {
    "contactInfo": 0,
    "workExperience": 0,
    "skills": 0,
    "education": 0,
    "formatting": 0
  },
  "formattingIssues": ["issue1", "issue2"],
  "improvementSuggestions": ["suggestion1", "suggestion2"]
}

Rules:
- atsScore and sectionScores are 0-100 integers.
- Be realistic and strict, like a real ATS. Do not inflate scores.
- matchedKeywords / missingKeywords should come from real skills, tools, and requirements found in the job description.
- Keep improvementSuggestions concrete and actionable (max 6 items).
- Keep formattingIssues based on structural/formatting red flags common in real ATS parsing (tables, columns, images, missing sections, unusual headings). If none, return an empty array.
`,
      },

      {
        role: "user",

        content: `
JOB DESCRIPTION:
${jobDescription.trim()}

RESUME TEXT:
${resumeText}
`,
      },
    ];

    const aiResponse = await askAi(messages);

    if (!aiResponse) {

      return res.status(500).json({
        success: false,
        message: "Empty AI response",
      });
    }

    const cleaned = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let analysis;

    try {

      analysis = JSON.parse(cleaned);

    } catch (parseError) {

      console.log("ATS JSON PARSE ERROR:", parseError);

      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON",
        raw: aiResponse,
      });
    }

    return res.status(200).json({
      success: true,
      analysis,
    });

  } catch (error) {

    console.log("ATS SCORE ERROR:", error);

    // DELETE FILE IF ERROR
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
