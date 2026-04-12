import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StudentSidebar from "@/components/StudentSidebar";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send, Bot, User } from "lucide-react";

type Message = { role: "ai" | "user"; text: string };

const aiQuestions = [
  "Tell me about yourself and your background in Computer Science.",
  "What was the most challenging project you worked on and how did you solve it?",
  "How would you design a URL shortener system?",
  "Where do you see yourself in 5 years?",
];

const StudentInterview = () => {
  const [started, setStarted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const chatEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startInterview = () => {
    setStarted(true);
    setMessages([{ role: "ai", text: aiQuestions[0] }]);
  };

  const toggleMic = () => {
    if (!recording) {
      setRecording(true);
      setTranscript("");
      // Simulate speech recognition
      const words = "I have a strong background in Computer Science with experience in React and Python development.".split(" ");
      let i = 0;
      const interval = setInterval(() => {
        if (i < words.length) {
          setTranscript((prev) => (prev ? prev + " " : "") + words[i]);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 200);
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
    setMessages((prev) => [...prev, { role: "user", text }]);
    const nextQ = currentQ + 1;
    if (nextQ < aiQuestions.length) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "ai", text: aiQuestions[nextQ] }]);
        setCurrentQ(nextQ);
      }, 1200);
    } else {
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "ai", text: "Thank you! Your interview is complete. You can now view your report." }]);
      }, 1200);
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <StudentSidebar />
      <main className="flex-1 flex flex-col">
        <div className="p-8 border-b border-border">
          <h1 className="font-heading text-3xl font-bold">AI Mock Interview</h1>
          <p className="text-muted-foreground">Voice-based interview · 8-10 minutes</p>
        </div>

        {!started ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
              <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-6 relative">
                <Mic className="w-12 h-12 text-primary" />
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse-ring" />
              </div>
              <h2 className="font-heading text-2xl font-semibold mb-2">Ready for your interview?</h2>
              <p className="text-muted-foreground mb-6">The AI interviewer will ask you questions. You can respond via voice or text.</p>
              <Button onClick={startInterview} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 h-12 text-base font-semibold">
                Start Interview →
              </Button>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Chat */}
            <div className="flex-1 overflow-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                  >
                    {msg.role === "ai" && (
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-primary-foreground" />
                      </div>
                    )}
                    <div className={`max-w-lg px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "ai" ? "bg-card border border-border text-foreground" : "bg-primary text-primary-foreground"
                    }`}>
                      {msg.text}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-secondary-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={chatEnd} />
            </div>

            {/* Live Transcript */}
            {recording && transcript && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-6 p-3 bg-accent/50 rounded-xl border border-primary/20 text-sm text-foreground">
                <span className="text-xs text-primary font-medium mr-2">🎙 Live:</span>
                {transcript}
              </motion.div>
            )}

            {/* Controls */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-center gap-3 max-w-3xl mx-auto">
                <Button
                  onClick={toggleMic}
                  size="icon"
                  className={`w-12 h-12 rounded-full ${recording ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"}`}
                >
                  {recording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendText()}
                  placeholder="Or type your answer..."
                  className="flex-1 h-12 px-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <Button onClick={sendText} size="icon" className="w-12 h-12 rounded-full bg-primary text-primary-foreground">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default StudentInterview;
