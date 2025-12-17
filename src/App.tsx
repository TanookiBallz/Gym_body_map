import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import HelpPage from './HelpPage';
import './App.css';
import NutritionPage from './NutritionPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
      </Routes>
    </Router>
  );
}

export default App;