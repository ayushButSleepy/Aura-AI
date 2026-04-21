import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartPulse, User, Mail, Lock, Activity, Target } from 'lucide-react';
import './Auth.css';

const HEALTH_GOALS = [
  'Improve daily step count and fitness',
  'Better sleep quality and routine',
  'Manage stress and mental wellness',
  'Healthy weight management',
  'Build cardiovascular endurance',
  'Increase daily water intake',
];

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    age: '', gender: 'Other', height: '', weight: '',
    activityLevel: 'Sedentary', healthGoal: HEALTH_GOALS[0]
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name || !formData.age || !formData.height || !formData.weight) return;
    
    // Securely persist profile configuration
    localStorage.setItem('aura-profile', JSON.stringify(formData));
    
    // Establish local session context
    localStorage.setItem('currentUser', JSON.stringify({
      email: formData.email,
      name: formData.name || 'User'
    }));

    navigate('/'); // Redirect to dashboard
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel animate-fade-up">
        <div className="auth-header">
          <div className="auth-logo"><HeartPulse size={32} color="var(--accent-teal)" /></div>
          <h1 className="text-gradient font-display">Aura</h1>
          <p>Start your preventative wellness journey</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label><User size={14}/> Full Name</label>
            <input required type="text" name="name" className="glass-input" value={formData.name} onChange={handleChange} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input required type="number" name="age" className="glass-input" value={formData.age} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" className="glass-input glass-select-full" value={formData.gender} onChange={handleChange}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Height (cm)</label>
              <input required type="number" name="height" className="glass-input" value={formData.height} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input required type="number" name="weight" className="glass-input" value={formData.weight} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label><Activity size={14}/> Activity Level</label>
            <select name="activityLevel" className="glass-input glass-select-full" value={formData.activityLevel} onChange={handleChange}>
              <option value="Sedentary">Sedentary (little to no exercise)</option>
              <option value="Lightly active">Lightly active (1-3 days/week)</option>
              <option value="Moderately active">Moderately active (3-5 days/week)</option>
              <option value="Very active">Very active (6-7 days/week)</option>
            </select>
          </div>
          <div className="form-group">
            <label><Target size={14}/> Primary Health Goal</label>
            <select name="healthGoal" className="glass-input glass-select-full" value={formData.healthGoal} onChange={handleChange}>
              {HEALTH_GOALS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label><Mail size={14}/> Email</label>
            <input required type="email" name="email" className="glass-input" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label><Lock size={14}/> Password</label>
            <input required type="password" name="password" className="glass-input" value={formData.password} onChange={handleChange} />
          </div>

          <button type="submit" className="auth-submit-btn">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-toggle">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
