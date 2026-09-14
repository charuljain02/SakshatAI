import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { motion } from "framer-motion"
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
  BsGithub,
  BsPercent,
  BsArrowRight
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import AuthModal from '../components/AuthModal';
import { useNavigate } from 'react-router-dom';

import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from '../components/Footer';

function Home() {

  const { userData } = useSelector((state) => state.user)

  const [showAuth, setShowAuth] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  const navigate = useNavigate()

  // SEO metadata for the SPA page.
  useEffect(() => {
    const title = "SakshatAI | AI Mock Interviews, GitHub Analyzer & ATS Checker";
    const description =
      "Practice role-based AI mock interviews with smart follow-ups, analyze your GitHub profile, and check your resume ATS compatibility with SakshatAI.";

    document.title = title;

    const setMeta = (name, content, attribute = "name") => {
      let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta(
      "keywords",
      "AI mock interview, AI interview practice, technical interview, HR interview, GitHub analyzer, ATS checker, resume analyzer, interview preparation"
    );
    setMeta("robots", "index, follow");
    setMeta("author", "SakshatAI");

    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:url", window.location.href, "property");

    setMeta("twitter:card", "summary", "name");
    setMeta("twitter:title", title, "name");
    setMeta("twitter:description", description, "name");

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${window.location.pathname}`;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "SakshatAI",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      description,
      url: window.location.origin,
    };

    let jsonLd = document.head.querySelector(
      'script[data-seo="sakshatai-home"]'
    );
    if (!jsonLd) {
      jsonLd = document.createElement("script");
      jsonLd.type = "application/ld+json";
      jsonLd.dataset.seo = "sakshatai-home";
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify(structuredData);

    return () => {
      // Keep document metadata stable when navigating inside the SPA.
    };
  }, []);

  return (
    <div className='min-h-screen overflow-x-hidden bg-[#f3f3f3] flex flex-col'>
      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto">

        {/* TOP BADGE */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 text-gray-600 text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
            <HiSparkles size={16} className="text-green-600" />
            AI Powered Smart Interview Platform
          </div>
        </div>

        {/* HERO SECTION */}
        <section aria-labelledby="hero-heading" className="text-center mb-16 sm:mb-20">

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            id='hero-heading' className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.08] tracking-tight max-w-4xl mx-auto px-1'
          >
            <span className="block">
              Practice Interviews with
            </span>

            <span className='block w-fit mx-auto bg-green-100 text-green-600 px-4 sm:px-5 py-1.5 rounded-full mt-3'>
              AI Intelligence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg"
          >
            Role-based mock interviews with smart follow-ups,
            adaptive difficulty and real-time performance evaluation
          </motion.p>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-stretch sm:items-center gap-3 sm:gap-4 mt-8 sm:mt-10">

            <motion.button
              type="button"
              aria-label={userData ? "Start AI interview" : "Get started with SakshatAI"}
              onClick={() => {
                if (!userData) {
                  setAuthMessage("Login to start your AI interview")
                  navigate("/auth")
                  return;
                }

                navigate("/interview")
              }}
              whileHover={{ opacity: 0.9, scale: 1.03 }}
              whileTap={{ opacity: 1, scale: 0.98 }}
              className='w-full sm:w-auto min-h-11 bg-black text-white px-8 sm:px-10 py-3 rounded-full hover:opacity-90 transition shadow-md'
            >
              {userData ? "Start Interview" : "Get Started"}
            </motion.button>

            <motion.button
              type="button"
              aria-label={userData ? "View interview history" : "Track interview progress"}
              onClick={() => {
                if (!userData) {
                  setAuthMessage("Login to view your interview history")
                  setShowAuth(true)
                  return;
                }

                navigate("/history")
              }}
              whileHover={{ opacity: 0.9, scale: 1.03 }}
              whileTap={{ opacity: 1, scale: 0.98 }}
              className='w-full sm:w-auto border border-gray-300 px-8 sm:px-10 py-3 rounded-full hover:bg-gray-100 transition'
            >
              {userData ? "View History" : "Track Progress"}
            </motion.button>

          </div>
        </section>

<div className="mb-20 sm:mb-28 max-w-6xl mx-auto">

  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-center mb-12"
  >
    <p className="text-xs font-semibold tracking-[0.25em] text-green-600 uppercase mb-3">
      Career Intelligence
    </p>
    <h2 id="career-intelligence-heading" className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
      Go Beyond the <span className="text-green-600">Interview</span>
    </h2>
    <p className="text-gray-500 mt-3 sm:mt-4 max-w-xl mx-auto text-sm sm:text-base px-3">
      Prepare your profile and resume before you even walk into the room.
    </p>
  </motion.div>

  <div
    className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch"
    role="list"
    aria-label="SakshatAI career analysis tools"
  >

    {/* GITHUB ANALYZER */}
    <motion.div
      role="listitem" 
      initial={{ opacity: 0, x: -45, y: 20, rotate: -2 }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: -1.2 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10, rotate: 0, transition: { duration: 0.35 } }}
      className="group relative h-full min-h-[430px] sm:min-h-[470px] rounded-[28px] sm:rounded-[34px] p-[1.5px] overflow-hidden"
    >
      <motion.div
        className="absolute inset-[-80%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_285deg,#22c55e_320deg,#86efac_340deg,transparent_360deg)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative h-full min-h-[427px] sm:min-h-[467px] overflow-hidden rounded-[27px] sm:rounded-[33px] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.07)] group-hover:shadow-[0_30px_85px_rgba(22,163,74,0.14)] transition-shadow duration-500">
        <div className="absolute -right-28 -top-28 w-80 h-80 rounded-full bg-green-100/70" />
        <div className="absolute right-12 top-24 w-32 h-32 rounded-full bg-green-50/70 blur-2xl" />

        <motion.div
          animate={{ y: [0, -7, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-5 sm:right-8 top-5 sm:top-8 z-20 w-[62px] h-[62px] sm:w-[76px] sm:h-[76px] rounded-[22px] bg-white border border-green-100 shadow-[0_14px_35px_rgba(22,163,74,0.13)] flex items-center justify-center text-green-600"
        >
          <BsGithub size={26} className="sm:w-[31px] sm:h-[31px]" />
          <span className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
        </motion.div>

        <div className="relative z-10 h-full min-h-[427px] sm:min-h-[467px] p-5 sm:p-7 md:p-9 flex flex-col">
          <div className="pr-24">
            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-100 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              NEW CAPABILITY
            </span>
          </div>

          <div className="mt-7 sm:mt-9 max-w-[82%] sm:max-w-[78%]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">Profile Intelligence</p>
            <h3 className="text-[30px] sm:text-[34px] md:text-[40px] leading-[1] sm:leading-[0.98] font-bold tracking-tight text-gray-950">
              AI GitHub
              <span className="block text-green-600 mt-1">Analyzer</span>
            </h3>
            <p className="text-sm md:text-[15px] leading-6 text-gray-500 mt-5 max-w-md">
              Turn your open-source activity into career intelligence with repository, skills, activity and interview-readiness insights.
            </p>
          </div>

          <div className="mt-7 sm:mt-8 grid grid-cols-3 gap-2 max-w-[420px]">
            <motion.div whileHover={{ y: -5 }} className="rounded-2xl border border-gray-100 bg-gray-50/80 px-3 py-3.5">
              <p className="text-lg font-bold text-gray-900">01</p>
              <p className="text-[9px] uppercase tracking-wider text-gray-400 mt-1">Profile</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="rounded-2xl border border-green-100 bg-green-50/70 px-3 py-3.5">
              <p className="text-lg font-bold text-green-600">AI</p>
              <p className="text-[9px] uppercase tracking-wider text-gray-400 mt-1">Insights</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="rounded-2xl border border-gray-100 bg-gray-50/80 px-3 py-3.5">
              <p className="text-lg font-bold text-gray-900">360°</p>
              <p className="text-[9px] uppercase tracking-wider text-gray-400 mt-1">Analysis</p>
            </motion.div>
          </div>

          <div className="mt-5 sm:mt-7 max-w-[420px] rounded-2xl border border-gray-100 bg-white/80 px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Activity signal</span>
              <span className="text-[10px] font-semibold text-green-600">Strong</span>
            </div>
            <div className="flex items-end gap-1 h-7">
              {[35, 52, 42, 68, 58, 82, 72, 94, 76, 100, 86, 96].map((height, i) => (
                <motion.span key={i} initial={{ height: 3 }} whileInView={{ height: `${height}%` }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.035 }} className="flex-1 rounded-full bg-green-400/70" />
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6 sm:pt-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <span className="text-[10px] md:text-xs text-gray-400">GitHub → Career Intelligence</span>
            <motion.button
              type="button"
              aria-label="Analyze GitHub profile"
              onClick={() => {
                if (!userData) {
                  setAuthMessage("Login to unlock the GitHub Profile Analyzer");
                  navigate("/auth");
                  return;
                }
                navigate("/analyzer");
              }}
              whileHover={{ scale: 1.04, x: 3 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto shrink-0 inline-flex justify-center items-center gap-2 rounded-2xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-3 shadow-lg shadow-green-600/20 transition-colors"
            >
              Analyze Profile <BsArrowRight size={15} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>

    {/* ATS ANALYZER */}
    <motion.div
      role="listitem" 
      initial={{ opacity: 0, x: 45, y: 20, rotate: 2 }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 1.2 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10, rotate: 0, transition: { duration: 0.35 } }}
      className="group relative h-full min-h-[430px] sm:min-h-[470px] rounded-[28px] sm:rounded-[34px] p-[1.5px] overflow-hidden"
    >
      <motion.div
        className="absolute inset-[-80%] bg-[conic-gradient(from_180deg,transparent_0deg,transparent_285deg,#22c55e_320deg,#86efac_340deg,transparent_360deg)]"
        animate={{ rotate: -360 }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative h-full min-h-[427px] sm:min-h-[467px] overflow-hidden rounded-[27px] sm:rounded-[33px] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.07)] group-hover:shadow-[0_30px_85px_rgba(22,163,74,0.14)] transition-shadow duration-500">
        <div className="absolute -left-28 -bottom-28 w-80 h-80 rounded-full bg-green-100/70" />
        <div className="absolute left-10 bottom-12 w-36 h-36 rounded-full bg-green-50/80 blur-2xl" />

        <motion.div
          animate={{ y: [0, -7, 0], rotate: [0, -2, 0] }}
          transition={{ duration: 4.3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-5 sm:right-7 top-5 sm:top-7 z-20 w-[72px] h-[72px] sm:w-[86px] sm:h-[86px] rounded-full bg-white border border-green-100 shadow-[0_14px_35px_rgba(22,163,74,0.13)] flex flex-col items-center justify-center"
        >
          <span className="text-[19px] sm:text-[23px] leading-none font-bold text-green-600">87%</span>
          <span className="text-[8px] uppercase tracking-widest text-gray-400 mt-1">Match</span>
        </motion.div>

        <div className="relative z-10 h-full min-h-[427px] sm:min-h-[467px] p-5 sm:p-7 md:p-9 flex flex-col">
          <div className="pr-28">
            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-100 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              RESUME INTELLIGENCE
            </span>
          </div>

          <div className="mt-7 sm:mt-9 max-w-[82%] sm:max-w-[78%]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">Resume Matching</p>
            <h3 className="text-[30px] sm:text-[34px] md:text-[40px] leading-[1] sm:leading-[0.98] font-bold tracking-tight text-gray-950">
              AI ATS
              <span className="block text-green-600 mt-1">Checker</span>
            </h3>
            <p className="text-sm md:text-[15px] leading-6 text-gray-500 mt-5 max-w-md">
              Compare your resume with a job description to uncover keyword matches, missing skills, formatting issues and concrete improvements.
            </p>
          </div>

          <div className="mt-7 sm:mt-8 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5 sm:gap-2.5 max-w-[440px]">
            <motion.div whileHover={{ y: -5, rotate: -2 }} className="min-h-[84px] sm:min-h-[92px] rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
              <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-3"><BsFileEarmarkText size={18} /></div>
              <p className="text-xs font-semibold text-gray-800">Resume</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Uploaded PDF</p>
            </motion.div>

            <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} className="text-green-500 px-1">
              <BsArrowRight size={19} />
            </motion.div>

            <motion.div whileHover={{ y: -5, rotate: 2 }} className="min-h-[84px] sm:min-h-[92px] rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
              <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-3"><BsPercent size={18} /></div>
              <p className="text-xs font-semibold text-gray-800">Job Match</p>
              <p className="text-[10px] text-gray-400 mt-0.5">ATS Analysis</p>
            </motion.div>
          </div>

          <div className="mt-5 sm:mt-6 max-w-[440px]">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Detected skills</span>
              <span className="h-px flex-1 bg-gray-100" />
            </div>
            <div className="flex flex-wrap gap-2">
              {['React ✓', 'Node.js ✓', 'MongoDB ✓', 'AWS +'].map((skill, i) => (
                <motion.span key={skill} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.08 }} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium border ${i === 3 ? 'bg-gray-50 text-gray-400 border-gray-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6 sm:pt-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <span className="text-[10px] md:text-xs text-gray-400">Resume → Job Compatibility</span>
            <motion.button
              type="button"
              aria-label="Check resume ATS score"
              onClick={() => {
                if (!userData) {
                  setAuthMessage("Login to unlock the ATS Score Checker");
                  navigate("/auth");
                  return;
                }
                navigate("/ats");
              }}
              whileHover={{ scale: 1.04, x: 3 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto shrink-0 inline-flex justify-center items-center gap-2 rounded-2xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-3 shadow-lg shadow-green-600/20 transition-colors"
            >
              Check ATS Score <BsArrowRight size={15} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>

  </div>
</div>

        {/* STEPS SECTION */}
        <section aria-labelledby="interview-steps-heading" className="mb-20 sm:mb-28">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-xs font-semibold tracking-[0.25em] text-green-600 uppercase mb-3">
              How it works
            </p>
            <h2 id="interview-steps-heading" className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
              From Setup to <span className="text-green-600">Interview</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">

          {
            [
              {
                icon: <BsRobot size={24} />,
                step: "STEP 1",
                title: "Role & Experience Selection",
                desc: "AI adjusts difficulty based on selected job role."
              },
              {
                icon: <BsMic size={24} />,
                step: "STEP 2",
                title: "Smart Voice Interview",
                desc: "Dynamic follow-up questions based on your answers."
              },
              {
                icon: <BsClock size={24} />,
                step: "STEP 3",
                title: "Timer Based Simulation",
                desc: "Real interview pressure with time tracking."
              }
            ].map((item, index) => (

              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 + index * 0.2 }}
                whileHover={{ rotate: 0, scale: 1.06 }}
                className={`
                  relative bg-white rounded-3xl border-2 border-green-100
                  hover:border-green-500 p-10 w-full max-w-none shadow-md
                  hover:shadow-2xl transition-all duration-300
                  ${index === 0 ? "rotate-[-4deg]" : ""}
                  ${index === 1 ? "rotate-[3deg] shadow-xl" : ""}
                  ${index === 2 ? "rotate-[-3deg]" : ""}
                `}
              >

                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white border-2 border-green-500 text-green-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                  {item.icon}
                </div>

                <div className="pt-10 text-center">
                  <div className='text-xs text-green-600 font-semibold mb-2 tracking-wider'>
                    {item.step}
                  </div>

                  <h3 className='font-semibold mb-3 text-lg'>
                    {item.title}
                  </h3>

                  <p className='text-sm text-gray-500 leading-relaxed'>
                    {item.desc}
                  </p>
                </div>

              </motion.div>
            ))
          }
          </div>
        </section>

        {/* AI CAPABILITIES */}
        <section aria-labelledby="ai-capabilities-heading" className="mb-20 sm:mb-32">

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-3xl sm:text-4xl font-semibold text-center mb-10 sm:mb-16 tracking-tight px-2'
            id="ai-capabilities-heading"
          >
            Advanced AI{" "}
            <span className='text-green-600'>Capabilities</span>
          </motion.h2>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10'>

            {
              [
                {
                  image: evalImg,
                  icon: <BsBarChart size={20} />,
                  title: "AI Answer Evaluation",
                  desc: "Scores communication, technical accuracy and confidence."
                },
                {
                  image: resumeImg,
                  icon: <BsFileEarmarkText size={20} />,
                  title: "Resume Based Interview",
                  desc: "Project specific questions based on your resume."
                },
                {
                  image: pdfImg,
                  icon: <BsFileEarmarkText size={20} />,
                  title: "Downloadable PDF Report",
                  desc: "Detailed strengths, weaknesses and improvement insights."
                },
                {
                  image: analyticsImg,
                  icon: <BsBarChart size={20} />,
                  title: "History & Analytics",
                  desc: "Track progress with performance graphs and topic analysis."
                }
              ].map((item, index) => (

                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className='bg-white border border-gray-200 rounded-3xl p-5 sm:p-8 shadow-sm hover:shadow-xl transition-all h-full'
                >

                  <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 h-full">

                    <div className='w-full sm:w-1/2 flex justify-center'>
                      <img
                        src={item.image}
                        alt={`${item.title} - SakshatAI`}
                        loading="lazy"
                        decoding="async"
                        className='w-full max-h-52 sm:max-h-64 object-contain'
                      />
                    </div>

                    <div className="w-full md:w-1/2">

                      <div className="bg-green-50 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                        {item.icon}
                      </div>

                      <h3 className='font-semibold mb-3 text-xl'>
                        {item.title}
                      </h3>

                      <p className='text-gray-500 text-sm leading-relaxed'>
                        {item.desc}
                      </p>

                    </div>

                  </div>

                </motion.div>
              ))
            }

          </div>
        </section>

        {/* INTERVIEW MODES */}
        <section aria-labelledby="interview-modes-heading" className="mb-20 sm:mb-32">

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-3xl sm:text-4xl font-semibold text-center mb-10 sm:mb-16 tracking-tight px-2'
            id="interview-modes-heading"
          >
            Multiple Interview Modes{" "}
            <span className='text-green-600'>Capabilities</span>
          </motion.h2>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10'>

            {
              [
                {
                  image: hrImg,
                  title: "HR Interview Mode",
                  desc: "Behavioral and communication based evaluation."
                },
                {
                  image: techImg,
                  title: "Technical Mode",
                  desc: "Deep technical questioning based on selected role."
                },
                {
                  image: confidenceImg,
                  title: "Confidence Detection",
                  desc: "Basic tone and voice analysis insights."
                },
                {
                  image: creditImg,
                  title: "Credits System",
                  desc: "Unlock premium interview sessions."
                }
              ].map((mode, index) => (

                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-8 shadow-sm hover:shadow-xl transition-all h-full"
                >

                  <div className='flex flex-col sm:flex-row items-center justify-between gap-6 h-full'>

                    <div className='w-full sm:w-1/2'>

                      <h3 className='font-semibold text-xl mb-3'>
                        {mode.title}
                      </h3>

                      <p className='text-gray-500 text-sm leading-relaxed'>
                        {mode.desc}
                      </p>

                    </div>

                    <div className='w-full sm:w-1/2 flex justify-center sm:justify-end'>

                      <img
                        src={mode.image}
                        alt={`${mode.title} - SakshatAI`}
                        loading="lazy"
                        decoding="async"
                        className='w-[180px] sm:w-[220px] object-contain'
                      />

                    </div>

                  </div>

                </motion.div>
              ))
            }

          </div>
        </section>

      </main>

      <Footer />

      {showAuth && (
        <AuthModal
          message={authMessage}
          onClose={() => setShowAuth(false)}
        />
      )}

    </div>
  )
}

export default Home
