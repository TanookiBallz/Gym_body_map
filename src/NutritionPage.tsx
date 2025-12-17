import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NutritionPage.css'; 

interface Message {
  role: 'user' | 'ai';
  text: string;
}

function NutritionPage() {
  const navigate = useNavigate();
  
  
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [calories, setCalories] = useState<number | null>(null);

  const calculateCalories = () => {
    if (!weight || !height || !age) return;
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
 
    const result = (10 * w + 6.25 * h - 5 * a + 5) * 1.55; 
    setCalories(Math.round(result));
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
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Брат, сервер не отвечает. Проверь, запущен ли backend.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container" style={{ flexDirection: 'column', justifyContent: 'flex-start', overflowY: 'auto' }}>
      
   
      <div className="video-background">
        <video autoPlay loop muted playsInline className="video-content">
          <source src="/public/David Laid.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

  
      <nav className="top-nav">
        <div className="logo" onClick={() => navigate('/')} style={{cursor: 'pointer', color: 'white'}}>Greek God</div>
        <button onClick={() => navigate('/')} className="back-btn">НАЗАД В ЗАЛ</button>
      </nav>

      <div className="nutrition-content">
        
        
        <div className="glass-panel-center">
          <h2 style={{ color: '#e74c3c', marginTop: 0 }}>КАЛЬКУЛЯТОР ДЛЯ НАБОРА</h2>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginTop: '10px' }}>
                <span>🥩 Белки: {Math.round(parseFloat(weight) * 2)}г</span>
                <span>🥑 Жиры: {Math.round(parseFloat(weight) * 1)}г</span>
                <span>🍚 Угли: остальное</span>
              </div>
            </div>
          )}
        </div>

        {/*ЧАТ С НЕЙРОНКОЙ */}
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