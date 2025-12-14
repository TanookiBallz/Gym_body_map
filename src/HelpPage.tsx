import { useNavigate } from 'react-router-dom';
import './App.css';

function HelpPage() {
  const navigate = useNavigate();

  return (
    <div className="help-container">
      <div className="video-background">
         
        <video autoPlay loop muted playsInline className="video-content">
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

      <div className="content-box">
        <h1>ПЕРВЫЕ ШАГИ ТИТАНА</h1>
        <p>Брат, тренировки это только 40% успеха. Остальное — это еда и сон.</p>
        
        <div className="info-grid">
            <div className="info-card">
                <h3>🥩 БЕЛКИ (PROTEIN)</h3>
                <p>Строительный материал. Тебе нужно 2г белка на 1кг твоего веса.</p>
            </div>
            <div className="info-card">
                <h3>🍚 УГЛЕВОДЫ (CARBS)</h3>
                <p>Твоя энергия. Ешь рис, гречку, макароны за 2 часа до тренировки.</p>
            </div>
            <div className="info-card">
                <h3>😴 СОН</h3>
                <p>Мышцы растут не в зале, а когда ты спишь. Минимум 8 часов.</p>
            </div>
        </div>

        <button onClick={() => navigate('/')} className="back-btn">
          назад
        </button>
      </div>
    </div>
  );
}

export default HelpPage;