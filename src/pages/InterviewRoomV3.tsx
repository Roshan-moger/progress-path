import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send, Bot, User, Camera, Shield, AlertTriangle, Zap, Clock, Sparkles } from "lucide-react";
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

const InterviewRoomV3 = () => {
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

  // ── V3: Orange Futuristic Pre-start ──
  if (!started) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8 relative overflow-hidden" style={{ background: "#0A0A0F" }}>
        {/* Animated bg elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div className="absolute w-[600px] h-[600px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, #F97316, transparent 70%)", top: "-200px", right: "-100px" }}
            animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }} transition={{ repeat: Infinity, duration: 8 }} />
          <motion.div className="absolute w-[400px] h-[400px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #FB923C, transparent 70%)", bottom: "-100px", left: "-50px" }}
            animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 6, delay: 1 }} />
          {/* Grid lines */}
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(249,115,22,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.05) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-xl relative z-10">
          {/* AI Head */}
          <motion.div className="w-36 h-36 mx-auto flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(from 0deg, #F97316, #FB923C, #FDBA74, #F97316)" }}>
              <motion.div className="absolute inset-0 rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} style={{ background: "conic-gradient(from 0deg, transparent, #F97316, transparent)" }} />
            </div>
            <div className="absolute inset-[3px] rounded-full flex items-center justify-center" style={{ background: "#0A0A0F" }}>
              <Bot className="w-16 h-16 text-orange-400" />
            </div>
            <motion.div className="absolute -inset-4 rounded-full border border-orange-500/20"
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-orange-400">Neural Interview Engine</span>
              <Sparkles className="w-5 h-5 text-orange-400" />
            </div>
            <h1 className="text-5xl font-black mb-3 tracking-tight" style={{ fontFamily: "var(--font-heading)", background: "linear-gradient(135deg, #FFFFFF, #F97316, #FB923C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              AI INTERVIEW
            </h1>
            <p className="text-white/50 mb-8 text-base">Next-gen voice intelligence powered by neural networks</p>
          </motion.div>

          <div className="rounded-2xl p-6 mb-8 text-left border" style={{ background: "rgba(249,115,22,0.05)", borderColor: "rgba(249,115,22,0.15)" }}>
            <h3 className="font-bold flex items-center gap-2 mb-4 text-orange-400">
              <Shield className="w-5 h-5" /> Security Matrix
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: "🔐", text: "Fullscreen Lock" },
                { icon: "👁️", text: "Tab Monitor" },
                { icon: "🚫", text: "Copy Block" },
                { icon: "📷", text: "Camera AI" },
                { icon: "⌨️", text: "Key Guard" },
                { icon: "⚡", text: "Single Use" },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * i }}
                  className="flex items-center gap-2 text-xs text-white/60 rounded-lg px-3 py-2.5 border"
                  style={{ background: "rgba(249,115,22,0.08)", borderColor: "rgba(249,115,22,0.1)" }}>
                  <span>{item.icon}</span> {item.text}
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button onClick={startInterview} className="rounded-xl px-14 h-14 text-base font-black gap-3 border-0 shadow-lg shadow-orange-500/30"
              style={{ background: "linear-gradient(135deg, #EA580C, #F97316, #FB923C)", color: "white" }}>
              <Zap className="w-5 h-5" /> LAUNCH INTERVIEW
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ── V3: Main Interview ──
  return (
    <div className="flex h-screen overflow-hidden select-none" style={{ userSelect: "none", WebkitUserSelect: "none", background: "#0A0A0F" }}>
      {/* Warning */}
      <AnimatePresence>
        {showWarning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md" style={{ background: "rgba(239,68,68,0.2)" }}>
            <motion.div initial={{ scale: 0.8, rotate: -5 }} animate={{ scale: 1, rotate: 0 }}
              className="rounded-2xl p-8 text-center max-w-md border-2 border-red-500" style={{ background: "#1A0A0A" }}>
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-red-500 mb-2" style={{ fontFamily: "var(--font-heading)" }}>VIOLATION DETECTED</h2>
              <p className="text-white/60">Warning {violations}/3 — System will terminate at 3</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT Panel */}
      <div className="w-[45%] flex flex-col border-r" style={{ borderColor: "rgba(249,115,22,0.15)", background: "linear-gradient(180deg, #0F0F18, #0A0A0F)" }}>
        {/* Header */}
        <div className="h-16 px-6 flex items-center justify-between" style={{ background: "linear-gradient(90deg, rgba(249,115,22,0.15), rgba(249,115,22,0.05))", borderBottom: "1px solid rgba(249,115,22,0.1)" }}>
          <div className="flex items-center gap-3">
            <motion.div className="w-2.5 h-2.5 rounded-full bg-red-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1 }} />
            <span className="text-xs font-black tracking-[0.2em] text-orange-400">LIVE</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-white/50 rounded-lg px-3 py-1" style={{ background: "rgba(249,115,22,0.1)" }}>
              <Clock className="w-3.5 h-3.5 text-orange-400" /> {formatTime(elapsedTime)}
            </div>
            <span className="text-xs text-orange-400 font-bold">Q{currentQ + 1}/{aiQuestions.length}</span>
          </div>
        </div>

        {/* AI Avatar */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
          {/* BG glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div className="w-72 h-72 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #F97316, transparent 70%)" }}
              animate={aiSpeaking ? { scale: [1, 1.3, 1] } : {}} transition={{ repeat: Infinity, duration: 1.5 }} />
          </div>

          <motion.div className="relative mb-8 z-10">
            <motion.div className="w-44 h-44 rounded-full flex items-center justify-center relative"
              animate={aiSpeaking ? { scale: [1, 1.05, 1] } : {}} transition={{ repeat: aiSpeaking ? Infinity : 0, duration: 0.8 }}>
              <div className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(from 0deg, #EA580C, #F97316, #FDBA74, #EA580C)", padding: "3px" }}>
                <motion.div className="absolute inset-0 rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  style={{ background: "conic-gradient(from 0deg, transparent 30%, rgba(249,115,22,0.6), transparent 70%)" }} />
              </div>
              <div className="absolute inset-[3px] rounded-full flex items-center justify-center" style={{ background: "#0F0F18" }}>
                <Bot className="w-20 h-20 text-orange-400" />
              </div>
            </motion.div>
            {aiSpeaking && (
              <motion.div className="absolute -inset-6 rounded-full border border-orange-500/30"
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }} transition={{ repeat: Infinity, duration: 1.2 }} />
            )}
          </motion.div>

          <h3 className="text-xl font-black mb-1 z-10" style={{ fontFamily: "var(--font-heading)", color: "#F97316" }}>Neural Interviewer</h3>
          <p className="text-sm z-10 text-white/40">
            {aiSpeaking ? "🔊 Processing..." : interviewComplete ? "✅ Complete" : "🎤 Awaiting input..."}
          </p>

          {aiSpeaking && (
            <div className="flex items-end gap-[3px] mt-6 h-12 z-10">
              {[...Array(16)].map((_, i) => (
                <motion.div key={i} className="w-1 rounded-full"
                  style={{ background: `linear-gradient(to top, #EA580C, #FB923C)` }}
                  animate={{ height: [3, 36 + Math.random() * 20, 3] }}
                  transition={{ repeat: Infinity, duration: 0.3 + Math.random() * 0.4, delay: i * 0.04 }} />
              ))}
            </div>
          )}
        </div>

        {/* Camera */}
        <div className="p-5">
          <div className="relative rounded-xl overflow-hidden border aspect-video max-h-44" style={{ borderColor: "rgba(249,115,22,0.2)", background: "#111118" }}>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            {!cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: "#111118" }}>
                <Camera className="w-8 h-8 text-orange-500/40" />
              </div>
            )}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.7)" }}>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-white/80">CAM</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Transcript */}
      <div className="flex-1 flex flex-col" style={{ background: "#0D0D14" }}>
        <div className="h-16 px-6 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(249,115,22,0.1)" }}>
          <h2 className="font-black text-lg text-white/90" style={{ fontFamily: "var(--font-heading)" }}>Transcript</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-lg font-bold" style={{ background: "rgba(249,115,22,0.1)", color: "#F97316" }}>
              {messages.length} msgs
            </span>
            {violations > 0 && (
              <span className="text-xs px-3 py-1.5 rounded-lg font-bold bg-red-500/10 text-red-400">⚠ {violations}/3</span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-5">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "ai" && (
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ background: "linear-gradient(135deg, #EA580C, #F97316)" }}>
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="max-w-[80%]">
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "ai" ? "rounded-tl-sm" : "rounded-tr-sm"
                  }`} style={msg.role === "ai"
                    ? { background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.12)", color: "rgba(255,255,255,0.85)" }
                    : { background: "linear-gradient(135deg, #EA580C, #F97316)", color: "white" }}>
                    {msg.text}
                  </div>
                  <p className={`text-[10px] mt-1 text-white/30 ${msg.role === "user" ? "text-right" : ""}`}>
                    {msg.role === "ai" ? "AI" : "You"} · {msg.timestamp}
                  </p>
                </div>
                {msg.role === "user" && (
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-1" style={{ background: "rgba(249,115,22,0.15)" }}>
                    <User className="w-4 h-4 text-orange-400" />
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
            className="mx-5 mb-2 p-3 rounded-xl border text-sm" style={{ background: "rgba(249,115,22,0.05)", borderColor: "rgba(249,115,22,0.15)", color: "#FB923C" }}>
            <div className="flex items-center gap-2 mb-1">
              {[...Array(3)].map((_, i) => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-500"
                  animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }} />
              ))}
              <span className="text-xs text-orange-400 font-bold">🎙️ Capturing...</span>
            </div>
            {transcript}
          </motion.div>
        )}

        {/* Input */}
        {!interviewComplete ? (
          <div className="p-5" style={{ borderTop: "1px solid rgba(249,115,22,0.1)" }}>
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={toggleMic} size="icon"
                  className={`w-12 h-12 rounded-xl border-0 ${recording ? "animate-pulse" : ""}`}
                  style={recording
                    ? { background: "#EF4444", color: "white", boxShadow: "0 0 20px rgba(239,68,68,0.4)" }
                    : { background: "linear-gradient(135deg, #EA580C, #F97316)", color: "white", boxShadow: "0 0 20px rgba(249,115,22,0.3)" }}>
                  {recording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
              </motion.div>
              <input type="text" value={textInput} onChange={e => setTextInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendText()}
                placeholder="Type response..."
                className="flex-1 h-12 px-4 rounded-xl text-sm outline-none border"
                style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(249,115,22,0.15)", color: "white" }}
                onPaste={e => e.preventDefault()} autoComplete="off" />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={sendText} size="icon" className="w-12 h-12 rounded-xl border-0"
                  style={{ background: "linear-gradient(135deg, #EA580C, #F97316)", color: "white", boxShadow: "0 0 15px rgba(249,115,22,0.3)" }}>
                  <Send className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
            {recording && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 mt-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold text-red-400">REC — Click to stop & send</span>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center" style={{ borderTop: "1px solid rgba(249,115,22,0.1)" }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3">
              <Sparkles className="w-10 h-10 text-orange-400" />
              <p className="text-sm text-white/50">Interview complete. Close this window.</p>
              <Button onClick={() => window.close()} className="rounded-xl px-8 h-11 border-0 font-bold"
                style={{ background: "linear-gradient(135deg, #EA580C, #F97316)", color: "white" }}>
                Close Window
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewRoomV3;
