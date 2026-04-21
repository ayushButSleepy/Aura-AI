import { useState } from 'react';
import { User, Mail, Target, Save, CheckCircle, Flag, Activity, Scale, Ruler } from 'lucide-react';
import './Profile.css';

const HEALTH_GOALS = [
  'Improve daily step count and fitness',
  'Better sleep quality and routine',
  'Manage stress and mental wellness',
  'Healthy weight management',
  'Build cardiovascular endurance',
  'Increase daily water intake',
];

const Profile = () => {
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('aura-profile');
    if (saved) return JSON.parse(saved);
    return {
      name: 'Alex User', email: 'alex.user@example.com',
      healthGoal: HEALTH_GOALS[0], age: '24', gender: 'Other',
      height: '170', weight: '70', activityLevel: 'Moderately active'
    };
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('aura-profile', JSON.stringify(profileData));
    
    // Also update basic currentUser mock
    const current = JSON.parse(localStorage.getItem('currentUser') || '{}');
    current.name = profileData.name;
    current.email = profileData.email;
    localStorage.setItem('currentUser', JSON.stringify(current));

    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const initials = (profileData.name || 'User').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  // Compute BMI
  const heightM = parseInt(profileData.height) / 100;
  const bmi = heightM > 0 ? (parseInt(profileData.weight) / (heightM * heightM)).toFixed(1) : 0;

  return (
    <div className="profile-container">
      <div className="page-header animate-fade-up delay-1">
        <h1 className="text-gradient font-display">Profile</h1>
        <p>Manage your personal details and health goals</p>
      </div>

      <div className="glass-panel profile-card animate-fade-up delay-2">
        <div className="profile-header-area">
          <div className="profile-avatar-ring">
            <div className="profile-avatar-inner">{initials}</div>
          </div>
          <div className="profile-meta">
            <h2>{profileData.name}</h2>
            <p className="profile-sub">{profileData.email}</p>
            <div className="profile-badge">
              <Flag size={11} /> SDG 3 Participant
            </div>
            {bmi > 0 && (
              <div className="profile-badge" style={{marginTop:'0.4rem', background: 'var(--accent-purple-dim)', color: 'var(--accent-purple)'}}>
                BMI: {bmi}
              </div>
            )}
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
            ) : (
              <button className="save-btn" onClick={handleSave}>
                <Save size={16} /> Save
              </button>
            )}
          </div>
        </div>

        {showSuccess && (
          <div className="success-banner">
            <CheckCircle size={16} /> Profile updated successfully!
          </div>
        )}

        <form className="profile-form" onSubmit={handleSave}>
          <div className="form-group">
            <label><User size={14} /> Full Name</label>
            {isEditing ? <input type="text" name="name" value={profileData.name || ''} onChange={handleChange} className="glass-input" /> : <div className="read-only-field">{profileData.name || '—'}</div>}
          </div>
          <div className="form-group">
            <label><Mail size={14} /> Email Address</label>
            {isEditing ? <input type="email" name="email" value={profileData.email || ''} onChange={handleChange} className="glass-input" /> : <div className="read-only-field">{profileData.email || '—'}</div>}
          </div>
          
          <div className="form-row" style={{display: 'flex', gap: '1rem'}}>
            <div className="form-group" style={{flex: 1}}>
              <label><User size={14} /> Age</label>
              {isEditing ? <input type="number" name="age" value={profileData.age || ''} onChange={handleChange} className="glass-input" /> : <div className="read-only-field">{profileData.age || '—'}</div>}
            </div>
            <div className="form-group" style={{flex: 1}}>
              <label><User size={14} /> Gender</label>
              {isEditing ? (
                <select name="gender" value={profileData.gender} onChange={handleChange} className="glass-input glass-select-full">
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              ) : <div className="read-only-field">{profileData.gender || '—'}</div>}
            </div>
          </div>

          <div className="form-row" style={{display: 'flex', gap: '1rem'}}>
            <div className="form-group" style={{flex: 1}}>
              <label><Ruler size={14} /> Height (cm)</label>
              {isEditing ? <input type="number" name="height" value={profileData.height || ''} onChange={handleChange} className="glass-input" /> : <div className="read-only-field">{profileData.height || '—'} cm</div>}
            </div>
            <div className="form-group" style={{flex: 1}}>
              <label><Scale size={14} /> Weight (kg)</label>
              {isEditing ? <input type="number" name="weight" value={profileData.weight || ''} onChange={handleChange} className="glass-input" /> : <div className="read-only-field">{profileData.weight || '—'} kg</div>}
            </div>
          </div>

          <div className="form-group">
            <label><Activity size={14} /> Activity Level</label>
            {isEditing ? (
              <select name="activityLevel" value={profileData.activityLevel} onChange={handleChange} className="glass-input glass-select-full">
                <option value="Sedentary">Sedentary (little to no exercise)</option>
                <option value="Lightly active">Lightly active (1-3 days/week)</option>
                <option value="Moderately active">Moderately active (3-5 days/week)</option>
                <option value="Very active">Very active (6-7 days/week)</option>
              </select>
            ) : <div className="read-only-field">{profileData.activityLevel || '—'}</div>}
          </div>

          <div className="form-group">
            <label><Target size={14} /> Primary Health Goal</label>
            {isEditing ? (
              <select name="healthGoal" value={profileData.healthGoal} onChange={handleChange} className="glass-input glass-select-full">
                {HEALTH_GOALS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            ) : (
              <div className="read-only-field goal-chip">{profileData.healthGoal}</div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
