import { useState, useEffect, useRef } from 'react';
import { Play, Square, Activity, Bell, MapPin } from 'lucide-react';
import './DeviceTracker.css';

const DeviceTracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [permissionState, setPermissionState] = useState('');
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  
  const wakeLockRef = useRef(null);
  const geoWatchRef = useRef(null);
  const lastAccelRef = useRef({ x: 0, y: 0, z: 0 });
  
  // Try to acquire Wake Lock
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        console.log('Wake Lock is active');
      }
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  };

  const releaseWakeLock = () => {
    if (wakeLockRef.current !== null) {
      wakeLockRef.current.release()
        .then(() => {
          wakeLockRef.current = null;
        });
    }
  };

  // Accelerometer Steps Handler
  const handleMotion = (event) => {
    if (!event.accelerationIncludingGravity) return;
    const { x, y, z } = event.accelerationIncludingGravity;
    
    // Simple peak detection for steps
    const deltaX = Math.abs(x - lastAccelRef.current.x);
    const deltaY = Math.abs(y - lastAccelRef.current.y);
    const deltaZ = Math.abs(z - lastAccelRef.current.z);
    
    // Threshold usually around 1.5 - 2 for gentle walking, adjusting based on gravity
    if (deltaX + deltaY + deltaZ > 2.5) {
        setSteps(prev => prev + 1);
    }
    
    lastAccelRef.current = { x, y, z };
  };

  const startTracking = async () => {
    setIsTracking(true);
    
    // 1. Wake Lock
    await requestWakeLock();

    // 2. Geolocation Distance (simplified tracking)
    if ('geolocation' in navigator) {
      geoWatchRef.current = navigator.geolocation.watchPosition(
        (position) => {
          // In a real app we'd calculate Haversine distance from last lat/log
          // Here we'll just increment nominally for demo purposes
          setDistance(prev => prev + 0.01);
        },
        (error) => console.log('Geolocation error:', error),
        { enableHighAccuracy: true }
      );
    }

    // 3. Device Motion for Steps
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        setPermissionState(permission);
        if (permission === 'granted') {
          window.addEventListener('devicemotion', handleMotion);
        }
      } catch (err) {
        console.error('DeviceMotion error', err);
      }
    } else {
      // Non-iOS 13+ devices
      window.addEventListener('devicemotion', handleMotion);
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
    releaseWakeLock();
    if (geoWatchRef.current !== null) {
      navigator.geolocation.clearWatch(geoWatchRef.current);
    }
    window.removeEventListener('devicemotion', handleMotion);
    
    // Sync steps back to local storage
    const todayLog = JSON.parse(localStorage.getItem('aura-log-today') || '{"values":{"steps": 6230}}');
    if (!todayLog.values) todayLog.values = {};
    todayLog.values.steps = (todayLog.values.steps || 0) + steps;
    localStorage.setItem('aura-log-today', JSON.stringify(todayLog));
  };

  const enableNotifications = async () => {
    if (!('Notification' in window)) return;
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification('Aura Tracking', {
        body: 'Hourly hydration reminders enabled!',
      });
      // In real app: schedule hourly service worker push
    }
  };

  return (
    <div className="tracker-card glass-panel">
      <div className="tracker-header">
        <div>
          <h3>Live Workout Tracker</h3>
          <p>Uses Web APIs: Geolocation, Accel, WakeLock</p>
        </div>
        <button className="icon-btn" onClick={enableNotifications} title="Enable Hydration Reminders">
          <Bell size={18} color="var(--accent-teal)" />
        </button>
      </div>

      <div className="tracker-stats">
        <div className="t-stat">
          <Activity size={18} color="var(--accent-purple)" />
          <span>{steps} steps</span>
        </div>
        <div className="t-stat">
          <MapPin size={18} color="var(--accent-blue)" />
          <span>{distance.toFixed(2)} km</span>
        </div>
      </div>

      <div className="tracker-actions">
        {!isTracking ? (
          <button className="track-btn start-btn" onClick={startTracking}>
            <Play size={16} fill="currentColor" /> Start Tracking
          </button>
        ) : (
          <button className="track-btn stop-btn" onClick={stopTracking}>
            <Square size={16} fill="currentColor" /> Stop Tracking
          </button>
        )}
      </div>
    </div>
  );
};

export default DeviceTracker;
