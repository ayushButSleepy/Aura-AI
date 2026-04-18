import { useState } from 'react';
import './MetricCard.css';

const MetricCard = ({ title, value, unit, icon: Icon, progress, color, subtitle, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="glass-panel metric-card animate-fade-up"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="metric-header">
        <div className="metric-icon" style={{ backgroundColor: `${color}18`, color }}>
          <Icon size={18} />
        </div>
        <h3 className="metric-title">{title}</h3>
      </div>
      <div className="metric-body">
        <div className="metric-value-container">
          <span className="metric-value font-display">{value}</span>
          <span className="metric-unit">{unit}</span>
        </div>
        {subtitle && <p className="metric-subtitle">{subtitle}</p>}
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{
              width: `${Math.min(progress, 100)}%`,
              background: `linear-gradient(90deg, ${color}aa, ${color})`,
              boxShadow: hovered ? `0 0 12px ${color}80` : 'none',
            }}
          />
        </div>
        <div className="progress-label">
          <span style={{ color: color, fontWeight: 600 }}>{progress}%</span>
          <span style={{ color: 'var(--text-muted)' }}>of daily goal</span>
        </div>
      </div>
    </div>
  );
};
export default MetricCard;
