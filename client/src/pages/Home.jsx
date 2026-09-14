import React, { useState } from 'react'
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

  // Shared data for the two AI tool cards, so both render from one consistent template
  const aiTools = [
    {
      key: "github",
      badge: "NEW CAPABILITY",
      badgeIcon: <BsGithub size={13} className="animate-pulse" />,
      icon: <BsGithub size={26} />,
      title: "AI GitHub Profile",
      titleAccent: "Analyzer",
      desc: "Transform your open-source presence into actionable career intelligence. Scan your repositories, calculate readiness scores, and unlock optimized interview trajectories.",
      tag: "Profile Insights Coach",
      cta: "Analyze My Profile",
      authMsg: "Login to unlock the GitHub Profile Analyzer",
      route: "/analyzer",
      accent: "indigo",
    },
    {
      key: "ats",
      badge: "NEW CAPABILITY",
      badgeIcon: <BsPercent size={13} className="animate-pulse" />,
      icon: <BsFileEarmarkText size={26} />,
      title: "AI ATS Score",
      titleAccent: "Checker",
      desc: "Upload your resume alongside a job description to see exactly how an ATS would score it — matched and missing keywords, formatting flags, and concrete fixes.",
      tag: "Resume Match Coach",
      cta: "Check My ATS Score",
      authMsg: "Login to unlock the ATS Score Checker",
      route: "/ats",
      accent: "green",
    },
  ];

  const accentClasses = {
    indigo: {
      iconWrap: "bg-white border-indigo-200 text-indigo-600",
      ping: "bg-indigo-400",
      dot: "bg-indigo-500",
      titleSpan: "text-indigo-600",
      button: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10",
      blob: "bg-indigo-200/25 group-hover:bg-indigo-300/35",
    },
    green: {
      iconWrap: "bg-white border-green-200 text-green-600",
      ping: "bg-green-400",
      dot: "bg-green-500",
      titleSpan: "text-green-600",
      button: "bg-green-600 hover:bg-green-700 shadow-green-600/10",
      blob: "bg-green-200/25 group-hover:bg-green-300/35",
    },
  };

  return (
    <div className='min-h-screen bg-[#f3f3f3] flex flex-col'>
      <Navbar />

      <div className="flex-1 px-6 py-20 max-w-7xl mx-auto w-full">

        {/* TOP BADGE */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
            <HiSparkles size={16} className="text-green-600" />
            AI Powered Smart Interview Platform
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="text-center mb-16">

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-4xl md:text-6xl font-semibold leading-tight max-w-4xl mx-auto'
          >
            <span className="block">
              Practice Interviews with
            </span>

            <span className='block bg-green-100 text-green-600 px-5 py-1 rounded-full mt-3 inline-block'>
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

          <div className="flex flex-wrap justify-center gap-4 mt-10">

            <motion.button
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
              className='bg-black text-white px-10 py-3 rounded-full hover:opacity-90 transition shadow-md'
            >
              {userData ? "Start Interview" : "Get Started"}
            </motion.button>

            <motion.button
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
              className='border border-gray-300 px-10 py-3 rounded-full hover:bg-gray-100 transition'
            >
              {userData ? "View History" : "Track Progress"}
            </motion.button>

          </div>
        </div>

        {/* AI TOOLS SECTION — GitHub Analyzer + ATS Score Checker, unified layout */}
        <div className="mb-32">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className='text-3xl md:text-4xl font-semibold'>
              Go Beyond the{" "}
              <span className='text-green-600'>Interview</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Two AI tools that prep you before you even walk into the room.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

            {aiTools.map((tool, index) => {
              const accent = accentClasses[tool.accent];

              return (
                <motion.div
                  key={tool.key}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative group bg-gradient-to-br from-white via-white to-gray-50 rounded-3xl p-8 border-2 border-green-100 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
                >

                  {/* Ambient accent blob */}
                  <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl transition-all duration-500 pointer-events-none ${accent.blob}`} />

                  <div className="relative z-10 flex flex-col flex-1">

                    {/* Badge + Icon row */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="inline-flex items-center gap-2 bg-black text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
                        {tool.badgeIcon}
                        <span>{tool.badge}</span>
                      </div>

                      <div className={`relative w-12 h-12 border rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 ${accent.iconWrap}`}>
                        {tool.icon}
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${accent.ping}`}></span>
                          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${accent.dot}`}></span>
                        </span>
                      </div>
                    </div>

                    {/* Title + description */}
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">
                      {tool.title} <span className={accent.titleSpan}>{tool.titleAccent}</span>
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                      {tool.desc}
                    </p>

                    {/* Footer: tag + CTA, pinned to bottom for equal-height alignment */}
                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                        {tool.tag}
                      </span>

                      <motion.button
                        onClick={() => {
                          if (!userData) {
                            setAuthMessage(tool.authMsg);
                            navigate("/auth");
                            return;
                          }
                          navigate(tool.route);
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className={`shrink-0 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition shadow-md flex items-center gap-2 ${accent.button}`}
                      >
                        {tool.cta}
                        <BsArrowRight size={14} />
                      </motion.button>
                    </div>

                  </div>
                </motion.div>
              );
            })}

          </div>
        </div>

        {/* STEPS SECTION */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-28">

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
                  hover:border-green-500 p-10 w-80 max-w-[90%] shadow-md
                  hover:shadow-2xl transition-all duration-300
                  ${index === 0 ? "rotate-[-4deg]" : ""}
                  ${index === 1 ? "rotate-[3deg] md:-mt-6 shadow-xl" : ""}
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

        {/* AI CAPABILITIES */}
        <div className="mb-32">

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-4xl font-semibold text-center mb-16'
          >
            Advanced AI{" "}
            <span className='text-green-600'>Capabilities</span>
          </motion.h2>

          <div className='grid md:grid-cols-2 gap-10'>

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
                  className='bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all'
                >

                  <div className="flex flex-col md:flex-row items-center gap-8">

                    <div className='w-full md:w-1/2 flex justify-center'>
                      <img
                        src={item.image}
                        alt={item.title}
                        className='w-full max-h-64 object-contain'
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
        </div>

        {/* INTERVIEW MODES */}
        <div className="mb-32">

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-4xl font-semibold text-center mb-16'
          >
            Multiple Interview Modes{" "}
            <span className='text-green-600'>Capabilities</span>
          </motion.h2>

          <div className='grid md:grid-cols-2 gap-10'>

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
                  className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all"
                >

                  <div className='flex flex-col md:flex-row items-center justify-between gap-6'>

                    <div className='w-full md:w-1/2'>

                      <h3 className='font-semibold text-xl mb-3'>
                        {mode.title}
                      </h3>

                      <p className='text-gray-500 text-sm leading-relaxed'>
                        {mode.desc}
                      </p>

                    </div>

                    <div className='w-full md:w-1/2 flex justify-center md:justify-end'>

                      <img
                        src={mode.image}
                        alt={mode.title}
                        className='w-[220px] object-contain'
                      />

                    </div>

                  </div>

                </motion.div>
              ))
            }

          </div>
        </div>

      </div>

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
