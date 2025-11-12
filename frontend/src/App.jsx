import { useState, useRef, useEffect } from "react";
import axios from "axios";

const questions = [
  {key:"brand", q:"What's the brand of your car?", placeholder:"e.g., Maruti, Hyundai", icon:"🏢"},
  {key:"model", q:"What's the model?", placeholder:"e.g., Swift, i20", icon:"🚙"},
  {key:"year", q:"What year was it manufactured?", placeholder:"2018", type:"number", icon:"📅"},
  {key:"km_driven", q:"How many kilometers driven?", placeholder:"50000", type:"number", icon:"🛣️"},
  {key:"owners", q:"How many owners?", placeholder:"1", type:"number", icon:"👤"},
  {key:"fuel_type", q:"Fuel type?", placeholder:"Petrol/Diesel/CNG", icon:"⛽"},
  {key:"transmission", q:"Transmission type?", placeholder:"Manual/Automatic", icon:"⚙️"},
  {key:"engine_cc", q:"Engine capacity (CC)?", placeholder:"1200", type:"number", icon:"🔧"},
  {key:"seats", q:"Number of seats?", placeholder:"5", type:"number", icon:"💺"}
];

export default function App(){
  const [messages, setMessages] = useState([{type:"bot", text:"Hi! I'll help you estimate your car's price. Let's start! 🚗"}]);
  const [currentQ, setCurrentQ] = useState(0);
  const [data, setData] = useState({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const chatEnd = useRef(null);

  useEffect(()=> chatEnd.current?.scrollIntoView({behavior:"smooth"}), [messages]);

  useEffect(()=>{
    if(currentQ < questions.length && !done){
      setTimeout(()=> {
        const q = questions[currentQ];
        setMessages(m=>[...m, {type:"bot", text:q.q, icon:q.icon}]);
      }, 500);
    }
  }, [currentQ, done]);

  const send = async ()=>{
    if(!input.trim()) return;
    const val = input.trim();
    setMessages(m=>[...m, {type:"user", text:val}]);
    setInput("");

    const q = questions[currentQ];
    const newData = {...data, [q.key]: q.type==="number" ? Number(val) : val};
    setData(newData);

    if(currentQ < questions.length - 1){
      setTimeout(()=> setCurrentQ(currentQ + 1), 600);
    }else{
      setLoading(true);
      setDone(true);
      try{
        const {data:res} = await axios.post('/predict', newData);
        const price = res.predicted_price_lakhs?.toFixed(2);
        setTimeout(()=>{
          setMessages(m=>[...m, {type:"result", price}]);
          setLoading(false);
        }, 1000);
      }catch(err){
        setMessages(m=>[...m, {type:"bot", text:"Error occurred. Please try again."}]);
        setLoading(false);
        setDone(false);
      }
    }
  };

  const reset = ()=>{
    setMessages([{type:"bot", text:"Hi! I'll help you estimate your car's price. Let's start! 🚗"}]);
    setCurrentQ(0);
    setData({});
    setInput("");
    setLoading(false);
    setDone(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">🚗</div>
            <div>
              <h1 className="text-white font-bold text-lg">Car Price AI</h1>
              <p className="text-white/80 text-xs">Get instant valuation</p>
            </div>
          </div>
          {done && (
            <button onClick={reset} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
              New Chat
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((m,i)=>(
            <div key={i} className={`flex ${m.type==="user"?"justify-end":"justify-start"}`}>
              {m.type==="bot" && (
                <div className="flex gap-2 max-w-[80%]">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    {m.icon || "🤖"}
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-md">
                    <p className="text-gray-800">{m.text}</p>
                  </div>
                </div>
              )}
              
              {m.type==="user" && (
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-md max-w-[80%]">
                  <p>{m.text}</p>
                </div>
              )}

              {m.type==="result" && (
                <div className="w-full bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl text-center">
                  <p className="text-white/90 text-sm font-semibold mb-2">Estimated Price</p>
                  <p className="text-white text-5xl font-black mb-1">₹{m.price}</p>
                  <p className="text-white text-xl font-bold">Lakhs</p>
                </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                🤖
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-md">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"0.1s"}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"0.2s"}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEnd}/>
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <input
              className="flex-1 bg-gray-100 border-2 border-gray-200 rounded-full px-5 py-3 focus:border-blue-500 focus:bg-white outline-none transition"
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyPress={e=>e.key==="Enter"&&send()}
              placeholder={currentQ<questions.length ? questions[currentQ].placeholder : "Chat complete"}
              disabled={loading || done}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim() || done}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
