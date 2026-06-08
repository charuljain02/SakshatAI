import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  BsGithub, 
  BsArrowRight, 
  BsCodeSlash, 
  BsFileEarmarkText, 
  BsLightningCharge, 
  BsAward,
  BsCheckCircleFill,
  BsXCircleFill,
  BsExclamationTriangleFill
} from 'react-icons/bs';
import { HiSparkles } from 'react-icons/hi';

function GithubAnalyzer() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzedData, setAnalyzedData] = useState(null);

  // Dynamic Mock Analysis engine routing multiple profile configurations
 
  const handleAnalyze = async (e) => {
  e.preventDefault();

  if (!username.trim()) return;

  try {
    setLoading(true);

    // Fetch profile
    const profileRes = await fetch(
      `https://api.github.com/users/${username}`
    );

    if (!profileRes.ok) {
      throw new Error("GitHub user not found");
    }

    const profile = await profileRes.json();

    // Fetch repositories
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`
    );

    const repos = await reposRes.json();

    // Calculate languages
    const languageCount = {};

    repos.forEach((repo) => {
      if (repo.language) {
        languageCount[repo.language] =
          (languageCount[repo.language] || 0) + 1;
      }
    });

    const totalLanguages = Object.values(languageCount).reduce(
      (a, b) => a + b,
      0
    );

    const topLanguages = Object.entries(languageCount)
      .map(([name, count]) => ({
        name,
        percentage: Math.round(
          (count / totalLanguages) * 100
        ),
        color: "bg-green-500",
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    // Calculate stars
    const totalStars = repos.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0
    );

    // Basic readiness score
    const readinessScore = Math.min(
      100,
      Math.round(
        profile.public_repos * 2 +
          profile.followers +
          totalStars
      )
    );

    setAnalyzedData({
      profile: {
        name: profile.name || profile.login,
        login: profile.login,
        avatarUrl: profile.avatar_url,
        bio: profile.bio || "No bio available",
        publicRepos: profile.public_repos,
        followers: profile.followers,
      },

      readinessScore,

      metrics: {
        documentation: {
          score: 75,
          status: "Good",
          label: "Documentation",
        },

        codeQuality: {
          score: 80,
          status: "Good",
          label: "Repositories",
        },

        consistency: {
          score: Math.min(
            100,
            profile.public_repos * 5
          ),
          status: "Active",
          label: "Project Activity",
        },

        architecture: {
          score: 70,
          status: "Growing",
          label: "Portfolio Strength",
        },
      },

      topLanguages,

      insights: [
        {
          type: "success",
          text: `Found ${profile.public_repos} repositories.`,
        },

        {
          type: "info",
          text: `Profile has ${profile.followers} followers.`,
        },

        {
          type: "warning",
          text:
            "AI analysis not enabled yet. Connect Gemini backend next.",
        },
      ],

      trajectories: [
        "Full Stack Development",
        "Open Source Contributor",
        "Software Engineering",
      ],
    });
  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
};
   

   
  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col font-sans selection:bg-green-200">
      <Navbar />

      <div className="flex-1 px-6 py-12 max-w-7xl mx-auto w-full flex flex-col items-center justify-center">
        
        <AnimatePresence mode="wait">
          {!analyzedData ? (
            
            /* --- INPUT TRACK SECTION --- */
            <motion.div 
              key="input-stage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-xl text-center"
            >
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 shadow-sm">
                <HiSparkles size={14} />
                <span>AI PROFILE RECRUITMENT ENGINE</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                Analyze Your <span className="text-green-600">GitHub</span> Presence
              </h1>
              
              <p className="text-gray-500 mb-10 text-base md:text-lg max-w-md mx-auto leading-relaxed">
                Enter your username below. Our AI engines will audit your code metrics, style patterns, and document layouts instantly.
              </p>

              <form onSubmit={handleAnalyze} className="bg-white p-4 rounded-3xl border-2 border-green-100 shadow-xl flex flex-col md:flex-row gap-3 items-center">
                <div className="flex items-center gap-3 px-3 flex-1 w-full border-b md:border-b-0 pb-3 md:pb-0 border-gray-100">
                  <BsGithub size={24} className="text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Enter GitHub username (e.g., charuljain02)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    className="w-full bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none font-medium text-base py-1"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading || !username.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full md:w-auto bg-black hover:bg-neutral-800 disabled:bg-gray-300 text-white font-medium px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition whitespace-nowrap shadow-md"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Parsing Artifacts...</span>
                    </div>
                  ) : (
                    <>
                      <span>Begin Deep Scan</span>
                      <BsArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

          ) : (

            /* --- DASHBOARD INTELLIGENCE REPORT --- */
            <motion.div
              key="report-stage"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
            >
              {/* Left Column: User Profile Overview Card */}
              <div className="bg-white border-2 border-green-100 rounded-3xl p-6 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-green-500 to-emerald-600" />
                
                <img 
                  src={analyzedData.profile.avatarUrl} 
                  alt={analyzedData.profile.name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md mt-6 relative z-10 bg-white"
                />

                <h2 className="text-2xl font-bold text-gray-900 mt-4">{analyzedData.profile.name}</h2>
                <p className="text-sm font-semibold text-green-600">@{analyzedData.profile.login}</p>
                <p className="text-gray-500 text-xs px-4 mt-3 leading-relaxed">{analyzedData.profile.bio}</p>

                <div className="w-full border-t border-gray-100 my-5" />

                <div className="grid grid-cols-2 gap-4 w-full px-2">
                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <span className="block text-xl font-bold text-gray-800">{analyzedData.profile.publicRepos}</span>
                    <span className="text-xs text-gray-400 font-medium">Repositories</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <span className="block text-xl font-bold text-gray-800">{analyzedData.profile.followers}</span>
                    <span className="text-xs text-gray-400 font-medium">Followers</span>
                  </div>
                </div>

                <div className="w-full border-t border-gray-100 my-5" />

                {/* Top Language Badges */}
                <div className="w-full text-left px-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Dominant Stack Mix</h4>
                  <div className="space-y-3">
                    {analyzedData.topLanguages.map((lang, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                          <span>{lang.name}</span>
                          <span>{lang.percentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${lang.color}`} style={{ width: `${lang.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setAnalyzedData(null)}
                  className="mt-8 text-xs font-bold text-gray-400 hover:text-black transition uppercase tracking-wider"
                >
                  ← Scan Another Handle
                </button>
              </div>

              {/* Right Columns: Scores and In-Depth Insights */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Score Summary Banner Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Hero Readiness Gauge Block */}
                  <div className="bg-gradient-to-br from-black to-neutral-900 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between md:col-span-1">
                    <div>
                      <div className="bg-white/10 text-white/90 text-[10px] tracking-widest font-bold px-2.5 py-1 rounded-md inline-block uppercase mb-4">
                        READINESS METRIC
                      </div>
                      <h3 className="text-sm font-medium text-neutral-400 leading-tight">Calculated Technical Interview Fit Score</h3>
                    </div>
                    <div className="my-4 flex items-baseline gap-2">
                      <span className="text-6xl font-extrabold tracking-tight text-green-400">{analyzedData.readinessScore}</span>
                      <span className="text-neutral-400 text-lg">/100</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Your code footprint outpaces <span className="text-white font-semibold">88% of same-tier candidates</span>.
                    </p>
                  </div>

                  {/* Dynamic Modular Core Grid */}
                  <div className="bg-white border-2 border-green-100 rounded-3xl p-6 shadow-xl md:col-span-2 grid grid-cols-2 gap-4">
                    {Object.values(analyzedData.metrics).map((metric, idx) => (
                      <div key={idx} className="border border-gray-100 p-4 rounded-2xl bg-gray-50/50 flex flex-col justify-between">
                        <span className="text-xs font-semibold text-gray-400 block mb-1">{metric.label}</span>
                        <div>
                          <span className="text-2xl font-bold text-gray-800">{metric.score}%</span>
                          <span className="inline-block ml-2 text-[10px] px-2 py-0.5 font-bold rounded bg-green-100 text-green-700 uppercase">
                            {metric.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Executive Engineering Insights */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-md">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                    <BsCodeSlash className="text-green-600" />
                    Structural Insights & Code Health
                  </h3>
                  
                  <div className="space-y-4">
                    {analyzedData.insights.map((insight, idx) => (
                      <div key={idx} className="flex gap-4 items-start p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                        <div className="mt-0.5 shrink-0">
                          {insight.type === 'success' && <BsCheckCircleFill className="text-green-500" size={18} />}
                          {insight.type === 'warning' && <BsExclamationTriangleFill className="text-amber-500" size={18} />}
                          {insight.type === 'info' && <BsLightningCharge className="text-blue-500" size={18} />}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">{insight.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unlocked Trajectories Block */}
                <div className="bg-white border-2 border-green-100 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-green-600">
                    <BsAward size={120} />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-2">
                    <BsFileEarmarkText className="text-green-600" />
                    Recommended AI Interview Trajectories
                  </h3>
                  <p className="text-xs text-gray-400 mb-6 font-medium">Custom tailored pathways inferred directly from your architectural code patterns.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analyzedData.trajectories.map((path, idx) => (
                      <div 
                        key={idx}
                        className="bg-green-50/50 hover:bg-green-50 border border-green-100 p-4 rounded-xl font-semibold text-sm text-gray-700 flex items-center justify-between group transition duration-200 cursor-pointer"
                      >
                        <span>{path}</span>
                        <BsArrowRight className="text-green-600 transform group-hover:translate-x-1 transition-transform" />
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

export default GithubAnalyzer;