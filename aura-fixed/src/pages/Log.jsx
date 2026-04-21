import { useState, useEffect } from 'react';
import { Activity, Moon, Droplets, Heart, CheckCircle2, Save, Utensils, Dumbbell, Plus } from 'lucide-react';
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
      if (p.date === new Date().toDateString() && p.values) return p.values;
    }
    return Object.fromEntries(FIELDS.map(f => [f.key, f.default]));
  });

  const [foodLog, setFoodLog] = useState(() => {
    const saved = localStorage.getItem('aura-log-today');
    if (saved) {
      const p = JSON.parse(saved);
      if (p.date === new Date().toDateString() && p.food) return p.food;
    }
    return [];
  });

  const [workoutLog, setWorkoutLog] = useState(() => {
    const saved = localStorage.getItem('aura-log-today');
    if (saved) {
      const p = JSON.parse(saved);
      if (p.date === new Date().toDateString() && p.workouts) return p.workouts;
    }
    return [];
  });

  const [saved, setSaved] = useState(false);
  const [mood, setMood] = useState(() => {
    const s = localStorage.getItem('aura-log-today');
    return s ? JSON.parse(s).mood || 3 : 3;
  });

  // Food Form State
  const [foodName, setFoodName] = useState('');
  const [foodCals, setFoodCals] = useState('');

  // Workout Form State
  const [workoutType, setWorkoutType] = useState('Walking');
  const [workoutDuration, setWorkoutDuration] = useState('');

  const profile = JSON.parse(localStorage.getItem('aura-profile') || '{"weight":"70"}');
  const weight = parseInt(profile.weight) || 70;

  const handleChange = (key, val) => {
    setValues(prev => ({ ...prev, [key]: parseFloat(val) }));
    setSaved(false);
  };

  const addFood = (e) => {
    e.preventDefault();
    if (!foodName || !foodCals) return;
    setFoodLog(prev => [...prev, { name: foodName, cals: parseInt(foodCals), id: Date.now() }]);
    setFoodName(''); setFoodCals('');
    setSaved(false);
  };

  const addWorkout = (e) => {
    e.preventDefault();
    if (!workoutDuration) return;
    
    // Simple MET multipliers
    const multipliers = { 'Walking': 3.5, 'Running': 9.8, 'Cycling': 7.5, 'Yoga': 3.0 };
    const met = multipliers[workoutType] || 5;
    const durationHrs = parseInt(workoutDuration) / 60;
    const burn = Math.round(met * weight * durationHrs); // Rough kcal formula

    setWorkoutLog(prev => [...prev, { type: workoutType, duration: parseInt(workoutDuration), burn, id: Date.now() }]);
    setWorkoutDuration('');
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('aura-log-today', JSON.stringify({
      date: new Date().toDateString(),
      values,
      mood,
      food: foodLog,
      workouts: workoutLog
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const MOODS = ['😔', '😕', '😐', '🙂', '😄'];

  const totalFoodCals = foodLog.reduce((acc, curr) => acc + curr.cals, 0);
  const totalWorkoutBurn = workoutLog.reduce((acc, curr) => acc + curr.burn, 0);
  const stepsBurn = Math.round(values.steps * 0.04 * (weight / 70));
  const totalCalsBurned = stepsBurn + totalWorkoutBurn;

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

      <div className="log-grid animate-fade-up delay-3" style={{marginTop: '1.5rem'}}>
        {/* Food Log */}
        <div className="glass-panel log-card">
          <div className="log-card-header">
            <div className="log-icon" style={{ background: `rgba(251, 191, 36, 0.18)`, color: '#fbbf24' }}>
              <Utensils size={18} />
            </div>
            <div>
              <h3>Food & Calories</h3>
              <p className="log-goal">Consumed: {totalFoodCals} kcal</p>
            </div>
          </div>
          <form className="mini-form" onSubmit={addFood} style={{marginTop: '1rem', display: 'flex', gap: '0.5rem'}}>
            <input type="text" placeholder="Meal name" className="glass-input" value={foodName} onChange={e=>setFoodName(e.target.value)} style={{flex: 2, padding: '0.5rem'}} />
            <input type="number" placeholder="Kcal" className="glass-input" value={foodCals} onChange={e=>setFoodCals(e.target.value)} style={{flex: 1, padding: '0.5rem'}} />
            <button type="submit" className="icon-btn" style={{flexShrink: 0}}><Plus size={16}/></button>
          </form>
          <div className="mini-list" style={{marginTop: '1rem'}}>
            {foodLog.map(f => (
              <div key={f.id} style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginBottom:'0.3rem'}}>
                <span>{f.name}</span>
                <span className="font-display" style={{color:'#fbbf24'}}>{f.cals} kcal</span>
              </div>
            ))}
          </div>
        </div>

        {/* Workout Log */}
        <div className="glass-panel log-card">
          <div className="log-card-header">
            <div className="log-icon" style={{ background: `rgba(244, 114, 182, 0.18)`, color: '#f472b6' }}>
              <Dumbbell size={18} />
            </div>
            <div>
              <h3>Workouts</h3>
              <p className="log-goal">Burned: {totalCalsBurned.toLocaleString()} kcal (Total)</p>
            </div>
          </div>
          <form className="mini-form" onSubmit={addWorkout} style={{marginTop: '1rem', display: 'flex', gap: '0.5rem'}}>
            <select className="glass-input glass-select-full" value={workoutType} onChange={e=>setWorkoutType(e.target.value)} style={{flex: 2, padding: '0.5rem'}}>
              <option>Walking</option><option>Running</option><option>Cycling</option><option>Yoga</option>
            </select>
            <input type="number" placeholder="Min" className="glass-input" value={workoutDuration} onChange={e=>setWorkoutDuration(e.target.value)} style={{flex: 1, padding: '0.5rem'}} />
            <button type="submit" className="icon-btn" style={{flexShrink: 0}}><Plus size={16}/></button>
          </form>
          <div className="mini-list" style={{marginTop: '1rem'}}>
            {workoutLog.map(w => (
              <div key={w.id} style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginBottom:'0.3rem'}}>
                <span>{w.type} ({w.duration}m)</span>
                <span className="font-display" style={{color:'#f472b6'}}>{w.burn} kcal</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mood */}
      <div className="glass-panel mood-panel animate-fade-up delay-4" style={{marginTop: '1.5rem'}}>
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

      <button className={`save-log-btn ${saved ? 'saved' : ''}`} onClick={handleSave} style={{marginTop: '1.5rem'}}>
        {saved ? <><CheckCircle2 size={18} /> Saved!</> : <><Save size={18} /> Save Today's Log</>}
      </button>
    </div>
  );
};

export default Log;
