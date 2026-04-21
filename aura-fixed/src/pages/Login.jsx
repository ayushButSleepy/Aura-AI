import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartPulse, Mail, Lock } from 'lucide-react';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    const profileData = localStorage.getItem('aura-profile');
    if (profileData) {
      const parsed = JSON.parse(profileData);
      if (parsed.email === formData.email && parsed.password === formData.password) {
        localStorage.setItem('currentUser', JSON.stringify({
          email: parsed.email,
          name: parsed.name || 'User'
        }));
        navigate('/');
        return;
      }
    }
    setError('Invalid email or password. Please try again or create an account.');
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel animate-fade-up">
        <div className="auth-header">
          <div className="auth-logo"><HeartPulse size={32} color="var(--accent-teal)" /></div>
          <h1 className="text-gradient font-display">Aura</h1>
          <p>Welcome back to your health journey</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div style={{ color: 'var(--accent-pink)', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
          <div className="form-group">
            <label><Mail size={14}/> Email</label>
            <input required type="email" name="email" className="glass-input" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label><Lock size={14}/> Password</label>
            <input required type="password" name="password" className="glass-input" value={formData.password} onChange={handleChange} />
          </div>

          <button type="submit" className="auth-submit-btn">
            Log In
          </button>
        </form>

        <div className="auth-footer">
          New to Aura?{' '}
          <Link to="/signup" className="auth-toggle">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
