import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "@/components/StudentSidebar";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send, Bot, User, Lock, Camera, Shield, Maximize, AlertTriangle, Video } from "lucide-react";
import { isStepUnlocked, isStepCompleted, completeStep } from "@/lib/progress";
import { useToast } from "@/hooks/use-toast";

type Message = { role: "ai" | "user"; text: string; timestamp: string };

const aiQuestions = [
  "Hello! Welcome to your AI interview. Let's begin — can you tell me about yourself and your background?",
  "That's interesting. What was the most challenging project you worked on, and how did you approach solving it?",
  "Great answer. Now, let's do a technical question — how would you design a URL shortener system?",
  "Good thinking. Can you walk me through your approach to debugging a complex production issue?",
  "Final question — where do you see yourself in 5 years, and what skills do you want to develop?",
];

const getTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const StudentInterview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const unlocked = isStepUnlocked("interview");
  const alreadyDone = isStepCompleted("interview");

  const [started, setStarted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const [interviewComplete, setInterviewComplete] = useState(alreadyDone);
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Security: prevent copy/paste/cut
  useEffect(() => {
    if (!started) return;
    const prevent = (e: Event) => {
      e.preventDefault();
      toast({ title: "⚠️ Action Blocked", description: "Copy/Paste is disabled during the interview.", variant: "destructive" });
    };
    document.addEventListener("copy", prevent);
    document.addEventListener("paste", prevent);
    document.addEventListener("cut", prevent);
    return () => {
      document.removeEventListener("copy", prevent);
      document.removeEventListener("paste", prevent);
      document.removeEventListener("cut", prevent);
    };
  }, [started, toast]);

  // Security: detect tab switch / visibility change
  useEffect(() => {
    if (!started || interviewComplete) return;
    const handleVisibility = () => {
      if (document.hidden) {
        setViolations((v) => {
          const next = v + 1;
          if (next >= 3) {
            toast({ title: "🚫 Interview Terminated", description: "Too many tab switches detected. Interview ended.", variant: "destructive" });
            completeStep("interview");
            completeStep("report");
            setInterviewComplete(true);
          } else {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 4000);
            toast({ title: `⚠️ Warning ${next}/3`, description: "Switching tabs is not allowed. Your interview will be terminated after 3 violations.", variant: "destructive" });
          }
          return next;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [started, interviewComplete, toast]);

  // Security: prevent right-click
  useEffect(() => {
    if (!started) return;
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    return () => document.removeEventListener("contextmenu", prevent);
  }, [started]);

  // Fullscreen
  const enterFullscreen = useCallback(async () => {
    try {
      if (containerRef.current) {
        await containerRef.current.requestFullscreen();
        setFullscreen(true);
      }
    } catch {
      toast({ title: "Fullscreen required", description: "Please allow fullscreen for the interview.", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement && started && !interviewComplete) {
        setFullscreen(false);
        setViolations((v) => {
          const next = v + 1;
          if (next >= 3) {
            toast({ title: "🚫 Interview Terminated", description: "Exited fullscreen too many times.", variant: "destructive" });
            completeStep("interview");
            completeStep("report");
            setInterviewComplete(true);
          } else {
            toast({ title: `⚠️ Fullscreen Warning ${next}/3`, description: "Please stay in fullscreen mode.", variant: "destructive" });
            setTimeout(() => enterFullscreen(), 1000);
          }
          return next;
        });
      }
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, [started, interviewComplete, toast, enterFullscreen]);

  // Camera setup
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraReady(true);
      }
    } catch {
      toast({ title: "Camera Required", description: "Please allow camera and microphone access.", variant: "destructive" });
    }
  };

  // Locked state
  if (!unlocked) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <StudentSidebar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Lock className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-semibold text-muted-foreground mb-2">Interview Locked</h2>
            <p className="text-muted-foreground">Complete all test sections first to unlock the AI interview.</p>
          </div>
        </main>
      </div>
    );
  }

  // Already completed
  if (interviewComplete && !started) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <StudentSidebar />
        <main className="flex-1 flex items-center justify-center p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
            <div className="w-24 h-24 rounded-full bg-success/10 mx-auto flex items-center justify-center mb-6">
              <Bot className="w-12 h-12 text-success" />
            </div>
            <h2 className="font-heading text-2xl font-semibold mb-2">Interview Completed</h2>
            <p className="text-muted-foreground mb-6">You have already completed your AI interview. View your results in the report.</p>
            <Button onClick={() => navigate("/student/report")} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 h-12">
              View Report →
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  const startInterview = async () => {
    await startCamera();
    await enterFullscreen();
    setStarted(true);
    setMessages([{ role: "ai", text: aiQuestions[0], timestamp: getTime() }]);
    setAiSpeaking(true);
    setTimeout(() => setAiSpeaking(false), 3000);
  };

  const toggleMic = () => {
    if (!recording) {
      setRecording(true);
      setTranscript("");
      const words = "I have a strong background in Computer Science with hands-on experience in React, Python, and system design. I've worked on multiple full-stack projects.".split(" ");
      let i = 0;
      const interval = setInterval(() => {
        if (i < words.length) {
          setTranscript((prev) => (prev ? prev + " " : "") + words[i]);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 180);
    } else {
      setRecording(false);
      if (transcript) {
        sendAnswer(transcript);
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
        setAiSpeaking(true);
        setMessages((prev) => [...prev, { role: "ai", text: aiQuestions[nextQ], timestamp: getTime() }]);
        setCurrentQ(nextQ);
        setTimeout(() => setAiSpeaking(false), 3000);
      }, 1500);
    } else {
      setTimeout(() => {
        completeStep("interview");
        completeStep("report");
        setInterviewComplete(true);
        setMessages((prev) => [...prev, { role: "ai", text: "Thank you for completing the interview! Your responses have been recorded. You may now exit fullscreen and view your report.", timestamp: getTime() }]);
        if (document.fullscreenElement) document.exitFullscreen();
      }, 1500);
    }
  };

  // Pre-start screen
  if (!started) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <StudentSidebar />
        <main className="flex-1 flex items-center justify-center p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg">
            <div className="w-28 h-28 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-6 relative">
              <Video className="w-14 h-14 text-primary" />
              <motion.div className="absolute inset-0 rounded-full border-2 border-primary/30" animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} />
            </div>
            <h2 className="font-heading text-3xl font-bold mb-3">AI Video Interview</h2>
            <p className="text-muted-foreground mb-4">Voice & text based interview with AI interviewer. Camera will be enabled for proctoring.</p>

            <div className="bg-card border border-border rounded-2xl p-5 mb-6 text-left space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Interview Security Rules</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2"><span className="text-destructive font-bold">•</span> Interview opens in fullscreen mode — do not exit</li>
                <li className="flex items-start gap-2"><span className="text-destructive font-bold">•</span> Tab switching is monitored — 3 violations = termination</li>
                <li className="flex items-start gap-2"><span className="text-destructive font-bold">•</span> Copy/Paste/Right-click are disabled</li>
                <li className="flex items-start gap-2"><span className="text-destructive font-bold">•</span> Camera must remain on throughout</li>
                <li className="flex items-start gap-2"><span className="text-destructive font-bold">•</span> This is a one-time interview — no retakes</li>
              </ul>
            </div>

            <p className="text-sm text-destructive font-medium mb-6">⚠ You can only take this interview once. Make sure you're ready.</p>
            <Button onClick={startInterview} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-10 h-13 text-base font-semibold gap-2">
              <Camera className="w-5 h-5" /> Start Secure Interview
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  // Full interview UI
  return (
    <div ref={containerRef} className="flex h-screen bg-background overflow-hidden select-none" style={{ userSelect: "none" }}>
      {/* Warning overlay */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-destructive/20 flex items-center justify-center backdrop-blur-sm"
          >
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-card border-2 border-destructive rounded-2xl p-8 text-center max-w-md">
              <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-destructive mb-2">Tab Switch Detected!</h2>
              <p className="text-muted-foreground">Warning {violations}/3 — Your interview will be terminated after 3 violations.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT: Camera + AI Avatar */}
      <div className="w-1/2 flex flex-col bg-muted/20 border-r border-border">
        {/* Header bar */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-sm font-semibold text-foreground">LIVE INTERVIEW</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Q {currentQ + 1}/{aiQuestions.length}</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5 text-primary" />
              Proctored
            </div>
          </div>
        </div>

        {/* AI Avatar section */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
          <motion.div
            className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 relative ${aiSpeaking ? "bg-primary" : "bg-primary/80"}`}
            animate={aiSpeaking ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: aiSpeaking ? Infinity : 0, duration: 0.8 }}
          >
            <Bot className="w-16 h-16 text-primary-foreground" />
            {aiSpeaking && (
              <>
                <motion.div className="absolute inset-0 rounded-full border-2 border-primary/40" animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }} transition={{ repeat: Infinity, duration: 1.2 }} />
                <motion.div className="absolute inset-0 rounded-full border border-primary/20" animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }} />
              </>
            )}
          </motion.div>
          <p className="font-heading text-lg font-semibold text-foreground">AI Interviewer</p>
          <p className="text-sm text-muted-foreground mt-1">
            {aiSpeaking ? "Speaking..." : interviewComplete ? "Interview Complete" : "Listening..."}
          </p>

          {/* Sound wave animation when AI speaking */}
          {aiSpeaking && (
            <div className="flex items-end gap-1 mt-4 h-8">
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary rounded-full"
                  animate={{ height: [8, 24 + Math.random() * 16, 8] }}
                  transition={{ repeat: Infinity, duration: 0.6 + Math.random() * 0.4, delay: i * 0.1 }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Camera feed (small PiP) */}
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
        {/* Header */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-border">
          <h2 className="font-heading font-semibold text-foreground">Interview Transcript</h2>
          <span className="text-xs px-3 py-1 rounded-full bg-accent text-accent-foreground font-medium">
            {messages.length} messages
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-5 space-y-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div className="max-w-[80%]">
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "ai"
                      ? "bg-muted/80 border border-border text-foreground rounded-tl-md"
                      : "bg-primary text-primary-foreground rounded-tr-md"
                  }`}>
                    {msg.text}
                  </div>
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

        {/* Live transcript indicator */}
        {recording && transcript && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mx-5 mb-2 p-3 bg-accent/60 rounded-xl border border-primary/20 text-sm text-foreground">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }} />
                ))}
              </div>
              <span className="text-xs text-primary font-semibold">Transcribing...</span>
            </div>
            {transcript}
          </motion.div>
        )}

        {/* Input area */}
        {!interviewComplete ? (
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <Button
                onClick={toggleMic}
                className={`w-12 h-12 rounded-full flex-shrink-0 ${recording
                  ? "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30"
                  : "bg-primary text-primary-foreground"
                }`}
                size="icon"
              >
                {recording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendText()}
                placeholder="Type your answer..."
                className="flex-1 h-12 px-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-ring"
                onPaste={(e) => e.preventDefault()}
              />
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
              <p className="text-sm text-muted-foreground mb-3">Interview complete! You may now exit.</p>
              <Button
                onClick={() => {
                  if (document.fullscreenElement) document.exitFullscreen();
                  navigate("/student/report");
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 h-11"
              >
                View Your Report →
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentInterview;
