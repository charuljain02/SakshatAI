import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import maleVideo from "../assets/Videos/male-ai.mp4";
import femaleVideo from "../assets/Videos/female-ai.mp4";

import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";

import Timer from "./Timer";

const ServerUrl = "http://localhost:8000";

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions = [], userName } = interviewData;

  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voiceGender, setVoiceGender] = useState("female");

  const [subtitle, setSubtitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null); // Fixes hardware mic recording locks
  const finalTranscriptRef = useRef("");

  const currentQuestion = questions[currentIndex];
  const [timeLeft, setTimeLeft] = useState(currentQuestion?.timeLimit || 60);

  // Dynamic references tracking live values across asynchronous event loops
  const isMicOnRef = useRef(isMicOn);
  const isAIPlayingRef = useRef(isAIPlaying);

  useEffect(() => {
    isMicOnRef.current = isMicOn;
  }, [isMicOn]);

  useEffect(() => {
    isAIPlayingRef.current = isAIPlaying;
  }, [isAIPlaying]);

  /* -------------------- LOAD VOICES -------------------- */
  
useEffect(() => {
  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices();

    if (!voices.length) return;

    // MALE VOICE FIRST
    const maleVoice = voices.find(
      (v) =>
        v.name.toLowerCase().includes("david") ||
        v.name.toLowerCase().includes("male") ||
        v.name.toLowerCase().includes("mark")
    );

    if (maleVoice) {
      setSelectedVoice(maleVoice);
      setVoiceGender("male");
      return;
    }

    // FEMALE FALLBACK
    const femaleVoice = voices.find(
      (v) =>
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("samantha")
    );

    if (femaleVoice) {
      setSelectedVoice(femaleVoice);
      setVoiceGender("female");
      return;
    }

    setSelectedVoice(voices[0]);
  };

  loadVoices();

  window.speechSynthesis.onvoiceschanged = loadVoices;
}, []);
     

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  /* -------------------- SPEAK TEXT -------------------- */
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); // Clears any lingering speech queues safely
      const utterance = new SpeechSynthesisUtterance(text);

      utterance.voice = selectedVoice;
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
        setSubtitle(text);
        if (videoRef.current) {
          videoRef.current.play().catch((err) => console.log("Video playback caught: ", err));
        }
      };

      utterance.onend = () => {
        setIsAIPlaying(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
        setSubtitle("");
        resolve();
      };

      utterance.onerror = () => {
        setIsAIPlaying(false);
        setSubtitle("");
        resolve(); // Prevents lifecycle pipeline from deadlocking on error patterns
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  /* -------------------- INTRO CONFIGURATION LIEFOCYCLE -------------------- */
  useEffect(() => {
    if (!selectedVoice) return;
    let isMounted = true;

    const startInterview = async () => {
      if (isIntroPhase && isMounted) {
        await speakText(`Hi ${userName}, welcome to your AI interview.`);
        if (!isMounted) return;
        await speakText("Please answer confidently and clearly. Let's begin.");
        if (!isMounted) return;
        
        setIsIntroPhase(false);

        if (currentQuestion?.question) {
          await speakText(currentQuestion.question);
        }
      }
    };

    startInterview();
    return () => {
      isMounted = false;
    };
  }, [selectedVoice]);

  /* -------------------- QUESTION CHANGE LIEFOCYCLE -------------------- */
  useEffect(() => {
    if (isIntroPhase) return;

    const askQuestion = async () => {
      if (currentQuestion?.question) {
        await speakText(currentQuestion.question);
      }
    };

    askQuestion();
    setTimeLeft(currentQuestion?.timeLimit || 60);
  }, [currentIndex]);

  /* -------------------- TIMER CONTROL -------------------- */
  useEffect(() => {
    if (isIntroPhase || feedback) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isIntroPhase, currentIndex, feedback]);

  /* -------------------- AUTO SUBMIT ON TIMEOUT -------------------- */
  useEffect(() => {
    if (timeLeft === 0 && !feedback) {
      submitAnswer();
    }
  }, [timeLeft]);

  /* -------------------- SPEECH RECOGNITION MIDDLEWARE -------------------- */
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech Recognition engine completely missing from current client environment window.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onend = () => {
      // Intelligently restarts speech pipeline if cut off by native browser silence parameters
      if (isMicOnRef.current && !isAIPlayingRef.current) {
        try {
          recognition.start();
        } catch (err) {
          console.warn("Speech engine auto restart intercepted gracefully: ", err);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Engine Error Context:", event.error);
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      setAnswer(finalTranscriptRef.current + interimTranscript);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  /* -------------------- MIC CONTROLS -------------------- */
  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream; // Cache active stream reference to control hardware locks
      setIsMicOn(true);
      
      setTimeout(() => {
        try {
          recognitionRef.current?.start();
        } catch (e) {
          console.error("Failed to call native recognition start method:", e);
        }
      }, 100);
    } catch (err) {
      console.error("Microphone hardware access rejected:", err);
      alert("Microphone connection channel access blocked.");
    }
  };

  const stopMic = () => {
    setIsMicOn(false);
    try {
      recognitionRef.current?.stop();
    } catch (e) {
      console.error("Error pausing speech recognition engine:", e);
    }

    // Explicitly shut off hardware tracks to dim the user's physical camera/mic activity lights
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
  };

  /* -------------------- SUBMIT DATA MATRIX -------------------- */
  const submitAnswer = async () => {
    if (isSubmitting) return;

    stopMic();
    setIsSubmitting(true);

    try {
      const result = await axios.post(
        `${ServerUrl}/api/interview/submit-answer`,
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: (currentQuestion?.timeLimit || 60) - timeLeft,
        },
        { withCredentials: true }
      );

      setFeedback(result?.data?.feedback || "Answer captured perfectly into metrics layout.");
    } catch (error) {
      console.error("Server synchronization payload failure:", error);
      alert("Failed to push response stream down server infrastructure layout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* -------------------- NAVIGATION ROUTE -------------------- */
  const handleNext = async () => {
    stopMic();
    setAnswer("");
    finalTranscriptRef.current = "";
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  /* -------------------- TERMINATE PROCESS -------------------- */
  const finishInterview = async () => {
    stopMic();
    try {
      const result = await axios.post(
        `${ServerUrl}/api/interview/finish`,
        { interviewId },
        { withCredentials: true }
      );

      onFinish(result.data);
    } catch (error) {
      console.error("Failed to post formal finality stream mapping hook:", error);
    }
  };

  /* -------------------- PIPELINE CLEANUP UNMOUNT -------------------- */
  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.abort();
      } catch (e) {}
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-3 select-none font-sans">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[620px]">

        {/* LEFT SIDE: AI INTERVIEWER PANEL */}
        <div className="lg:w-[35%] border-r bg-gray-50 p-6 flex flex-col items-center justify-between">
          <div className="w-full flex flex-col items-center">
            
            {/* Video Box Container */}
            <div className="w-full max-w-[260px] rounded-2xl overflow-hidden shadow-md bg-black border border-gray-100">
              <video
                ref={videoRef}
                src={videoSource}
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-contain"
              />
            </div>

            {subtitle && (
              <div className="mt-4 bg-emerald-50 border border-emerald-100 text-emerald-900 rounded-xl p-3.5 text-center text-xs font-medium leading-relaxed max-w-[280px] shadow-sm animate-pulse">
                {subtitle}
              </div>
            )}
          </div>

          {/* Metrics Layout Card */}
          <div className="mt-6 bg-white w-full rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Status
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                isAIPlaying ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
              }`}>
                {isAIPlaying ? "AI Speaking" : "Waiting for response"}
              </span>
            </div>

            <div className="mt-5 flex justify-center">
              <Timer
                timeLeft={timeLeft}
                totalTime={currentQuestion?.timeLimit || 60}
              />
            </div>

            <div className="grid grid-cols-2 mt-5 text-center gap-2 border-t border-gray-50 pt-4">
              <div>
                <h2 className="text-2xl font-black text-gray-800">
                  {currentIndex + 1}
                </h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Current
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-400">
                  {questions.length}
                </h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Total
                </p>
              </div>
            </div>
          </div>
        </div> {/* Fixed: Layout structural tree closure error solved perfectly */}

        {/* RIGHT SIDE: INTERACTIVE INTERFACE CONTROLS */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between bg-white">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                SakshatAI Smart Board
              </h1>
              <span className="text-xs bg-gray-100 px-3 py-1.5 rounded-lg text-gray-500 font-semibold">
                Environment: Evaluation Sandbox
              </span>
            </div>

            {!isIntroPhase && (
              <>
                <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-5 mb-5 transition-all">
                  <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider mb-1.5">
                    Active Prompt Target
                  </p>
                  <h2 className="text-base font-semibold text-gray-800 leading-relaxed">
                    {currentQuestion?.question}
                  </h2>
                </div>

                <div className="relative group">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Click the microphone button to start speaking, or type your response here manually..."
                    className="flex-1 min-h-[220px] bg-gray-50 border border-gray-200 rounded-2xl p-5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none w-full pr-28 text-gray-700 font-medium text-sm leading-relaxed transition-all shadow-inner"
                  />

                  {isMicOn && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse shadow-sm">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Listening
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* LOWER ACTIONS INTERACTIVE CONTAINER */}
          {!isIntroPhase && (
            <div className="mt-6">
              {!feedback ? (
                <div className="flex items-center gap-4">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMic}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0 transition-colors ${
                      isMicOn 
                        ? "bg-red-500 hover:bg-red-600 shadow-red-500/10" 
                        : "bg-gray-900 hover:bg-gray-800 shadow-gray-900/10"
                    }`}
                  >
                    {isMicOn ? <FaMicrophoneSlash size={20} /> : <FaMicrophone size={20} />}
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    disabled={isSubmitting || !answer.trim()}
                    onClick={submitAnswer}
                    className={`flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-4 rounded-2xl font-bold shadow-md tracking-wide text-sm flex items-center justify-center transition-all ${
                      (!answer.trim() || isSubmitting) ? "opacity-40 cursor-not-allowed" : "hover:opacity-95 hover:shadow-xl"
                    }`}
                  >
                    {isSubmitting ? "Processing AI Metrics Analysis..." : "Submit Answer"}
                  </motion.button>
                </div>
              ) : (
                <div className="bg-emerald-50/60 border border-emerald-100 p-5 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-2.5 py-1 rounded-md">
                      Instant AI Appraisal
                    </span>
                    <p className="text-gray-700 font-medium text-sm mt-3 leading-relaxed">
                      {feedback}
                    </p>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-md text-sm tracking-wide"
                  >
                    Next Question
                    <BsArrowRight className="text-base" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Step2Interview;