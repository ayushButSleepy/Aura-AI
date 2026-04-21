import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Brain, User, Settings, HeartPulse, LogIn, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <nav className="glass-nav sidebar-container">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <HeartPulse size={22} color="var(--accent-teal)" />
        </div>
        <h2 className="text-gradient font-display">Aura</h2>
      </div>

      <div className="nav-section-label">MAIN</div>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/insights" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Brain size={18} />
          <span>AI Insights</span>
        </NavLink>
        <NavLink to="/log" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LogIn size={18} />
          <span>Log Today</span>
        </NavLink>
      </div>

      <div className="nav-section-label" style={{marginTop:'1.5rem'}}>ACCOUNT</div>
      <div className="nav-links bottom-links">
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={18} />
          <span>Profile</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
      </div>

      <div className="sdg-badge">
        <div className="sdg-inner">
          <span className="sdg-num">SDG 3</span>
          <span className="sdg-label">Good Health & Well-being</span>
        </div>
      </div>

      <button className="nav-item logout-btn" onClick={handleLogout} style={{ marginTop: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
        <LogOut size={18} />
        <span>Log Out</span>
      </button>
    </nav>
  );
};

export default Sidebar;
