import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NutritionPage.css'; 

interface NutritionPageProps {
  isPlaying: boolean;
  toggleMusic: () => void;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

function NutritionPage({ isPlaying, toggleMusic }: NutritionPageProps) {
  const navigate = useNavigate();
  

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [calories, setCalories] = useState<number | null>(null);

  
  const [macros, setMacros] = useState({ p: 0, f: 0, c: 0 });

  const calculateCalories = () => {
    if (!weight || !height || !age) return;
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    
 
    const result = (10 * w + 6.25 * h - 5 * a + 5) * 1.55; 
    const totalCals = Math.round(result);
    setCalories(totalCals);

    const protein = Math.round(w * 2);       
    const fats = Math.round(w * 1);          
    const usedCals = (protein * 4) + (fats * 9);
    
    
    const carbs = Math.round((totalCals - usedCals) / 4);

    setMacros({ p: protein, f: fats, c: carbs });
  };

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Салют, брат! Я твой AI-тренер. Спроси меня про питание, массу или сушку.' }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai-chat', { message: userMsg });
      setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Брат, сервер не отвечает.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container" style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
      
<div className="video-background">
        <video autoPlay loop muted playsInline className="video-content">
          <source src="/David Laid.mp4" type="" />
        </video>
        <div className="video-overlay"></div> 
      </div>


      <nav className="top-nav">
        <div className="logo" onClick={() => navigate('/')} style={{cursor: 'pointer', color: 'white'}}>Greek God</div>
        
        <div className="nav-controls">
         
          <button 
            onClick={toggleMusic} 
            className={`music-btn ${isPlaying ? 'playing' : ''}`}
            title="Play/Pause Music"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17C6 19.21 7.79 21 10 21C12.21 21 14 19.21 14 17V7H18V3H12Z" />
            </svg>
          </button>

          <button onClick={() => navigate('/')} className="back-btn">НАЗАД</button>
        </div>
      </nav>

      <div className="nutrition-content">

        <div className="glass-panel-center">
          <h2 style={{ color: '#e74c3c', marginTop: 0 }}>КАЛЬКУЛЯТОР ТИТАНА</h2>
          <p style={{ fontSize: '14px', color: '#ccc' }}>Узнай свою норму для роста мышц</p>
          
          <div className="calc-grid">
            <input type="number" placeholder="Вес (кг)" value={weight} onChange={e => setWeight(e.target.value)} className="glass-input" />
            <input type="number" placeholder="Рост (см)" value={height} onChange={e => setHeight(e.target.value)} className="glass-input" />
            <input type="number" placeholder="Возраст" value={age} onChange={e => setAge(e.target.value)} className="glass-input" />
          </div>
          
          <button onClick={calculateCalories} className="action-btn">РАССЧИТАТЬ</button>
          
          {calories && (
            <div className="result-box">
              <h3>ТВОЯ ЦЕЛЬ: <span style={{ color: '#e74c3c', fontSize: '28px' }}>{calories}</span> ККАЛ</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginTop: '10px', flexWrap: 'wrap', gap: '10px' }}>
                <span>🥩 Белки: {macros.p}г</span>
                <span>🥑 Жиры: {macros.f}г</span>
                <span>🍚 Угли: {macros.c}г</span> 
              </div>
            </div>
          )}
        </div>

     
        <div className="chat-container">
          <div className="chat-header">
            <h3>AI COACH 🤖</h3>
          </div>
          
          <div className="chat-window">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div className="bubble">{msg.text}</div>
              </div>
            ))}
            {loading && <div className="message ai"><div className="bubble">Печатает...</div></div>}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input-area">
            <input 
              type="text" 
              placeholder="Спроси: 'Что съесть на ужин?'..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NutritionPage;