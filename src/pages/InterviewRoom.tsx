import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send, Bot, User, Camera, Shield, AlertTriangle } from "lucide-react";
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

// AI speaks the question aloud using SpeechSynthesis
const speakText = (text: string, onEnd?: () => void) => {
  if (!("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.lang = "en-US";
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
};

const InterviewRoom = () => {
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

  const chatEnd = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Security: prevent copy/paste/cut ──
  useEffect(() => {
    if (!started) return;
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener("copy", prevent);
    document.addEventListener("paste", prevent);
    document.addEventListener("cut", prevent);
    return () => {
      document.removeEventListener("copy", prevent);
      document.removeEventListener("paste", prevent);
      document.removeEventListener("cut", prevent);
    };
  }, [started]);

  // ── Security: right-click ──
  useEffect(() => {
    if (!started) return;
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    return () => document.removeEventListener("contextmenu", prevent);
  }, [started]);

  // ── Security: keyboard shortcuts (Ctrl+C/V/A, Alt+Tab, F12, etc.) ──
  useEffect(() => {
    if (!started) return;
    const handleKey = (e: KeyboardEvent) => {
      // Block Ctrl/Cmd + C, V, X, A, U, S, P, Shift+I
      if ((e.ctrlKey || e.metaKey) && ["c", "v", "x", "a", "u", "s", "p"].includes(e.key.toLowerCase())) {
        e.preventDefault();
        e.stopPropagation();
      }
      // Block F12, Ctrl+Shift+I/J/C
      if (e.key === "F12") { e.preventDefault(); }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      // Block Alt+Tab (best effort – browser limits this)
      if (e.altKey && e.key === "Tab") { e.preventDefault(); }
      // Block Escape from exiting fullscreen
      if (e.key === "Escape") { e.preventDefault(); }
    };
    document.addEventListener("keydown", handleKey, true);
    return () => document.removeEventListener("keydown", handleKey, true);
  }, [started]);

  // ── Security: detect tab switch / blur ──
  useEffect(() => {
    if (!started || interviewComplete) return;
    const handleVisibility = () => {
      if (document.hidden) {
        setViolations((v) => {
          const next = v + 1;
          if (next >= 3) {
            completeStep("interview");
            completeStep("report");
            setInterviewComplete(true);
          } else {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 4000);
          }
          return next;
        });
      }
    };
    const handleBlur = () => {
      if (!interviewComplete) {
        setViolations((v) => {
          const next = v + 1;
          if (next >= 3) {
            completeStep("interview");
            completeStep("report");
            setInterviewComplete(true);
          } else {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 4000);
          }
          return next;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
    };
  }, [started, interviewComplete]);

  // ── Security: prevent drag ──
  useEffect(() => {
    if (!started) return;
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener("dragstart", prevent);
    document.addEventListener("drop", prevent);
    return () => {
      document.removeEventListener("dragstart", prevent);
      document.removeEventListener("drop", prevent);
    };
  }, [started]);

  // ── Fullscreen management ──
  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!started || interviewComplete) return;
    const handleFsChange = () => {
      if (!document.fullscreenElement) {
        setViolations((v) => {
          const next = v + 1;
          if (next >= 3) {
            completeStep("interview");
            completeStep("report");
            setInterviewComplete(true);
          } else {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 4000);
            setTimeout(() => enterFullscreen(), 500);
          }
          return next;
        });
      }
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, [started, interviewComplete, enterFullscreen]);

  // ── Camera setup ──
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraReady(true);
      }
    } catch { /* camera denied */ }
  };

  // ── Web Speech API setup ──
  const initSpeechRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    return recognition;
  }, []);

  // ── Start interview ──
  const startInterview = async () => {
    await startCamera();
    await enterFullscreen();
    setStarted(true);
    const firstQ = aiQuestions[0];
    setMessages([{ role: "ai", text: firstQ, timestamp: getTime() }]);
    setAiSpeaking(true);
    speakText(firstQ, () => setAiSpeaking(false));
  };

  // ── Toggle mic with real Web Speech API ──
  const toggleMic = () => {
    if (!recording) {
      setRecording(true);
      setTranscript("");
      const recognition = initSpeechRecognition();
      if (!recognition) {
        // Fallback: fake transcript for browsers without Web Speech API
        setTranscript("(Speech recognition not supported in this browser)");
        return;
      }
      recognitionRef.current = recognition;
      let finalTranscript = "";
      recognition.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += t + " ";
          } else {
            interim += t;
          }
        }
        setTranscript(finalTranscript + interim);
      };
      recognition.onerror = () => { /* ignore errors */ };
      recognition.start();
    } else {
      setRecording(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      if (transcript.trim()) {
        sendAnswer(transcript.trim());
        setTranscript("");
      }
    }
  };

  const sendText = () => {
    if (!textInput.trim()) return;
    sendAnswer(textInput.trim());
    setTextInput("");
  };

  const sendAnswer = (text: string) => {
    setMessages((prev) => [...prev, { role: "user", text, timestamp: getTime() }]);
    const nextQ = currentQ + 1;
    if (nextQ < aiQuestions.length) {
      setTimeout(() => {
        const qText = aiQuestions[nextQ];
        setAiSpeaking(true);
        setMessages((prev) => [...prev, { role: "ai", text: qText, timestamp: getTime() }]);
        setCurrentQ(nextQ);
        speakText(qText, () => setAiSpeaking(false));
      }, 1500);
    } else {
      setTimeout(() => {
        completeStep("interview");
        completeStep("report");
        setInterviewComplete(true);
        const doneText = "Thank you for completing the interview! Your responses have been recorded. You may close this window now.";
        setMessages((prev) => [...prev, { role: "ai", text: doneText, timestamp: getTime() }]);
        speakText(doneText);
        if (document.fullscreenElement) document.exitFullscreen();
        // Notify opener window
        if (window.opener) {
          window.opener.postMessage({ type: "interview-complete" }, "*");
        }
      }, 1500);
    }
  };

  // ── Pre-start screen ──
  if (!started) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg">
          <div className="w-28 h-28 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-6 relative">
            <Bot className="w-14 h-14 text-primary" />
            <motion.div className="absolute inset-0 rounded-full border-2 border-primary/30" animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} />
          </div>
          <h2 className="font-heading text-3xl font-bold mb-3 text-foreground">AI Voice Interview</h2>
          <p className="text-muted-foreground mb-4">Your secure interview session is ready. Camera, microphone, and fullscreen will be activated.</p>

          <div className="bg-card border border-border rounded-2xl p-5 mb-6 text-left space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Security Rules</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2"><span className="text-destructive font-bold">•</span> Fullscreen mode — do not exit</li>
              <li className="flex items-start gap-2"><span className="text-destructive font-bold">•</span> Tab switching monitored — 3 violations = termination</li>
              <li className="flex items-start gap-2"><span className="text-destructive font-bold">•</span> Copy/Paste/Right-click disabled</li>
              <li className="flex items-start gap-2"><span className="text-destructive font-bold">•</span> Keyboard shortcuts blocked</li>
              <li className="flex items-start gap-2"><span className="text-destructive font-bold">•</span> Camera must remain on</li>
            </ul>
          </div>

          <Button onClick={startInterview} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-10 h-13 text-base font-semibold gap-2">
            <Camera className="w-5 h-5" /> Begin Interview
          </Button>
        </motion.div>
      </div>
    );
  }

  // ── Main interview UI ──
  return (
    <div ref={containerRef} className="flex h-screen bg-background overflow-hidden select-none" style={{ userSelect: "none", WebkitUserSelect: "none" }}>
      {/* Warning overlay */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-destructive/20 flex items-center justify-center backdrop-blur-sm"
          >
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-card border-2 border-destructive rounded-2xl p-8 text-center max-w-md">
              <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-destructive mb-2">⚠ Security Violation!</h2>
              <p className="text-muted-foreground">Warning {violations}/3 — Interview will be terminated after 3 violations.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT: Camera + AI Avatar */}
      <div className="w-1/2 flex flex-col bg-muted/20 border-r border-border">
        <div className="h-14 px-5 flex items-center justify-between border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-sm font-semibold text-foreground">LIVE INTERVIEW</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Q {currentQ + 1}/{aiQuestions.length}</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5 text-primary" /> Proctored
            </div>
          </div>
        </div>

        {/* AI Avatar */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div
            className={`w-36 h-36 rounded-full flex items-center justify-center mb-6 relative ${aiSpeaking ? "bg-primary" : "bg-primary/80"}`}
            animate={aiSpeaking ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: aiSpeaking ? Infinity : 0, duration: 0.8 }}
          >
            <Bot className="w-18 h-18 text-primary-foreground" />
            {aiSpeaking && (
              <>
                <motion.div className="absolute inset-0 rounded-full border-2 border-primary/40" animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }} transition={{ repeat: Infinity, duration: 1.2 }} />
                <motion.div className="absolute inset-0 rounded-full border border-primary/20" animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }} />
              </>
            )}
          </motion.div>
          <p className="font-heading text-lg font-semibold text-foreground">AI Interviewer</p>
          <p className="text-sm text-muted-foreground mt-1">
            {aiSpeaking ? "🔊 Speaking..." : interviewComplete ? "✅ Interview Complete" : "🎤 Listening..."}
          </p>
          {aiSpeaking && (
            <div className="flex items-end gap-1 mt-4 h-8">
              {[...Array(9)].map((_, i) => (
                <motion.div key={i} className="w-1.5 bg-primary rounded-full" animate={{ height: [6, 28 + Math.random() * 16, 6] }} transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.4, delay: i * 0.08 }} />
              ))}
            </div>
          )}
        </div>

        {/* Camera PiP */}
        <div className="p-4">
          <div className="relative rounded-2xl overflow-hidden border-2 border-border bg-muted aspect-video max-h-48">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            {!cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-card/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-xs font-medium text-foreground">You</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Chat Transcript */}
      <div className="w-1/2 flex flex-col bg-card">
        <div className="h-14 px-5 flex items-center justify-between border-b border-border">
          <h2 className="font-heading font-semibold text-foreground">Interview Transcript</h2>
          <span className="text-xs px-3 py-1 rounded-full bg-accent text-accent-foreground font-medium">{messages.length} messages</span>
        </div>

        <div className="flex-1 overflow-auto p-5 space-y-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div className="max-w-[80%]">
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "ai" ? "bg-muted/80 border border-border text-foreground rounded-tl-md" : "bg-primary text-primary-foreground rounded-tr-md"
                  }`}>{msg.text}</div>
                  <p className={`text-[10px] text-muted-foreground mt-1 ${msg.role === "user" ? "text-right" : ""}`}>
                    {msg.role === "ai" ? "AI Interviewer" : "You"} · {msg.timestamp}
                  </p>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-secondary-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatEnd} />
        </div>

        {/* Live transcript */}
        {recording && transcript && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mx-5 mb-2 p-3 bg-accent/60 rounded-xl border border-primary/20 text-sm text-foreground">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }} />
                ))}
              </div>
              <span className="text-xs text-primary font-semibold">🎙️ Listening...</span>
            </div>
            {transcript}
          </motion.div>
        )}

        {/* Input */}
        {!interviewComplete ? (
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <Button onClick={toggleMic}
                className={`w-12 h-12 rounded-full flex-shrink-0 ${recording
                  ? "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30 animate-pulse"
                  : "bg-primary text-primary-foreground"}`}
                size="icon">
                {recording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
              <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendText()}
                placeholder="Or type your answer..."
                className="flex-1 h-12 px-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-ring"
                onPaste={(e) => e.preventDefault()} autoComplete="off" />
              <Button onClick={sendText} size="icon" className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex-shrink-0">
                <Send className="w-5 h-5" />
              </Button>
            </div>
            {recording && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 mt-3">
                <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                <span className="text-xs font-medium text-destructive">Recording — Click mic to stop & send</span>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="p-5 border-t border-border text-center">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-sm text-muted-foreground mb-3">Interview complete! You may close this window.</p>
              <Button onClick={() => window.close()} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 h-11">
                Close Window
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewRoom;
