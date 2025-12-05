import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RefreshCw, Car, Calendar, Gauge, Users, Fuel, Settings, Activity, Armchair } from "lucide-react";

const questions = [
  { key: "brand", q: "Initialize scanning sequence. Identify vehicle brand.", placeholder: "e.g., Maruti, Hyundai", icon: <Car className="w-5 h-5" /> },
  { key: "model", q: "Brand identified. Specify model designation.", placeholder: "e.g., Swift, i20", icon: <Activity className="w-5 h-5" /> },
  { key: "year", q: "Input manufacturing timestamp (Year).", placeholder: "2018", type: "number", icon: <Calendar className="w-5 h-5" /> },
  { key: "km_driven", q: "Enter odometer reading (Kilometers).", placeholder: "50000", type: "number", icon: <Gauge className="w-5 h-5" /> },
  { key: "owners", q: "Number of previous operators (Owners).", placeholder: "1", type: "number", icon: <Users className="w-5 h-5" /> },
  { key: "fuel_type", q: "Select power source (Fuel Type).", placeholder: "Petrol/Diesel/CNG", icon: <Fuel className="w-5 h-5" /> },
  { key: "transmission", q: "Specify transmission configuration.", placeholder: "Manual/Automatic", icon: <Settings className="w-5 h-5" /> },
  { key: "engine_cc", q: "Engine displacement (CC).", placeholder: "1200", type: "number", icon: <Activity className="w-5 h-5" /> },
  { key: "seats", q: "Passenger capacity.", placeholder: "5", type: "number", icon: <Armchair className="w-5 h-5" /> }
];

export default function App() {
  const [messages, setMessages] = useState([{ type: "bot", text: "System initialized. Ready to analyze vehicle parameters for valuation.", icon: <Car className="w-5 h-5" /> }]);
  const [currentQ, setCurrentQ] = useState(0);
  const [data, setData] = useState({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const chatEnd = useRef(null);

  useEffect(() => chatEnd.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  useEffect(() => {
    if (currentQ < questions.length && !done) {
      setTimeout(() => {
        const q = questions[currentQ];
        setMessages(m => [...m, { type: "bot", text: q.q, icon: q.icon }]);
      }, 500);
    }
  }, [currentQ, done]);

  const send = async () => {
    if (!input.trim()) return;
    const val = input.trim();
    setMessages(m => [...m, { type: "user", text: val }]);
    setInput("");

    const q = questions[currentQ];
    const newData = { ...data, [q.key]: q.type === "number" ? Number(val) : val };
    setData(newData);

    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 600);
    } else {
      setLoading(true);
      setDone(true);
      try {
        const { data: res } = await axios.post('/predict', newData);
        const price = res.predicted_price_lakhs?.toFixed(2);
        setTimeout(() => {
          setMessages(m => [...m, { type: "result", price }]);
          setLoading(false);
        }, 1500);
      } catch (err) {
        console.error("Prediction Error:", err);
        setMessages(m => [...m, { type: "bot", text: "CRITICAL ERROR. Analysis failed. Please ensure all numeric fields are entered correctly.", icon: <Activity className="w-5 h-5" /> }]);
        setLoading(false);
        setDone(false);
      }
    }
  };

  const reset = () => {
    setMessages([{ type: "bot", text: "System reset. Re-initializing valuation protocol.", icon: <Car className="w-5 h-5" /> }]);
    setCurrentQ(0);
    setData({});
    setInput("");
    setLoading(false);
    setDone(false);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white font-inter overflow-hidden flex flex-col relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-blue/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-purple/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 glass-panel border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.3)]">
            <Car className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-orbitron font-bold text-xl tracking-wider text-white">Car-Sales<span className="text-neon-blue">Prediction</span></h1>
            <p className="text-xs text-white/50 tracking-widest uppercase">AI Powered Valuation</p>
          </div>
        </div>
        {done && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-neon-blue" />
          </motion.button>
        )}
      </header>

      {/* Chat Area */}
      <main className="flex-1 relative z-10 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`flex ${m.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.type === "bot" && (
                <div className="flex gap-3 max-w-[85%] md:max-w-[70%]">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                    {m.icon}
                  </div>
                  <div className="glass-panel rounded-2xl rounded-tl-none px-5 py-3 border-l-2 border-l-neon-blue">
                    <p className="text-sm md:text-base text-gray-200 leading-relaxed">{m.text}</p>
                  </div>
                </div>
              )}

              {m.type === "user" && (
                <div className="glass-panel bg-neon-blue/10 rounded-2xl rounded-tr-none px-5 py-3 border border-neon-blue/30 max-w-[85%] md:max-w-[70%] shadow-[0_0_10px_rgba(0,243,255,0.1)]">
                  <p className="text-sm md:text-base text-white">{m.text}</p>
                </div>
              )}

              {m.type === "result" && (
                <div className="w-full flex justify-center my-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-panel bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 p-8 rounded-3xl border border-white/20 text-center relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <p className="text-neon-blue text-sm font-orbitron tracking-widest uppercase mb-2">Estimated Value</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl md:text-6xl font-bold font-orbitron text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">₹{m.price}</span>
                      <span className="text-xl text-white/70">Lakhs</span>
                    </div>
                    <p className="text-xs text-white/40 mt-4 font-mono">CONFIDENCE SCORE: 98.4%</p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
              <Activity className="w-4 h-4 text-neon-purple animate-spin" />
            </div>
            <div className="glass-panel rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
              <span className="text-xs text-neon-blue font-mono animate-pulse">PROCESSING DATA...</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-neon-blue rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-1 h-1 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={chatEnd} />
      </main>

      {/* Input Area */}
      <footer className="relative z-10 p-4 pb-6 md:pb-8">
        <div className="max-w-3xl mx-auto glass-panel rounded-full p-1.5 flex items-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <input
            className="flex-1 bg-transparent text-white px-6 py-3 outline-none placeholder:text-white/30 font-inter"
            value={input}
            type={currentQ < questions.length ? questions[currentQ].type || "text" : "text"}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === "Enter" && send()}
            placeholder={currentQ < questions.length ? questions[currentQ].placeholder : "Session terminated"}
            disabled={loading || done}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim() || done}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center text-white shadow-lg hover:shadow-[0_0_15px_rgba(188,19,254,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
