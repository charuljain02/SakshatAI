import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import maleVideo from "../assets/videos/male-ai.mp4";
import femaleVideo from "../assets/videos/female-ai.mp4";

import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs"; // Swapped to Right Arrow for natural "Next" progression

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
  const finalTranscriptRef = useRef("");

  const currentQuestion = questions[currentIndex];
  const [timeLeft, setTimeLeft] = useState(currentQuestion?.timeLimit || 60);

  // Added dynamic ref states to prevent continuous handler lifecycle re-trigger tracking bugs
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

      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("male")
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
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

      window.speechSynthesis.cancel();
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
          videoRef.current.play();
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

      window.speechSynthesis.speak(utterance);
    });
  };

  /* -------------------- INTRO -------------------- */
  useEffect(() => {
    if (!selectedVoice) return;

    const startInterview = async () => {
      if (isIntroPhase) {
        await speakText(`Hi ${userName}, welcome to your AI interview.`);
        await speakText("Please answer confidently and clearly. Let's begin.");
        setIsIntroPhase(false);

        setTimeout(async () => {
          if (currentQuestion?.question) {
            await speakText(currentQuestion.question);
          }
        }, 500);
      }
    };

    startInterview();
  }, [selectedVoice]);

  /* -------------------- QUESTION CHANGE -------------------- */
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

  /* -------------------- TIMER -------------------- */
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

  /* -------------------- AUTO SUBMIT -------------------- */
  useEffect(() => {
    if (timeLeft === 0 && !feedback) {
      submitAnswer();
    }
  }, [timeLeft]);

  /* -------------------- SPEECH RECOGNITION -------------------- */
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech Recognition framework completely absent from engine environment browser platform.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onend = () => {
      // Clean target logic configuration using current reference values safely
      if (isMicOnRef.current && !isAIPlayingRef.current) {
        try {
          recognition.start();
        } catch (err) {
          console.log("Speech engine auto restart intercept trace: ", err);
        }
      }
    };

    recognition.onerror = (event) => {
      console.log("Speech Recognition Error:", event.error);
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
      recognition.abort(); // Safely terminates active connection pipeline
    };
  }, []);

  /* -------------------- MIC CONTROLS -------------------- */
  const startMic = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsMicOn(true);
      // Wait for React state lifecycle to catch up before starting recognition
      setTimeout(() => {
        try {
          recognitionRef.current?.start();
        } catch (e) {
          console.log(e);
        }
      }, 100);
    } catch (err) {
      console.log(err);
      alert("Microphone connection channel access blocked.");
    }
  };

  const stopMic = () => {
    setIsMicOn(false);
    try {
      recognitionRef.current?.stop();
    } catch (e) {
      console.log(e);
    }
  };

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
  };

  /* -------------------- SUBMIT ANSWER -------------------- */
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

      setFeedback(result?.data?.feedback || "Answer captured perfectly into dashboard metrics engine.");
    } catch (error) {
      console.log(error);
      alert("Failed to push client feedback stream down server infrastructure layout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* -------------------- NEXT QUESTION -------------------- */
  const handleNext = async () => {
    stopMic(); // Hard cut any active listener instance before swapping questions
    setAnswer("");
    finalTranscriptRef.current = "";
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  /* -------------------- FINISH INTERVIEW -------------------- */
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
      console.log(error);
    }
  };

  /* -------------------- CLEANUP -------------------- */
  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.abort();
      } catch (e) {}
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-3 select-none font-sans">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[620px]">

        {/* LEFT SIDE: AI INTERVIEWER DASHBOARD AVATAR PANEL */}
       <div className="lg:w-[35%] border-r bg-gray-50 p-6 flex flex-col items-center justify-between">
  
  <div className="w-full flex flex-col items-center">
    
    {/* Video Container */}
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
        </div>

        {/* RIGHT SIDE: INTERACTIVE TEXT AREA USER INTERFACE CONTROLS */}
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

          {/* LOWER ACTIONS BUTTON CONTROLS ROW */}
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