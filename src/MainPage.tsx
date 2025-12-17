import { useState, useRef,  } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Exercise {
  id: number;
  name: string;
  description: string;
  difficulty_level: string;
  is_primary: boolean;
  image_url?: string;
}

function MainPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

  
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        audioRef.current.volume = 0.3; 
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuscleClick = async (muscleId: string) => {
    try {
      setSelectedMuscle(muscleId);
      const response = await axios.get(`http://localhost:5000/api/exercises/${muscleId}`);
      setExercises(response.data);
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  return (
    <div className="main-container">
      
  
      <div className="video-background">
        <video autoPlay loop muted playsInline className="video-content">
          <source src="/David Laid.mp4" type="" />
        </video>
        <div className="video-overlay"></div> 
      </div>

      
      <audio ref={audioRef} loop src="/poker face.mp3" /> 

    
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

          <button onClick={() => navigate('/nutrition')} className="help-btn">

            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
              <circle cx="12" cy="5" r="2"></circle>
              <path d="M12 7v4"></path>
              <line x1="8" y1="16" x2="8" y2="16"></line>
              <line x1="16" y1="16" x2="16" y2="16"></line>
            </svg>
      
            <span>AI COACH</span>
          </button>

      
          <button onClick={() => navigate('/help')} className="help-btn">
      
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <span>СОВЕТЫ</span>
          </button>

        </div>
      </nav>


      <div className="hero-section">
        <div className="body-wrapper">
            <img 
              src="/David-Laid.05__1_-removebg-preview.png"  
              alt="Physique" 
              className={`hero-image ${selectedMuscle ? 'active-muscle-view' : ''}`}
            />
            
            <svg viewBox="0 0 500 800" className="interactive-svg">
              {/* ПЛЕЧИ */}
              <g onClick={() => handleMuscleClick('shoulders')}>
                 <ellipse cx="350" cy="340" rx="20" ry="20" className={`muscle-zone ${selectedMuscle === 'shoulders' ? 'selected' : ''}`} />
              </g>
              {/* ТРИЦЕПС */}
              <g onClick={() => handleMuscleClick('triceps')}>
                  <ellipse cx="200" cy="240" rx="14" ry="20" transform="rotate(-10 180 120)" className={`muscle-zone ${selectedMuscle === 'triceps' ? 'selected' : ''}`} />
              </g>
              {/* ШИРОЧАЙШИЕ */}
              <g onClick={() => handleMuscleClick('lats')}>
                  <ellipse cx="190" cy="310" rx="15" ry="30" transform="rotate(-10 300 140)" className={`muscle-zone ${selectedMuscle === 'lats' ? 'selected' : ''}`} />
              </g>
              {/* ГРУДЬ */}
              <rect x="230" y="330" width="90" height="60" rx="15" transform="rotate(10 370 380)" className={`muscle-zone ${selectedMuscle === 'chest' ? 'selected' : ''}`} onClick={() => handleMuscleClick('chest')} />
             
              {/* БИЦЕПСЫ */}
              <g onClick={() => handleMuscleClick('biceps')}>
                 <ellipse cx="370" cy="400" rx="18" ry="30" transform="rotate(10 385 250)" className={`muscle-zone ${selectedMuscle === 'biceps' ? 'selected' : ''}`} />
                 <ellipse cx="160" cy="240" rx="15" ry="20" transform="rotate(-30 200 95)" className={`muscle-zone ${selectedMuscle === 'biceps' ? 'selected' : ''}`} />
              </g>
               {/* ПРЕДПЛЕЧЬЯ */}
               <g onClick={() => handleMuscleClick('forearms')}>
                 <rect x="390" y="400" width="20" height="70" rx="15" transform="rotate(45 330 350)" className={`muscle-zone ${selectedMuscle === 'forearms' ? 'selected' : ''}`} />
              </g>
              {/* ПРЕСС */}
              <rect x="255" y="390" width="55" height="80" rx="15" transform="rotate(10 370 380)" className={`muscle-zone ${selectedMuscle === 'abs' ? 'selected' : ''}`} onClick={() => handleMuscleClick('abs')} />
              {/* НОГИ */}
              <g onClick={() => handleMuscleClick('quadriceps')}>
                <rect x="240" y="520" width="55" height="120" rx="15" transform="rotate(10 370 380)" className={`muscle-zone ${selectedMuscle === 'quadriceps' ? 'selected' : ''}`}/>
              </g>
            </svg>
        </div>
      </div>

      {/* модалка с инфой */}
      {selectedMuscle && (
        <div className="glass-panel">
            <div className="panel-header">
                <h2>{selectedMuscle}</h2>
            </div>
            <button className="close-btn" onClick={() => setSelectedMuscle(null)}>×</button>
            
            <div className="exercises-list">
                {exercises.map((ex) => (
                <div key={ex.id} className="exercise-card">
                    {ex.is_primary && <div className="primary-indicator"></div>}
                    <h3 className="exercise-name">{ex.name}</h3>
                    {ex.image_url && (
                        <div className="gif-container">
                            <img src={ex.image_url} alt={ex.name} />
                        </div>
                    )}
                    <p className="exercise-desc">{ex.description}</p>
                    <div className="tags">
                        <span className="tag-level">{ex.difficulty_level}</span>
                        {ex.is_primary && <span className="tag-target">TARGET</span>}
                    </div>
                </div>
                ))}
            </div>
        </div>
      )}

    </div>
  );
}

export default MainPage;