import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Brain, ChevronRight, Sparkles, TrendingUp, Shield, Star, Search, Filter, X, Check, AlertCircle } from 'lucide-react';

// ==================== STYLES ====================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&family=Orbitron:wght@400;700;900&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', sans-serif;
    background: #0a0e27;
    color: #fff;
    overflow-x: hidden;
  }
  
  .app-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%);
    position: relative;
  }
  
  /* Animated Background */
  .bg-grid {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: gridMove 20s linear infinite;
    pointer-events: none;
    z-index: 0;
  }
  
  @keyframes gridMove {
    0% { transform: translateY(0); }
    100% { transform: translateY(50px); }
  }
  
  .glow-orb {
    position: fixed;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.15;
    pointer-events: none;
    z-index: 0;
  }
  
  .orb-1 {
    background: #00e5ff;
    top: -200px;
    left: -200px;
    animation: float 20s ease-in-out infinite;
  }
  
  .orb-2 {
    background: #00ff99;
    bottom: -200px;
    right: -200px;
    animation: float 25s ease-in-out infinite reverse;
  }
  
  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(100px, -50px) scale(1.1); }
    66% { transform: translate(-50px, 100px) scale(0.9); }
  }
  
  /* Navigation */
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(10, 14, 39, 0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0, 229, 255, 0.1);
  }
  
  .nav-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    font-family: 'Orbitron', sans-serif;
    font-size: 1.8rem;
    font-weight: 900;
    background: linear-gradient(135deg, #00e5ff, #00ff99);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
  
  .nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
  }
  
  .nav-link {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s;
    cursor: pointer;
  }
  
  .nav-link:hover {
    color: #00e5ff;
  }
  
  /* Hero Section */
  .hero {
    position: relative;
    padding: 12rem 2rem 8rem;
    text-align: center;
    z-index: 1;
  }
  
  .hero-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 4.5rem;
    font-weight: 900;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, #fff, #00e5ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: titleGlow 3s ease-in-out infinite;
  }
  
  @keyframes titleGlow {
    0%, 100% { filter: drop-shadow(0 0 20px rgba(0, 229, 255, 0.3)); }
    50% { filter: drop-shadow(0 0 40px rgba(0, 229, 255, 0.6)); }
  }
  
  .hero-subtitle {
    font-size: 1.3rem;
    color: rgba(255, 255, 255, 0.7);
    max-width: 700px;
    margin: 0 auto 3rem;
    line-height: 1.8;
  }
  
  .cta-group {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    margin-bottom: 4rem;
  }
  
  .btn {
    padding: 1.2rem 3rem;
    font-size: 1.1rem;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Inter', sans-serif;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #00e5ff, #00ff99);
    color: #0a0e27;
    box-shadow: 0 0 30px rgba(0, 229, 255, 0.4);
  }
  
  .btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 50px rgba(0, 229, 255, 0.6);
  }
  
  .btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    border: 1px solid rgba(0, 229, 255, 0.3);
  }
  
  .btn-secondary:hover {
    background: rgba(0, 229, 255, 0.1);
    border-color: #00e5ff;
  }
  
  .floating-chips {
    display: flex;
    gap: 2rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .chip {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(0, 229, 255, 0.2);
    padding: 1rem 1.5rem;
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    animation: chipFloat 3s ease-in-out infinite;
  }
  
  .chip:nth-child(1) { animation-delay: 0s; }
  .chip:nth-child(2) { animation-delay: 0.5s; }
  .chip:nth-child(3) { animation-delay: 1s; }
  
  @keyframes chipFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  /* Purpose Cards */
  .purpose-grid {
    max-width: 1400px;
    margin: 0 auto;
    padding: 4rem 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    z-index: 1;
    position: relative;
  }
  
  .purpose-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(0, 229, 255, 0.1);
    border-radius: 20px;
    padding: 2.5rem;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  
  .purpose-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #00e5ff, transparent);
    transform: translateX(-100%);
    transition: transform 0.6s;
  }
  
  .purpose-card:hover::before {
    transform: translateX(100%);
  }
  
  .purpose-card:hover {
    transform: translateY(-10px) scale(1.02);
    background: rgba(0, 229, 255, 0.05);
    border-color: #00e5ff;
    box-shadow: 0 20px 60px rgba(0, 229, 255, 0.3);
  }
  
  .purpose-card.selected {
    background: rgba(0, 229, 255, 0.1);
    border-color: #00e5ff;
    box-shadow: 0 0 40px rgba(0, 229, 255, 0.4);
  }
  
  .card-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .card-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .card-desc {
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
  }
  
  /* Budget Slider */
  .slider-container {
    max-width: 800px;
    margin: 4rem auto;
    padding: 3rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(0, 229, 255, 0.1);
    border-radius: 20px;
    position: relative;
    z-index: 1;
  }
  
  .slider-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .slider-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
  
  .budget-display {
    font-family: 'Orbitron', sans-serif;
    font-size: 3rem;
    background: linear-gradient(135deg, #00e5ff, #00ff99);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 2rem 0;
  }
  
  .slider {
    width: 100%;
    height: 8px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    outline: none;
    -webkit-appearance: none;
  }
  
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00e5ff, #00ff99);
    cursor: pointer;
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.6);
  }
  
  .budget-hint {
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 1rem;
    font-size: 0.9rem;
  }
  
  /* Build Result */
  .build-result {
    max-width: 1600px;
    margin: 4rem auto;
    padding: 2rem;
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 2rem;
    position: relative;
    z-index: 1;
  }
  
  .component-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(0, 229, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 1.5rem;
    transition: all 0.3s;
  }
  
  .component-card:hover {
    border-color: #00e5ff;
    box-shadow: 0 10px 40px rgba(0, 229, 255, 0.2);
  }
  
  .component-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .component-name {
    font-size: 1.3rem;
    font-weight: 600;
  }
  
  .component-price {
    font-size: 1.5rem;
    color: #00ff99;
    font-weight: 700;
  }
  
  .perf-bar {
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    margin: 1rem 0;
  }
  
  .perf-fill {
    height: 100%;
    background: linear-gradient(90deg, #00e5ff, #00ff99);
    border-radius: 10px;
    transition: width 1s ease-out;
  }
  
  .ai-panel {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(0, 229, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
    position: sticky;
    top: 100px;
    height: fit-content;
  }
  
  .ai-panel-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
  
  .insight-item {
    padding: 1rem;
    background: rgba(0, 229, 255, 0.05);
    border-left: 3px solid #00e5ff;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.95rem;
    line-height: 1.6;
  }
  
  .score-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(0, 255, 153, 0.1);
    border: 1px solid #00ff99;
    border-radius: 20px;
    font-weight: 600;
    margin-top: 1rem;
  }
  
  /* Loading Animation */
  .loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(10, 14, 39, 0.95);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }
  
  .loading-spinner {
    width: 80px;
    height: 80px;
    border: 4px solid rgba(0, 229, 255, 0.1);
    border-top-color: #00e5ff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 2rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .loading-text {
    font-size: 1.2rem;
    color: #00e5ff;
    animation: pulse 2s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  /* Section Titles */
  .section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 3rem;
    background: linear-gradient(135deg, #fff, #00e5ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

// ==================== COMPONENTS ====================

// Navigation Component
const Navigation = ({ currentView, setCurrentView }) => (
  <nav className="navbar">
    <div className="nav-content">
      <div className="logo">
        <Zap size={32} />
        SMARTRIG
      </div>
      <div className="nav-links">
        <span className="nav-link" onClick={() => setCurrentView('home')}>Home</span>
        <span className="nav-link" onClick={() => setCurrentView('wizard')}>AI Build</span>
        <span className="nav-link" onClick={() => setCurrentView('explore')}>Explore</span>
        <span className="nav-link">Dashboard</span>
      </div>
    </div>
  </nav>
);

// Hero Component
const Hero = ({ onStartBuild }) => (
  <section className="hero">
    <h1 className="hero-title">AI-Powered PC Builds.<br/>Perfect for YOU.</h1>
    <p className="hero-subtitle">
      SmartRig analyzes your goals, workload, and budget to design the perfect PC — 
      optimized for gaming, AI, editing, or productivity.
    </p>
    <div className="cta-group">
      <button className="btn btn-primary" onClick={onStartBuild}>
        <Brain size={20} />
        Start AI Build
        <ChevronRight size={20} />
      </button>
      <button className="btn btn-secondary">
        <Search size={20} />
        Explore Components
      </button>
    </div>
    <div className="floating-chips">
      <div className="chip">
        <Cpu size={24} color="#00e5ff" />
        <span>Smart CPU Selection</span>
      </div>
      <div className="chip">
        <Zap size={24} color="#00ff99" />
        <span>Performance Optimized</span>
      </div>
      <div className="chip">
        <Shield size={24} color="#00e5ff" />
        <span>Compatibility Guaranteed</span>
      </div>
    </div>
  </section>
);

// Purpose Selection Component
const PurposeSelection = ({ selectedPurpose, setSelectedPurpose }) => {
  const purposes = [
    { id: 'gaming', icon: '🎮', title: 'Gaming', desc: 'High FPS, smooth gameplay, ray tracing ready' },
    { id: 'ai', icon: '🤖', title: 'AI Training', desc: 'CUDA cores, tensor operations, deep learning' },
    { id: 'video', icon: '🎞️', title: 'Video Editing', desc: '4K rendering, fast exports, timeline smoothness' },
    { id: 'data', icon: '🧮', title: 'Data Science', desc: 'Large datasets, parallel processing, analytics' },
    { id: 'office', icon: '🧑‍💼', title: 'Office Work', desc: 'Productivity, multitasking, energy efficient' },
  ];

  return (
    <div>
      <h2 className="section-title">Choose Your Purpose</h2>
      <div className="purpose-grid">
        {purposes.map(purpose => (
          <div
            key={purpose.id}
            className={`purpose-card ${selectedPurpose === purpose.id ? 'selected' : ''}`}
            onClick={() => setSelectedPurpose(purpose.id)}
          >
            <div className="card-icon">{purpose.icon}</div>
            <h3 className="card-title">{purpose.title}</h3>
            <p className="card-desc">{purpose.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Budget Slider Component
const BudgetSlider = ({ budget, setBudget }) => (
  <div className="slider-container">
    <div className="slider-header">
      <h2 className="slider-title">Set Your Budget</h2>
      <div className="budget-display">${budget.toLocaleString()}</div>
    </div>
    <input
      type="range"
      min="500"
      max="5000"
      step="50"
      value={budget}
      onChange={(e) => setBudget(parseInt(e.target.value))}
      className="slider"
    />
    <p className="budget-hint">
      {budget < 1000 && "Budget friendly - great for entry-level builds"}
      {budget >= 1000 && budget < 2000 && "Mid-range - excellent for 1440p gaming"}
      {budget >= 2000 && budget < 3500 && "High-end - 4K gaming and professional work"}
      {budget >= 3500 && "Premium - top-tier performance for everything"}
    </p>
  </div>
);

// Build Result Component
const BuildResult = ({ purpose, budget }) => {
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowResult(true), 100);
  }, []);

  const components = [
    { type: 'CPU', name: 'AMD Ryzen 9 7950X', price: 549, perf: 95 },
    { type: 'GPU', name: 'NVIDIA RTX 4080 Super', price: 999, perf: 92 },
    { type: 'Motherboard', name: 'ASUS ROG X670E', price: 399, perf: 88 },
    { type: 'RAM', name: '32GB DDR5 6000MHz', price: 179, perf: 90 },
    { type: 'Storage', name: '2TB Gen4 NVMe SSD', price: 159, perf: 94 },
    { type: 'PSU', name: '850W 80+ Gold Modular', price: 139, perf: 87 },
    { type: 'Case', name: 'Lian Li O11 Dynamic', price: 159, perf: 85 },
    { type: 'Cooler', name: 'Arctic Liquid Freezer II', price: 119, perf: 91 },
  ];

  return (
    <div className="build-result" style={{ opacity: showResult ? 1 : 0, transition: 'opacity 0.5s' }}>
      <div>
        <h2 className="section-title">Your AI-Generated Build</h2>
        {components.map((comp, idx) => (
          <div key={idx} className="component-card" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="component-header">
              <div>
                <div style={{ color: '#00e5ff', fontSize: '0.9rem', marginBottom: '0.3rem' }}>{comp.type}</div>
                <div className="component-name">{comp.name}</div>
              </div>
              <div className="component-price">${comp.price}</div>
            </div>
            <div className="perf-bar">
              <div className="perf-fill" style={{ width: `${comp.perf}%` }}></div>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Performance Score: {comp.perf}/100</div>
          </div>
        ))}
      </div>
      
      <div className="ai-panel">
        <div className="ai-panel-title">
          <Brain size={24} color="#00e5ff" />
          AI Analysis
        </div>
        <div className="insight-item">
          <strong>CPU Choice:</strong> AMD Ryzen 9 7950X selected for its exceptional multi-core performance, perfect for {purpose === 'gaming' ? 'gaming and streaming' : 'your workload'}.
        </div>
        <div className="insight-item">
          <strong>GPU Power:</strong> RTX 4080 Super delivers 4K gaming at 120+ FPS with ray tracing enabled.
        </div>
        <div className="insight-item">
          <strong>Stability:</strong> All components verified for compatibility. Power delivery exceeds requirements by 15%.
        </div>
        <div className="score-badge">
          <Star size={16} fill="#00ff99" color="#00ff99" />
          Overall Score: 93/100
        </div>
      </div>
    </div>
  );
};

// Loading Component
const LoadingScreen = ({ stage }) => {
  const stages = [
    'Analyzing CPU performance...',
    'Comparing GPU benchmarks...',
    'Optimizing compatibility...',
    'Calculating best value...',
    'Finalizing your build...'
  ];

  return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <div className="loading-text">{stages[stage] || stages[0]}</div>
    </div>
  );
};

// ==================== MAIN APP ====================
const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [budget, setBudget] = useState(1500);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [showBuild, setShowBuild] = useState(false);

  const startBuild = () => {
    setCurrentView('wizard');
  };

  const generateBuild = () => {
    setIsLoading(true);
    setLoadingStage(0);
    
    const interval = setInterval(() => {
      setLoadingStage(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            setShowBuild(true);
          }, 500);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        {/* Background Effects */}
        <div className="bg-grid"></div>
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>

        {/* Navigation */}
        <Navigation currentView={currentView} setCurrentView={setCurrentView} />

        {/* Loading Screen */}
        {isLoading && <LoadingScreen stage={loadingStage} />}

        {/* Views */}
        {currentView === 'home' && !showBuild && (
          <Hero onStartBuild={startBuild} />
        )}

        {currentView === 'wizard' && !showBuild && (
          <>
            <PurposeSelection 
              selectedPurpose={selectedPurpose} 
              setSelectedPurpose={setSelectedPurpose} 
            />
            {selectedPurpose && (
              <>
                <BudgetSlider budget={budget} setBudget={setBudget} />
                <div style={{ textAlign: 'center', padding: '2rem', position: 'relative', zIndex: 1 }}>
                  <button className="btn btn-primary" onClick={generateBuild}>
                    <Sparkles size={20} />
                    Generate My Build
                    <TrendingUp size={20} />
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {showBuild && (
          <BuildResult purpose={selectedPurpose} budget={budget} />
        )}
      </div>
    </>
  );
};

export default App;