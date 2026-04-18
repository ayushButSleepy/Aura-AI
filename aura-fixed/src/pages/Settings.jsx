import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Globe, Bell, Shield, HeartPulse } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  const [stepGoal, setStepGoal] = useState(10000);
  const [sleepGoal, setSleepGoal] = useState(8);
  const [waterGoal, setWaterGoal] = useState(3);

  useEffect(() => {
    if (document.body.classList.contains('light-mode')) setIsDarkMode(false);
    const s = localStorage.getItem('aura-settings');
    if (s) {
      const p = JSON.parse(s);
      setNotifications(p.notifications ?? true);
      setLanguage(p.language ?? 'en');
      setStepGoal(p.stepGoal ?? 10000);
      setSleepGoal(p.sleepGoal ?? 8);
      setWaterGoal(p.waterGoal ?? 3);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) { document.body.classList.add('light-mode'); setIsDarkMode(false); }
    else { document.body.classList.remove('light-mode'); setIsDarkMode(true); }
  };

  const saveSettings = () => {
    localStorage.setItem('aura-settings', JSON.stringify({ notifications, language, stepGoal, sleepGoal, waterGoal }));
  };

  return (
    <div className="settings-container">
      <div className="page-header animate-fade-up delay-1">
        <h1 className="text-gradient font-display"><SettingsIcon size={26} style={{display:'inline',verticalAlign:'middle',marginRight:'8px'}}/>Settings</h1>
        <p>Customize your Aura experience and health goals</p>
      </div>

      <div className="settings-grid">
        {/* Appearance */}
        <div className="glass-panel settings-card animate-fade-up delay-2">
          <div className="settings-card-header"><Sun size={16}/> Appearance</div>
          <div className="settings-row">
            <div className="settings-info">
              <div className="settings-icon">{isDarkMode ? <Moon size={18}/> : <Sun size={18}/>}</div>
              <div><h4>Theme Mode</h4><p>Toggle between Dark and Light mode</p></div>
            </div>
            <button className={`toggle-btn ${isDarkMode ? 'active' : ''}`} onClick={toggleTheme}>
              <div className="toggle-slider"/>
            </button>
          </div>
          <div className="settings-row">
            <div className="settings-info">
              <div className="settings-icon"><Globe size={18}/></div>
              <div><h4>Language</h4><p>Your preferred language</p></div>
            </div>
            <select className="glass-select" value={language} onChange={e => { setLanguage(e.target.value); saveSettings(); }}>
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-panel settings-card animate-fade-up delay-3">
          <div className="settings-card-header"><Bell size={16}/> Notifications</div>
          <div className="settings-row">
            <div className="settings-info">
              <div className="settings-icon"><Bell size={18}/></div>
              <div><h4>Daily Reminders</h4><p>Hydration, step & sleep reminders</p></div>
            </div>
            <button className={`toggle-btn ${notifications ? 'active' : ''}`} onClick={() => { setNotifications(!notifications); saveSettings(); }}>
              <div className="toggle-slider"/>
            </button>
          </div>
        </div>

        {/* Health Goals */}
        <div className="glass-panel settings-card animate-fade-up delay-4">
          <div className="settings-card-header"><HeartPulse size={16}/> Daily Health Goals</div>
          {[
            { label: 'Daily Step Goal', value: stepGoal, set: setStepGoal, min: 2000, max: 20000, step: 500, unit: 'steps' },
            { label: 'Sleep Goal', value: sleepGoal, set: setSleepGoal, min: 5, max: 10, step: 0.5, unit: 'hours' },
            { label: 'Water Intake Goal', value: waterGoal, set: setWaterGoal, min: 1, max: 5, step: 0.5, unit: 'liters' },
          ].map(g => (
            <div key={g.label} className="goal-row">
              <div className="goal-label-row">
                <span>{g.label}</span>
                <span className="goal-value font-display">{g.value} <small>{g.unit}</small></span>
              </div>
              <input type="range" min={g.min} max={g.max} step={g.step} value={g.value}
                className="log-slider" style={{'--slider-color':'var(--accent-teal)'}}
                onChange={e => { g.set(parseFloat(e.target.value)); saveSettings(); }}
              />
            </div>
          ))}
        </div>

        {/* Privacy */}
        <div className="glass-panel settings-card animate-fade-up delay-5">
          <div className="settings-card-header"><Shield size={16}/> Privacy & Data</div>
          <div className="privacy-note">
            <Shield size={14} style={{color:'var(--accent-teal)', flexShrink:0}}/>
            <p>All your health data is stored <strong>locally on your device only</strong>. Aura never sends personal health data to external servers. AI chat queries are anonymized. This aligns with SDG 3's commitment to equitable and safe digital health.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
