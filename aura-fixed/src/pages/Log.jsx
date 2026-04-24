import { useState, useEffect } from 'react';
import { Activity, Moon, Droplets, Heart, CheckCircle2, Save, Utensils, Dumbbell, Plus } from 'lucide-react';
import './Log.css';

const FIELDS = [
  { key: 'steps', label: 'Steps Taken', icon: Activity, color: '#00e5c3', unit: 'steps', min: 0, max: 30000, step: 100, default: 6230, goal: 10000 },
  { key: 'sleep', label: 'Sleep Duration', icon: Moon, color: '#a855f7', unit: 'hours', min: 0, max: 12, step: 0.5, default: 7.2, goal: 8 },
  { key: 'water', label: 'Water Intake', icon: Droplets, color: '#3b82f6', unit: 'liters', min: 0, max: 5, step: 0.1, default: 1.5, goal: 3 },
  { key: 'heartRate', label: 'Resting Heart Rate', icon: Heart, color: '#f472b6', unit: 'bpm', min: 40, max: 120, step: 1, default: 72, goal: 70 },
];

const PRESET_MEALS = [
  { name: 'Breakfast', cals: 400 },
  { name: 'Lunch', cals: 600 },
  { name: 'Dinner', cals: 700 },
  { name: 'Snack', cals: 200 },
  { name: 'Protein Shake', cals: 300 },
  { name: 'Salad', cals: 150 }
];

const DEFAULT_WEEK_DATA = [
  { day: 'Mon', steps: 5200, sleep: 6.5, water: 1.2 },
  { day: 'Tue', steps: 7800, sleep: 7.0, water: 1.8 },
  { day: 'Wed', steps: 6100, sleep: 6.8, water: 1.5 },
  { day: 'Thu', steps: 9200, sleep: 7.5, water: 2.0 },
  { day: 'Fri', steps: 8400, sleep: 7.2, water: 1.7 },
  { day: 'Sat', steps: 4500, sleep: 8.1, water: 1.4 },
  { day: 'Sun', steps: 6230, sleep: 7.2, water: 1.5 },
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

  // Workout Form State
  const [workoutType, setWorkoutType] = useState('Walking');
  const [workoutDuration, setWorkoutDuration] = useState('');

  const profile = JSON.parse(localStorage.getItem('aura-profile') || '{"weight":"70"}');
  const weight = parseInt(profile.weight) || 70;

  const handleChange = (key, val) => {
    setValues(prev => ({ ...prev, [key]: parseFloat(val) }));
    setSaved(false);
  };

  const addPresetMeal = (meal) => {
    setFoodLog(prev => [...prev, { name: meal.name, cals: meal.cals, id: Date.now() }]);
    setSaved(false);
  };

  const removeFood = (id) => {
    setFoodLog(prev => prev.filter(f => f.id !== id));
    setSaved(false);
  };

  const addWorkout = (e) => {
    e.preventDefault();
    if (!workoutDuration) return;
    
    const multipliers = { 'Walking': 3.5, 'Running': 9.8, 'Cycling': 7.5, 'Yoga': 3.0 };
    const met = multipliers[workoutType] || 5;
    const durationHrs = parseInt(workoutDuration) / 60;
    const burn = Math.round(met * weight * durationHrs);

    setWorkoutLog(prev => [...prev, { type: workoutType, duration: parseInt(workoutDuration), burn, id: Date.now() }]);
    setWorkoutDuration('');
    setSaved(false);
  };
  
  const removeWorkout = (id) => {
    setWorkoutLog(prev => prev.filter(w => w.id !== id));
    setSaved(false);
  };

  const handleSave = () => {
    const timestamp = Date.now();
    const dateString = new Date().toDateString();
    
    // Save daily log
    localStorage.setItem('aura-log-today', JSON.stringify({
      date: dateString,
      timestamp,
      values,
      mood,
      food: foodLog,
      workouts: workoutLog
    }));
    
    // Update weekly chart data
    const weeklyDataRaw = localStorage.getItem('aura-weekly-data');
    let weekData = weeklyDataRaw ? JSON.parse(weeklyDataRaw) : DEFAULT_WEEK_DATA;
    
    const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const todayStr = shortDayNames[new Date().getDay()];
    
    // Ensure today's data is the last data point
    const lastDataPoint = weekData[weekData.length - 1];
    if (lastDataPoint && lastDataPoint.day === todayStr) {
      weekData[weekData.length - 1] = {
        ...lastDataPoint,
        steps: values.steps,
        sleep: values.sleep,
        water: values.water
      };
    } else {
      weekData.shift();
      weekData.push({
        day: todayStr,
        steps: values.steps,
        sleep: values.sleep,
        water: values.water
      });
    }
    
    localStorage.setItem('aura-weekly-data', JSON.stringify(weekData));

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
              {f.key === 'steps' && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  ≈ {Math.round(values.steps * 0.04 * (weight / 70))} kcal burned
                </div>
              )}
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
              <h3>Food Log</h3>
              <p className="log-goal">Consumed: {totalFoodCals} kcal</p>
            </div>
          </div>
          
          <div className="preset-meals" style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {PRESET_MEALS.map(meal => (
              <button 
                key={meal.name}
                onClick={() => addPresetMeal(meal)}
                className="preset-btn"
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '1rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}
              >
                + {meal.name} ({meal.cals})
              </button>
            ))}
          </div>
          
          <div className="mini-list" style={{marginTop: '1rem', maxHeight: '120px', overflowY: 'auto'}}>
            {foodLog.map(f => (
              <div key={f.id} style={{display:'flex', justifyContent:'space-between', alignItems: 'center', fontSize:'0.85rem', padding: '0.4rem', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                <span>{f.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="font-display" style={{color:'#fbbf24'}}>{f.cals} kcal</span>
                  <button onClick={() => removeFood(f.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                </div>
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
              <p className="log-goal">Burned: {totalCalsBurned} kcal (Total)</p>
            </div>
          </div>
          <form className="mini-form" onSubmit={addWorkout} style={{marginTop: '1rem', display: 'flex', gap: '0.5rem'}}>
            <select className="glass-input glass-select-full" value={workoutType} onChange={e=>setWorkoutType(e.target.value)} style={{flex: 2, padding: '0.5rem'}}>
              <option>Walking</option><option>Running</option><option>Cycling</option><option>Yoga</option>
            </select>
            <input type="number" placeholder="Min" className="glass-input" value={workoutDuration} onChange={e=>setWorkoutDuration(e.target.value)} style={{flex: 1, padding: '0.5rem'}} />
            <button type="submit" className="icon-btn" style={{flexShrink: 0}}><Plus size={16}/></button>
          </form>
          <div className="mini-list" style={{marginTop: '1rem', maxHeight: '120px', overflowY: 'auto'}}>
            {workoutLog.map(w => (
              <div key={w.id} style={{display:'flex', justifyContent:'space-between', alignItems: 'center', fontSize:'0.85rem', padding: '0.4rem', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                <span>{w.type} ({w.duration}m)</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="font-display" style={{color:'#f472b6'}}>{w.burn} kcal</span>
                  <button onClick={() => removeWorkout(w.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                </div>
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
