import { useState } from 'react';
import { User, Mail, Target, Save, CheckCircle, Flag } from 'lucide-react';
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
    return saved ? JSON.parse(saved) : {
      name: 'Alex User', email: 'alex.user@example.com',
      healthGoal: HEALTH_GOALS[0], age: '24', country: 'India',
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
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const initials = profileData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

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
              <Flag size={11} /> {profileData.country || 'Global'} · SDG 3 Participant
            </div>
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
          {[
            { name: 'name', label: 'Full Name', icon: User, type: 'text' },
            { name: 'email', label: 'Email Address', icon: Mail, type: 'email' },
            { name: 'age', label: 'Age', icon: User, type: 'number' },
            { name: 'country', label: 'Country', icon: Flag, type: 'text' },
          ].map(field => (
            <div className="form-group" key={field.name}>
              <label><field.icon size={14} /> {field.label}</label>
              {isEditing ? (
                <input type={field.type} name={field.name} value={profileData[field.name] || ''}
                  onChange={handleChange} className="glass-input" />
              ) : (
                <div className="read-only-field">{profileData[field.name] || '—'}</div>
              )}
            </div>
          ))}

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
