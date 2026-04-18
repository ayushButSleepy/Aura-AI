import { useState, useEffect } from 'react';
import { Activity, Moon, Droplets, Target, CheckCircle2, Circle, TrendingUp, Globe2, Heart } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import './Dashboard.css';

const DEFAULT_CHALLENGES = [
  { id: 1, text: 'Drink a glass of water upon waking', done: false },
  { id: 2, text: 'Take a 15-minute walk outside', done: false },
  { id: 3, text: '5 minutes of mindful breathing', done: false },
  { id: 4, text: 'Eat one fruit or vegetable serving', done: false },
  { id: 5, text: 'Sleep by 10:30 PM tonight', done: false },
];

const WEEK_DATA = [
  { day: 'Mon', steps: 5200, sleep: 6.5, water: 1.2 },
  { day: 'Tue', steps: 7800, sleep: 7.0, water: 1.8 },
  { day: 'Wed', steps: 6100, sleep: 6.8, water: 1.5 },
  { day: 'Thu', steps: 9200, sleep: 7.5, water: 2.0 },
  { day: 'Fri', steps: 8400, sleep: 7.2, water: 1.7 },
  { day: 'Sat', steps: 4500, sleep: 8.1, water: 1.4 },
  { day: 'Sun', steps: 6230, sleep: 7.2, water: 1.5 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [challenges, setChallenges] = useState(() => {
    const saved = localStorage.getItem('aura-challenges');
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = new Date().toDateString();
      if (parsed.date === today) return parsed.items;
    }
    return DEFAULT_CHALLENGES;
  });
  const [activeChart, setActiveChart] = useState('steps');
  const profile = JSON.parse(localStorage.getItem('aura-profile') || '{"name":"Alex"}');
  const firstName = profile.name.split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const toggleChallenge = (id) => {
    const updated = challenges.map(c => c.id === id ? { ...c, done: !c.done } : c);
    setChallenges(updated);
    localStorage.setItem('aura-challenges', JSON.stringify({
      date: new Date().toDateString(),
      items: updated,
    }));
  };

  const completedCount = challenges.filter(c => c.done).length;
  const wellnessScore = Math.round(62 + (completedCount / challenges.length) * 20);

  const chartConfig = {
    steps: { key: 'steps', label: 'Steps', color: '#00e5c3', unit: 'steps' },
    sleep: { key: 'sleep', label: 'Sleep', color: '#a855f7', unit: 'hrs' },
    water: { key: 'water', label: 'Hydration', color: '#3b82f6', unit: 'L' },
  };

  const metrics = [
    {
      title: 'Steps Today',
      value: '6,230',
      unit: 'steps',
      icon: Activity,
      progress: 62,
      color: '#00e5c3',
      subtitle: '↑ 8% vs yesterday',
    },
    {
      title: 'Sleep Quality',
      value: '7.2',
      unit: 'hours',
      icon: Moon,
      progress: 85,
      color: '#a855f7',
      subtitle: '↑ Great deep sleep',
    },
    {
      title: 'Hydration',
      value: '1.5',
      unit: 'liters',
      icon: Droplets,
      progress: 50,
      color: '#3b82f6',
      subtitle: '↓ Drink more water',
    },
    {
      title: 'Heart Rate',
      value: '72',
      unit: 'bpm',
      icon: Heart,
      progress: 80,
      color: '#f472b6',
      subtitle: '✓ Healthy resting',
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header animate-fade-up delay-1">
        <div>
          <p className="greeting-sub">Sunday, {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
          <h1 className="greeting font-display">{greeting}, {firstName}!</h1>
          <p className="subtitle">Your wellness score is <span style={{ color: 'var(--accent-teal)', fontWeight: 600 }}>{wellnessScore}</span> today. Keep pushing!</p>
        </div>
        <div className="wellness-score-ring">
          <svg viewBox="0 0 80 80" width="80" height="80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7"/>
            <circle
              cx="40" cy="40" r="34" fill="none"
              stroke="url(#scoreGrad)" strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 34 * wellnessScore / 100} ${2 * Math.PI * 34}`}
              strokeDashoffset={2 * Math.PI * 34 * 0.25}
              transform="rotate(-90 40 40)"
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00e5c3"/>
                <stop offset="100%" stopColor="#a855f7"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="score-label">
            <span className="score-num font-display">{wellnessScore}</span>
            <span className="score-text">score</span>
          </div>
        </div>
      </header>

      {/* SDG 3 Impact Banner */}
      <div className="sdg-banner animate-fade-up delay-2">
        <Globe2 size={18} className="sdg-icon" />
        <div>
          <strong>UN SDG 3 — Good Health & Well-being</strong>
          <span> · Aura helps track preventative health metrics that reduce burden on healthcare systems globally</span>
        </div>
        <div className="sdg-stat"><TrendingUp size={14}/> 2.1B people lack basic healthcare access</div>
      </div>

      {/* Metrics */}
      <section className="metrics-grid">
        {metrics.map((m, i) => (
          <MetricCard key={i} {...m} />
        ))}
      </section>

      {/* Weekly Chart */}
      <section className="chart-section glass-panel animate-fade-up delay-3">
        <div className="chart-header">
          <h2 className="font-display">7-Day Trends</h2>
          <div className="chart-tabs">
            {Object.entries(chartConfig).map(([key, cfg]) => (
              <button
                key={key}
                className={`chart-tab ${activeChart === key ? 'active' : ''}`}
                style={activeChart === key ? { borderColor: cfg.color, color: cfg.color, background: `${cfg.color}15` } : {}}
                onClick={() => setActiveChart(key)}
              >
                {cfg.label}
              </button>
            ))}
          </div>
        </div>
        <div className="chart-body">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={WEEK_DATA} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip />}/>
              <Line
                type="monotone"
                dataKey={chartConfig[activeChart].key}
                name={chartConfig[activeChart].label}
                stroke={chartConfig[activeChart].color}
                strokeWidth={2.5}
                dot={{ fill: chartConfig[activeChart].color, r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Challenges */}
      <section className="challenges-section glass-panel animate-fade-up delay-4">
        <div className="section-header">
          <div>
            <h2 className="font-display"><Target size={18} style={{ display:'inline', verticalAlign:'middle', marginRight:'8px', color:'var(--accent-pink)' }}/>Daily Challenges</h2>
            <p className="section-sub">{completedCount} of {challenges.length} completed</p>
          </div>
          <div className="challenge-progress-pill" style={{ background: `${completedCount === challenges.length ? 'var(--accent-teal)' : 'var(--surface-color)'}` }}>
            <span style={{ color: completedCount === challenges.length ? '#000' : 'var(--text-secondary)' }}>
              {completedCount === challenges.length ? '🎉 All done!' : `${Math.round(completedCount/challenges.length*100)}%`}
            </span>
          </div>
        </div>
        <div className="challenges-list">
          {challenges.map((c) => (
            <div
              key={c.id}
              className={`challenge-item ${c.done ? 'complete' : ''}`}
              onClick={() => toggleChallenge(c.id)}
            >
              <div className="challenge-check">
                {c.done
                  ? <CheckCircle2 size={20} color="var(--accent-teal)" />
                  : <Circle size={20} color="var(--surface-border-bright)" />
                }
              </div>
              <span>{c.text}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
