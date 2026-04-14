import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send, Bot, User, Camera, Shield, AlertTriangle, Radio, Clock, CheckCircle2 } from "lucide-react";
import { completeStep } from "@/lib/progress";

type Message = { role: "ai" | "user"; text: string; timestamp: string };

const aiQuestions = [
  "Hello! Welcome to your AI interview. Let's begin — can you tell me about yourself and your background?",
  "That's interesting. What was the most challenging project you worked on, and how did you approach solving it?",
  "Great answer. Now, let's do a technical question — how would you design a URL shortener system?",
  "Good thinking. Can you walk me through your approach to debugging a complex production issue?",
  "Final question — where do you see yourself in 5 years, and what skills do you want to develop?",
];

const getTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const speakText = (text: string, onEnd?: () => void) => {
  if (!("speechSynthesis" in window)) { onEnd?.(); return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95; u.pitch = 1; u.lang = "en-US";
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
};

const InterviewRoomV2 = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [started, setStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const chatEnd = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Timer
  useEffect(() => {
    if (!started || interviewComplete) return;
    const t = setInterval(() => setElapsedTime(p => p + 1), 1000);
    return () => clearInterval(t);
  }, [started, interviewComplete]);

  const formatTime = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  // Security
  useEffect(() => {
    if (!started) return;
    const prevent = (e: Event) => e.preventDefault();
    const events = ["copy","paste","cut","contextmenu","dragstart","drop"];
    events.forEach(ev => document.addEventListener(ev, prevent));
    return () => events.forEach(ev => document.removeEventListener(ev, prevent));
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ["c","v","x","a","u","s","p"].includes(e.key.toLowerCase())) { e.preventDefault(); e.stopPropagation(); }
      if (e.key === "F12") e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i","j","c"].includes(e.key.toLowerCase())) e.preventDefault();
      if (e.altKey && e.key === "Tab") e.preventDefault();
      if (e.key === "Escape") e.preventDefault();
    };
    document.addEventListener("keydown", handleKey, true);
    return () => document.removeEventListener("keydown", handleKey, true);
  }, [started]);

  const addViolation = useCallback(() => {
    setViolations(v => {
      const next = v + 1;
      if (next >= 3) {
        completeStep("interview"); completeStep("report"); setInterviewComplete(true);
      } else { setShowWarning(true); setTimeout(() => setShowWarning(false), 4000); }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!started || interviewComplete) return;
    const hv = () => { if (document.hidden) addViolation(); };
    const hb = () => { if (!interviewComplete) addViolation(); };
    document.addEventListener("visibilitychange", hv);
    window.addEventListener("blur", hb);
    return () => { document.removeEventListener("visibilitychange", hv); window.removeEventListener("blur", hb); };
  }, [started, interviewComplete, addViolation]);

  const enterFullscreen = useCallback(async () => {
    try { await document.documentElement.requestFullscreen(); } catch {}
  }, []);

  useEffect(() => {
    if (!started || interviewComplete) return;
    const h = () => { if (!document.fullscreenElement) { addViolation(); setTimeout(() => enterFullscreen(), 500); } };
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, [started, interviewComplete, addViolation, enterFullscreen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) { videoRef.current.srcObject = stream; setCameraReady(true); }
    } catch {}
  };

  const initSpeechRecognition = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return null;
    const r = new SR(); r.continuous = true; r.interimResults = true; r.lang = "en-US"; return r;
  }, []);

  const startInterview = async () => {
    await startCamera(); await enterFullscreen(); setStarted(true);
    const firstQ = aiQuestions[0];
    setMessages([{ role: "ai", text: firstQ, timestamp: getTime() }]);
    setAiSpeaking(true); speakText(firstQ, () => setAiSpeaking(false));
  };

  const toggleMic = () => {
    if (!recording) {
      setRecording(true); setTranscript("");
      const recognition = initSpeechRecognition();
      if (!recognition) { setTranscript("(Speech recognition not supported)"); return; }
      recognitionRef.current = recognition;
      let finalT = "";
      recognition.onresult = (e: any) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) finalT += t + " "; else interim += t;
        }
        setTranscript(finalT + interim);
      };
      recognition.onerror = () => {};
      recognition.start();
    } else {
      setRecording(false);
      if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; }
      if (transcript.trim()) { sendAnswer(transcript.trim()); setTranscript(""); }
    }
  };

  const sendText = () => { if (!textInput.trim()) return; sendAnswer(textInput.trim()); setTextInput(""); };

  const sendAnswer = (text: string) => {
    setMessages(p => [...p, { role: "user", text, timestamp: getTime() }]);
    const nextQ = currentQ + 1;
    if (nextQ < aiQuestions.length) {
      setTimeout(() => {
        const qText = aiQuestions[nextQ];
        setAiSpeaking(true);
        setMessages(p => [...p, { role: "ai", text: qText, timestamp: getTime() }]);
        setCurrentQ(nextQ);
        speakText(qText, () => setAiSpeaking(false));
      }, 1500);
    } else {
      setTimeout(() => {
        completeStep("interview"); completeStep("report"); setInterviewComplete(true);
        const done = "Thank you for completing the interview! Your responses have been recorded.";
        setMessages(p => [...p, { role: "ai", text: done, timestamp: getTime() }]);
        speakText(done);
        if (document.fullscreenElement) document.exitFullscreen();
        if (window.opener) window.opener.postMessage({ type: "interview-complete" }, "*");
      }, 1500);
    }
  };

  // ── V2: Blue-White Theme Pre-start ──
  if (!started) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8" style={{ background: "linear-gradient(135deg, #EBF4FF 0%, #DBEAFE 30%, #BFDBFE 60%, #93C5FD 100%)" }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="text-center max-w-xl">
          <motion.div className="w-32 h-32 rounded-3xl mx-auto flex items-center justify-center mb-8 relative"
            style={{ background: "linear-gradient(135deg, #2563EB, #3B82F6, #60A5FA)" }}
            animate={{ rotateY: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
            <Bot className="w-16 h-16 text-white" />
            <motion.div className="absolute -inset-2 rounded-3xl border-2 border-blue-400/40"
              animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0, 0.6] }} transition={{ repeat: Infinity, duration: 2.5 }} />
          </motion.div>

          <h1 className="text-4xl font-bold mb-3 tracking-tight" style={{ fontFamily: "var(--font-heading)", color: "#1E3A5F" }}>
            AI Voice Interview
          </h1>
          <p className="text-blue-700/70 mb-8 text-lg">Secure proctored interview experience with real-time AI conversation</p>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 mb-8 text-left shadow-xl shadow-blue-200/50 border border-blue-100">
            <h3 className="font-semibold flex items-center gap-2 mb-4" style={{ color: "#1E3A5F" }}>
              <Shield className="w-5 h-5 text-blue-600" /> Interview Protocol
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🔒", text: "Fullscreen enforced" },
                { icon: "👁️", text: "Tab monitoring active" },
                { icon: "🚫", text: "Copy/Paste blocked" },
                { icon: "📷", text: "Camera proctoring" },
                { icon: "⌨️", text: "Shortcuts disabled" },
                { icon: "⚡", text: "One attempt only" },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                  className="flex items-center gap-2 text-sm text-blue-800/70 bg-blue-50/80 rounded-xl px-3 py-2.5">
                  <span>{item.icon}</span> {item.text}
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={startInterview} className="rounded-2xl px-12 h-14 text-base font-bold gap-3 shadow-lg shadow-blue-400/30"
              style={{ background: "linear-gradient(135deg, #2563EB, #3B82F6)", color: "white" }}>
              <Camera className="w-5 h-5" /> Begin Interview
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ── V2: Blue-White Main Interview ──
  return (
    <div className="flex h-screen overflow-hidden select-none" style={{ userSelect: "none", WebkitUserSelect: "none", background: "#F0F7FF" }}>
      {/* Warning */}
      <AnimatePresence>
        {showWarning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md" style={{ background: "rgba(239,68,68,0.15)" }}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              className="bg-white border-2 border-red-400 rounded-3xl p-8 text-center max-w-md shadow-2xl">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-600 mb-2" style={{ fontFamily: "var(--font-heading)" }}>Security Violation!</h2>
              <p className="text-gray-600">Warning {violations}/3 — Interview terminates at 3 violations</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT Panel */}
      <div className="w-[45%] flex flex-col border-r" style={{ borderColor: "#DBEAFE", background: "linear-gradient(180deg, #EFF6FF, #DBEAFE)" }}>
        {/* Header */}
        <div className="h-16 px-6 flex items-center justify-between" style={{ background: "linear-gradient(90deg, #2563EB, #3B82F6)", color: "white" }}>
          <div className="flex items-center gap-3">
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-bold tracking-wide">LIVE SESSION</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs bg-white/20 rounded-full px-3 py-1">
              <Clock className="w-3.5 h-3.5" /> {formatTime(elapsedTime)}
            </div>
            <span className="text-xs bg-white/20 rounded-full px-3 py-1">Q{currentQ + 1}/{aiQuestions.length}</span>
          </div>
        </div>

        {/* AI Avatar Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <motion.div className="relative mb-8">
            <motion.div className="w-40 h-40 rounded-full flex items-center justify-center"
              style={{ background: aiSpeaking ? "linear-gradient(135deg, #2563EB, #60A5FA)" : "linear-gradient(135deg, #3B82F6, #93C5FD)" }}
              animate={aiSpeaking ? { scale: [1, 1.06, 1] } : {}} transition={{ repeat: aiSpeaking ? Infinity : 0, duration: 0.8 }}>
              <Bot className="w-20 h-20 text-white" />
            </motion.div>
            {aiSpeaking && (
              <>
                <motion.div className="absolute -inset-3 rounded-full border-2 border-blue-400/50"
                  animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0, 0.7] }} transition={{ repeat: Infinity, duration: 1.2 }} />
                <motion.div className="absolute -inset-6 rounded-full border border-blue-300/30"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 1.6, delay: 0.2 }} />
              </>
            )}
          </motion.div>

          <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-heading)", color: "#1E3A5F" }}>AI Interviewer</h3>
          <p className="text-sm mb-6" style={{ color: "#6B8AB5" }}>
            {aiSpeaking ? "🔊 Speaking..." : interviewComplete ? "✅ Complete" : "🎤 Awaiting response..."}
          </p>

          {aiSpeaking && (
            <div className="flex items-end gap-1 h-10">
              {[...Array(12)].map((_, i) => (
                <motion.div key={i} className="w-1.5 rounded-full" style={{ background: "#3B82F6" }}
                  animate={{ height: [4, 32 + Math.random() * 16, 4] }}
                  transition={{ repeat: Infinity, duration: 0.4 + Math.random() * 0.3, delay: i * 0.06 }} />
              ))}
            </div>
          )}
        </div>

        {/* Camera */}
        <div className="p-5">
          <div className="relative rounded-2xl overflow-hidden border-2 border-blue-200 aspect-video max-h-44 shadow-lg shadow-blue-100/50" style={{ background: "#E0ECFF" }}>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            {!cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: "#E0ECFF" }}>
                <Camera className="w-8 h-8 text-blue-400" />
              </div>
            )}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-semibold text-blue-900">You</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Transcript */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="h-16 px-6 flex items-center justify-between border-b border-blue-100">
          <h2 className="font-bold text-lg" style={{ fontFamily: "var(--font-heading)", color: "#1E3A5F" }}>Conversation</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ background: "#EFF6FF", color: "#2563EB" }}>
              {messages.length} messages
            </span>
            {violations > 0 && (
              <span className="text-xs px-3 py-1.5 rounded-full font-semibold bg-red-50 text-red-600">
                ⚠ {violations}/3
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-5">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "ai" && (
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-md"
                    style={{ background: "linear-gradient(135deg, #2563EB, #3B82F6)" }}>
                    <Bot className="w-4.5 h-4.5 text-white" />
                  </div>
                )}
                <div className="max-w-[80%]">
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === "ai"
                      ? "bg-blue-50 border border-blue-100 text-blue-900 rounded-tl-md"
                      : "text-white rounded-tr-md"
                  }`} style={msg.role === "user" ? { background: "linear-gradient(135deg, #2563EB, #3B82F6)" } : {}}>
                    {msg.text}
                  </div>
                  <p className={`text-[10px] mt-1 ${msg.role === "user" ? "text-right text-blue-400" : "text-blue-400"}`}>
                    {msg.role === "ai" ? "AI Interviewer" : "You"} · {msg.timestamp}
                  </p>
                </div>
                {msg.role === "user" && (
                  <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4.5 h-4.5 text-blue-700" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatEnd} />
        </div>

        {/* Live transcript */}
        {recording && transcript && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            className="mx-5 mb-2 p-3 rounded-xl border text-sm" style={{ background: "#EFF6FF", borderColor: "#BFDBFE", color: "#1E40AF" }}>
            <div className="flex items-center gap-2 mb-1">
              {[...Array(3)].map((_, i) => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500"
                  animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }} />
              ))}
              <span className="text-xs text-blue-600 font-semibold">🎙️ Listening...</span>
            </div>
            {transcript}
          </motion.div>
        )}

        {/* Input */}
        {!interviewComplete ? (
          <div className="p-5 border-t border-blue-100">
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={toggleMic} size="icon"
                  className={`w-12 h-12 rounded-xl shadow-md ${recording
                    ? "bg-red-500 text-white shadow-red-200 animate-pulse"
                    : "text-white shadow-blue-200"}`}
                  style={!recording ? { background: "linear-gradient(135deg, #2563EB, #3B82F6)" } : {}}>
                  {recording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
              </motion.div>
              <input type="text" value={textInput} onChange={e => setTextInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendText()}
                placeholder="Type your answer..."
                className="flex-1 h-12 px-4 rounded-xl border text-sm outline-none transition-all"
                style={{ borderColor: "#DBEAFE", background: "#F8FBFF", color: "#1E3A5F" }}
                onFocus={e => e.target.style.borderColor = "#3B82F6"}
                onBlur={e => e.target.style.borderColor = "#DBEAFE"}
                onPaste={e => e.preventDefault()} autoComplete="off" />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={sendText} size="icon" className="w-12 h-12 rounded-xl text-white shadow-md shadow-blue-200"
                  style={{ background: "linear-gradient(135deg, #2563EB, #3B82F6)" }}>
                  <Send className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
            {recording && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 mt-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-medium text-red-500">Recording — Click mic to stop & send</span>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="p-6 border-t border-blue-100 text-center">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
              <p className="text-sm text-blue-700/70">Interview complete! You may close this window.</p>
              <Button onClick={() => window.close()} className="rounded-xl px-8 h-11 text-white shadow-md"
                style={{ background: "linear-gradient(135deg, #2563EB, #3B82F6)" }}>
                Close Window
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewRoomV2;
