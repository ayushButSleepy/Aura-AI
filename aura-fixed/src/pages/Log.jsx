import { useState } from 'react';
import { Activity, Moon, Droplets, Heart, CheckCircle2, Save } from 'lucide-react';
import './Log.css';

const FIELDS = [
  { key: 'steps', label: 'Steps Taken', icon: Activity, color: '#00e5c3', unit: 'steps', min: 0, max: 30000, step: 100, default: 6230, goal: 10000 },
  { key: 'sleep', label: 'Sleep Duration', icon: Moon, color: '#a855f7', unit: 'hours', min: 0, max: 12, step: 0.5, default: 7.2, goal: 8 },
  { key: 'water', label: 'Water Intake', icon: Droplets, color: '#3b82f6', unit: 'liters', min: 0, max: 5, step: 0.1, default: 1.5, goal: 3 },
  { key: 'heartRate', label: 'Resting Heart Rate', icon: Heart, color: '#f472b6', unit: 'bpm', min: 40, max: 120, step: 1, default: 72, goal: 70 },
];

const Log = () => {
  const [values, setValues] = useState(() => {
    const saved = localStorage.getItem('aura-log-today');
    if (saved) {
      const p = JSON.parse(saved);
      if (p.date === new Date().toDateString()) return p.values;
    }
    return Object.fromEntries(FIELDS.map(f => [f.key, f.default]));
  });
  const [saved, setSaved] = useState(false);
  const [mood, setMood] = useState(() => {
    const s = localStorage.getItem('aura-log-today');
    return s ? JSON.parse(s).mood || 3 : 3;
  });

  const handleChange = (key, val) => {
    setValues(prev => ({ ...prev, [key]: parseFloat(val) }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('aura-log-today', JSON.stringify({
      date: new Date().toDateString(),
      values,
      mood,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const MOODS = ['😔', '😕', '😐', '🙂', '😄'];

  return (
    <div className="log-container">
      <div className="page-header animate-fade-up delay-1">
        <h1 className="text-gradient font-display">Log Today</h1>
        <p>Enter your health data for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="log-grid animate-fade-up delay-2">
        {FIELDS.map((f) => {
          const pct = Math.min(100, Math.round((values[f.key] / f.goal) * 100));
          return (
            <div key={f.key} className="glass-panel log-card">
              <div className="log-card-header">
                <div className="log-icon" style={{ background: `${f.color}18`, color: f.color }}>
                  <f.icon size={18} />
                </div>
                <div>
                  <h3>{f.label}</h3>
                  <p className="log-goal">Goal: {f.goal} {f.unit}</p>
                </div>
                <div className="log-pct" style={{ color: pct >= 100 ? '#00e5c3' : f.color }}>
                  {pct}%
                </div>
              </div>
              <div className="log-value-display font-display" style={{ color: f.color }}>
                {values[f.key]} <span className="log-unit">{f.unit}</span>
              </div>
              <input
                type="range"
                min={f.min} max={f.max} step={f.step}
                value={values[f.key]}
                onChange={e => handleChange(f.key, e.target.value)}
                className="log-slider"
                style={{ '--slider-color': f.color }}
              />
              <div className="slider-labels">
                <span>{f.min}</span>
                <span>{f.max} {f.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mood */}
      <div className="glass-panel mood-panel animate-fade-up delay-3">
        <h3 className="font-display">How are you feeling today?</h3>
        <div className="mood-row">
          {MOODS.map((m, i) => (
            <button
              key={i}
              className={`mood-btn ${mood === i + 1 ? 'active' : ''}`}
              onClick={() => { setMood(i + 1); setSaved(false); }}
            >
              <span>{m}</span>
              <span className="mood-label">{['Poor', 'Low', 'Okay', 'Good', 'Great'][i]}</span>
            </button>
          ))}
        </div>
      </div>

      <button className={`save-log-btn ${saved ? 'saved' : ''}`} onClick={handleSave}>
        {saved ? <><CheckCircle2 size={18} /> Saved!</> : <><Save size={18} /> Save Today's Log</>}
      </button>
    </div>
  );
};

export default Log;
