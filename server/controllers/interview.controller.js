import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

import { askAi } from "../services/openRouter.service.js";

import Interview from "../models/interview.model.js";
import User from "../models/user.model.js";

/* =========================================================
   ANALYZE RESUME
========================================================= */

export const analyzeResume = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        message: "Resume required",
      });
    }

    // FILE PATH
    const filepath = req.file.path;

    // READ PDF
    const fileBuffer = await fs.promises.readFile(filepath);

    const uint8Array = new Uint8Array(fileBuffer);

    // LOAD PDF
    const pdf = await pdfjsLib.getDocument({
      data: uint8Array,
    }).promise;

    let resumeText = "";

    // EXTRACT TEXT
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {

      const page = await pdf.getPage(pageNum);

      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) => item.str)
        .join(" ");

      resumeText += pageText + "\n";
    }

    // CLEAN TEXT
    resumeText = resumeText
      .replace(/\s+/g, " ")
      .trim();

    // AI PROMPT
    const messages = [

      {
        role: "system",

        content: `
Extract structured data from resume.

Return ONLY valid JSON.

{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}
`,
      },

      {
        role: "user",
        content: resumeText,
      },
    ];

  // AI RESPONSE
const aiResponse = await askAi(messages);

console.log("RAW AI RESPONSE:", aiResponse);

if (!aiResponse) {

  return res.status(500).json({
    message: "Empty AI response",
  });
}

let cleanedResponse = aiResponse
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

let parsed;

try {

  parsed = JSON.parse(cleanedResponse);

} catch (parseError) {

  console.log("JSON PARSE ERROR:", parseError);

  return res.status(500).json({
    message: "AI returned invalid JSON",
    raw: aiResponse,
  });
}

// DELETE FILE
if (fs.existsSync(filepath)) {
  fs.unlinkSync(filepath);
}

// SEND RESPONSE
return res.json({

  role: parsed.role || "",

  experience: parsed.experience || "",

  projects: Array.isArray(parsed.projects)
    ? parsed.projects
    : [],

  skills: Array.isArray(parsed.skills)
    ? parsed.skills
    : [],

  resumeText,

});

  } catch (error) {

    console.error("Resume Analysis Error:", error);

    // DELETE FILE IF ERROR
    if (req.file && fs.existsSync(req.file.path)) {

      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================================
   GENERATE QUESTIONS
========================================================= */

export const generateQuestion = async (req, res) => {
console.log("REQ USER ID:", req.userId);
  try {

    let {
      role,
      experience,
      mode,
      resumeText,
      projects,
      skills,
    } = req.body;

    /* ---------------- VALIDATION ---------------- */

    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();

    if (!role || !experience || !mode) {

      return res.status(400).json({
        success: false,
        message: "Role, Experience and Mode are required.",
      });
    }

    console.log("BODY DATA:", req.body);

    /* ---------------- USER CHECK ---------------- */

    const user = await User.findById(req.userId);

    console.log("USER:", user);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /* ---------------- CREDIT CHECK ---------------- */

    // if (user.credits < 50) {

    //   return res.status(400).json({
    //     success: false,
    //     message: "Not enough credits. Minimum 50 credits required.",
    //   });
    // }

    /* ---------------- SAFE DATA ---------------- */

    const projectText =
      Array.isArray(projects) && projects.length
        ? projects.join(", ")
        : "No Projects";

    const skillsText =
      Array.isArray(skills) && skills.length
        ? skills.join(", ")
        : "No Skills";

    const safeResume =
      typeof resumeText === "string" && resumeText.trim()
        ? resumeText.trim()
        : "No Resume";

    /* ---------------- AI PROMPT ---------------- */

    const userPrompt = `
Role: ${role}

Experience: ${experience}

Interview Mode: ${mode}

Projects: ${projectText}

Skills: ${skillsText}

Resume Details:
${safeResume}
`;

    const messages = [

      {
        role: "system",

        content: `
You are a professional technical interviewer.

Generate EXACTLY 5 interview questions.

IMPORTANT RULES:

- Return ONLY plain questions.
- Do NOT number questions.
- Do NOT use bullets.
- Do NOT add explanations.
- One question per line.
- Questions must sound natural and conversational.
- Questions should be based on the candidate profile.

Difficulty:
1 easy
2 easy
3 medium
4 medium
5 hard
`,
      },

      {
        role: "user",
        content: userPrompt,
      },
    ];

    console.log("SENDING TO AI...");

    /* ---------------- AI CALL ---------------- */

    const aiResponse = await askAi(messages);
    

    console.log("AI RESPONSE:", aiResponse);

    if (!aiResponse || typeof aiResponse !== "string") {

      return res.status(500).json({
        success: false,
        message: "Invalid AI response.",
      });
    }

    /* ---------------- CLEAN QUESTIONS ---------------- */

    let questionsArray = aiResponse
      .split("\n")
      .map((q) =>
        q
          .replace(/^\d+\./, "")
          .replace(/^-/, "")
          .trim()
      )
      .filter((q) => q.length > 10);

    /* ---------------- ENSURE 5 QUESTIONS ---------------- */

    questionsArray = questionsArray.slice(0, 5);

    if (questionsArray.length < 5) {

      return res.status(500).json({
        success: false,
        message: "AI failed to generate enough questions.",
      });
    }

    console.log("FINAL QUESTIONS:", questionsArray);

    /* ---------------- CREATE INTERVIEW ---------------- */

    const interview = await Interview.create({

      userId: user._id,

      role,

      experience,

      mode,

      resumeText: safeResume,

      questions: questionsArray.map((q, index) => ({

        question: q,

        difficulty: [
          "easy",
          "easy",
          "medium",
          "medium",
          "hard",
        ][index],

        timeLimit: [
          60,
          60,
          90,
          90,
          120,
        ][index],
      })),
    });

    /* ---------------- DEDUCT CREDITS ---------------- */

    user.credits -= 50;

    await user.save();

    /* ---------------- SUCCESS RESPONSE ---------------- */

    return res.status(200).json({

      success: true,

      interviewId: interview._id,

      creditsLeft: user.credits,

      userName: user.name,

      questions: interview.questions,
    });

  } catch (error) {

    console.log("GENERATE QUESTION ERROR:", error);

    return res.status(500).json({

      success: false,

      message: error.message || "Server Error",
    });
  }
};


/* =========================================================
   SUBMIT ANSWER
========================================================= */

export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body;

    /* ---------------- SAFE INPUT CHECK ---------------- */
    if (!interviewId || questionIndex === undefined) {
      return res.status(400).json({
        message: "Missing interviewId or questionIndex",
      });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    const question = interview?.questions?.[questionIndex];

    if (!question) {
      return res.status(400).json({
        message: "Invalid question index",
      });
    }

    /* ---------------- EMPTY ANSWER ---------------- */
    if (!answer || !answer.trim()) {
      question.score = 0;
      question.feedback = "You did not submit an answer.";
      question.answer = "";

      await interview.save();

      return res.status(200).json({
        feedback: question.feedback,
        score: 0,
      });
    }

    /* ---------------- TIME LIMIT CHECK ---------------- */
    const safeTimeLimit = question.timeLimit || 60;

    if (timeTaken > safeTimeLimit) {
      question.score = 0;
      question.feedback = "Time limit exceeded. Answer not evaluated.";
      question.answer = answer;

      await interview.save();

      return res.status(200).json({
        feedback: question.feedback,
        score: 0,
      });
    }

    /* ---------------- SAFE AI PROMPT ---------------- */
    const messages = [
      {
        role: "system",
        content: `
You are a professional human interviewer evaluating a candidate's answer.

Score (0–10):
1. Confidence
2. Communication
3. Correctness

Rules:
- Be realistic and strict.
- No random high scores.
- Keep feedback 10–15 words.

Return ONLY valid JSON:
{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short feedback"
}
        `,
      },
      {
        role: "user",
        content: `
Question: ${question.question || "N/A"}

Answer: ${answer || "N/A"}
        `,
      },
    ];

    /* ---------------- AI CALL SAFETY ---------------- */
    let aiResponse;

    try {
      aiResponse = await askAi(messages);
    } catch (err) {
      console.error("AI CALL FAILED:", err);
      return res.status(500).json({
        message: "AI service failed",
      });
    }

    if (!aiResponse || typeof aiResponse !== "string") {
      return res.status(500).json({
        message: "Invalid AI response",
      });
    }

    /* ---------------- CLEAN AI OUTPUT ---------------- */
    let cleaned = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("AI JSON PARSE ERROR:", aiResponse);

      return res.status(500).json({
        message: "AI returned invalid JSON",
        raw: aiResponse,
      });
    }

    /* ---------------- SAVE DATA ---------------- */
    question.answer = answer;
    question.confidence = parsed.confidence || 0;
    question.communication = parsed.communication || 0;
    question.correctness = parsed.correctness || 0;
    question.score = parsed.finalScore || 0;
    question.feedback = parsed.feedback || "";

    await interview.save();

    /* ---------------- RESPONSE ---------------- */
    return res.status(200).json({
      feedback: question.feedback,
      score: question.score,
      confidence: question.confidence,
      communication: question.communication,
      correctness: question.correctness,
    });
  } catch (error) {
    console.error("❌ SUBMIT ANSWER ERROR:", error);

    return res.status(500).json({
      message: `Failed to submit answer: ${error.message}`,
    });
  }
};

/* =========================================================
   FINISH INTERVIEW
========================================================= */

export const finishInterview = async (req, res) => {

  try {

    const { interviewId } = req.body;

    const interview =
      await Interview.findById(interviewId);

    if (!interview) {

      return res.status(404).json({
        message: "Failed to find interview",
      });
    }

    const totalQuestions =
      interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {

      totalScore += q.score || 0;

      totalConfidence += q.confidence || 0;

      totalCommunication += q.communication || 0;

      totalCorrectness += q.correctness || 0;
    });

    const finalScore =
      totalQuestions
        ? totalScore / totalQuestions
        : 0;

    const avgConfidence =
      totalQuestions
        ? totalConfidence / totalQuestions
        : 0;

    const avgCommunication =
      totalQuestions
        ? totalCommunication / totalQuestions
        : 0;

    const avgCorrectness =
      totalQuestions
        ? totalCorrectness / totalQuestions
        : 0;

    interview.finalScore = finalScore;

    interview.status = "completed";

    await interview.save();

    return res.status(200).json({

      finalScore: Number(
        finalScore.toFixed(1)
      ),

      confidence: Number(
        avgConfidence.toFixed(1)
      ),

      communication: Number(
        avgCommunication.toFixed(1)
      ),

      correctness: Number(
        avgCorrectness.toFixed(1)
      ),

      questionWiseScore:
        interview.questions.map((q) => ({

          question: q.question,

          score: q.score || 0,

          feedback: q.feedback || "",

          confidence: q.confidence || 0,

          communication:
            q.communication || 0,

          correctness:
            q.correctness || 0,

        })),
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyInterviews = async (req,res) => {
    try {
        const interviews = await Interview.find({userId:req.userId})
        .sort({ createdAt: -1 })
        .select("role experience mode finalScore status createdAt");

        return res.status(200).json(interviews)

    } catch (error) {
        return res.status(500).json({message:`failed to find currentUser Interview ${error}`})
    }
}


export const getInterviewReport = async (req,res) => {
    try {
        const interview = await Interview.findById(req.params.id)

        if (!interview) {
            return res.status(404).json({ message: "Interview not found" })
        }
        const totalQuestions = interview.questions.length;

        let totalConfidence = 0;
        let totalCommunication = 0;
        let totalCorrectness = 0;

        interview.questions.forEach((q) => {
            totalConfidence += q.confidence || 0;
            totalCommunication += q.communication || 0;
            totalCorrectness += q.correctness || 0;
        });

        const avgConfidence = totalQuestions
        ? totalConfidence / totalQuestions
        : 0;

        const avgCommunication = totalQuestions
        ? totalCommunication / totalQuestions
        : 0;

        const avgCorrectness = totalQuestions
        ? totalCorrectness / totalQuestions
        : 0;
        return res.json({
            finalScore: interview.finalScore,
            confidence: Number(avgConfidence.toFixed(1)),
            communication: Number(avgCommunication.toFixed(1)),
            correctness: Number(avgCorrectness.toFixed(1)),
            questionWiseScore: interview.questions
        });

    } catch (error) {
        return res.status(500).json({message:`failed to find currentUser Interview ${error}`})
    }
}