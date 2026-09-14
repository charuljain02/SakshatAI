import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  BsFileEarmarkText,
  BsArrowRight,
  BsCheckCircleFill,
  BsXCircleFill,
  BsExclamationTriangleFill,
  BsUpload,
  BsAward,
} from 'react-icons/bs';
import { HiSparkles } from 'react-icons/hi';

function AtsScoreChecker() {

  const ServerUrl = "https://sakshatai.onrender.com";

  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF resume.");
      return;
    }

    setError('');
    setResumeFile(file);
  };

  const handleCheck = async (e) => {
    e.preventDefault();

    if (!resumeFile || !jobDescription.trim()) return;

    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription.trim());

    try {

      const res = await axios.post(
        `${ServerUrl}/api/ats/check`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(res.data.analysis);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Something went wrong while checking your resume."
      );

    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score) => {
    if (score >= 75) return "text-green-400";
    if (score >= 50) return "text-amber-400";
    return "text-red-400";
  };

  const scoreBarColor = (score) => {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  const reset = () => {
    setResult(null);
    setResumeFile(null);
    setJobDescription('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col font-sans selection:bg-green-200">
      <Navbar />

      <div className="flex-1 px-6 py-12 max-w-7xl mx-auto w-full flex flex-col items-center justify-center">

        <AnimatePresence mode="wait">
          {!result ? (

            /* --- INPUT STAGE --- */
            <motion.div
              key="input-stage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl text-center"
            >
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 shadow-sm">
                <HiSparkles size={14} />
                <span>AI ATS SCORE ENGINE</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                Check Your <span className="text-green-600">ATS</span> Score
              </h1>

              <p className="text-gray-500 mb-10 text-base md:text-lg max-w-md mx-auto leading-relaxed">
                Upload your resume and paste a job description. Our AI will score
                your match, surface missing keywords, and flag formatting issues
                before recruiters ever see it.
              </p>

              <form
                onSubmit={handleCheck}
                className="bg-white p-6 rounded-3xl border-2 border-green-100 shadow-xl flex flex-col gap-4 text-left"
              >
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                    Resume (PDF)
                  </label>

                  <label
                    htmlFor="ats-resume-upload"
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 cursor-pointer hover:border-green-300 transition"
                  >
                    <BsUpload size={18} className="text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-600 font-medium truncate">
                      {resumeFile ? resumeFile.name : "Click to upload your resume PDF"}
                    </span>
                  </label>

                  <input
                    id="ats-resume-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                    Job Description
                  </label>

                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    disabled={loading}
                    rows={6}
                    placeholder="Paste the full job description here..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-300 resize-none"
                  />
                </div>

                {error && (
                  <p className="text-xs font-semibold text-red-500 px-1">{error}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={loading || !resumeFile || !jobDescription.trim()}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-black hover:bg-neutral-800 disabled:bg-gray-300 text-white font-medium px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition shadow-md"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Scanning Resume...</span>
                    </div>
                  ) : (
                    <>
                      <span>Check ATS Score</span>
                      <BsArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

          ) : (

            /* --- RESULTS STAGE --- */
            <motion.div
              key="report-stage"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
            >
              {/* Left Column: Score Gauge */}
              <div className="bg-gradient-to-br from-black to-neutral-900 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="bg-white/10 text-white/90 text-[10px] tracking-widest font-bold px-2.5 py-1 rounded-md inline-block uppercase mb-4">
                    ATS MATCH SCORE
                  </div>
                  <h3 className="text-sm font-medium text-neutral-400 leading-tight">
                    How well your resume matches this job
                  </h3>
                </div>

                <div className="my-4 flex items-baseline gap-2">
                  <span className={`text-6xl font-extrabold tracking-tight ${scoreColor(result.atsScore)}`}>
                    {result.atsScore}
                  </span>
                  <span className="text-neutral-400 text-lg">/100</span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  {result.verdict}
                </p>

                <button
                  onClick={reset}
                  className="mt-8 text-xs font-bold text-neutral-400 hover:text-white transition uppercase tracking-wider self-start"
                >
                  ← Check Another Resume
                </button>
              </div>

              {/* Right Columns */}
              <div className="lg:col-span-2 space-y-8">

                {/* Section Scores */}
                <div className="bg-white border-2 border-green-100 rounded-3xl p-6 shadow-xl grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(result.sectionScores || {}).map(([key, score]) => (
                    <div key={key} className="border border-gray-100 p-3 rounded-2xl bg-gray-50/50 text-center">
                      <span className="block text-lg font-bold text-gray-800">{score}%</span>
                      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Keywords */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-md">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
                      <BsCheckCircleFill className="text-green-500" size={16} />
                      Matched Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(result.matchedKeywords || []).map((kw, idx) => (
                        <span key={idx} className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-100">
                          {kw}
                        </span>
                      ))}
                      {(!result.matchedKeywords || result.matchedKeywords.length === 0) && (
                        <p className="text-xs text-gray-400">No matches found.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-md">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
                      <BsXCircleFill className="text-red-400" size={16} />
                      Missing Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(result.missingKeywords || []).map((kw, idx) => (
                        <span key={idx} className="bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-100">
                          {kw}
                        </span>
                      ))}
                      {(!result.missingKeywords || result.missingKeywords.length === 0) && (
                        <p className="text-xs text-gray-400">Nothing missing — great coverage!</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Formatting Issues */}
                {result.formattingIssues && result.formattingIssues.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-md">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                      <BsExclamationTriangleFill className="text-amber-500" />
                      Formatting Issues
                    </h3>

                    <div className="space-y-3">
                      {result.formattingIssues.map((issue, idx) => (
                        <div key={idx} className="flex gap-3 items-start p-4 bg-amber-50/60 border border-amber-100 rounded-2xl">
                          <BsExclamationTriangleFill className="text-amber-500 mt-0.5 shrink-0" size={16} />
                          <p className="text-sm text-gray-600 leading-relaxed font-medium">{issue}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                <div className="bg-white border-2 border-green-100 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-green-600">
                    <BsAward size={120} />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-2">
                    <BsFileEarmarkText className="text-green-600" />
                    Improvement Suggestions
                  </h3>
                  <p className="text-xs text-gray-400 mb-6 font-medium">
                    Concrete edits to raise your match score for this role.
                  </p>

                  <div className="space-y-3">
                    {(result.improvementSuggestions || []).map((s, idx) => (
                      <div
                        key={idx}
                        className="bg-green-50/50 border border-green-100 p-4 rounded-xl font-medium text-sm text-gray-700 flex items-start gap-3"
                      >
                        <BsArrowRight className="text-green-600 mt-0.5 shrink-0" size={14} />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <Footer />
    </div>
  );
}

export default AtsScoreChecker;
