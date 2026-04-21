import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, User, Loader2 } from 'lucide-react';
import './Insights.css';

const SUGGESTIONS = [
  'How is my sleep trend this week?',
  'What can I do to hit 10,000 steps today?',
  'Am I drinking enough water?',
  'What does my wellness score mean?',
];

const Insights = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your Aura AI health companion. I've looked at your health data — ask me anything for personal advice tailored to your goals!",
      sender: 'ai',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const generateSystemPrompt = () => {
    const profile = JSON.parse(localStorage.getItem('aura-profile') || '{}');
    const todayLogRaw = localStorage.getItem('aura-log-today');
    const todayLog = todayLogRaw ? JSON.parse(todayLogRaw) : { values: {} };
    const settings = JSON.parse(localStorage.getItem('aura-settings') || '{}');
    
    // Fallback constants
    const weight = parseInt(profile.weight) || 70;
    const height = parseInt(profile.height) || 170;
    const age = parseInt(profile.age) || 25;
    const gender = profile.gender || 'Other';
    const activityMap = {
      'Sedentary': 1.2,
      'Lightly active': 1.375,
      'Moderately active': 1.55,
      'Very active': 1.725
    };
    const activityFactor = activityMap[profile.activityLevel] || 1.2;

    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'Female') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5; // Default to Male calculation for Other
    }
    const dailyCals = Math.round(bmr * activityFactor);
    
    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);

    // Dynamic Goals
    const stepsGoal = settings.stepsGoal || 10000;
    const sleepGoal = settings.sleepGoal || 8;
    const waterGoal = settings.waterGoal || 3;

    // Weekly Trends
    const weeklyDataRaw = localStorage.getItem('aura-weekly-data');
    let weeklyStepsAvg = 0;
    if (weeklyDataRaw) {
      const data = JSON.parse(weeklyDataRaw);
      weeklyStepsAvg = Math.round(data.reduce((acc, curr) => acc + curr.steps, 0) / 7);
    }

    return `You are Aura AI, a warm and knowledgeable personal health companion built for SDG 3. You analyze wellness data and provide personalized preventative health insights.

User Profile:
- Name: ${profile.name || 'User'}
- Age: ${age}, Gender: ${gender}
- Height: ${height}cm, Weight: ${weight}kg, BMI: ${bmi}
- Activity Level: ${profile.activityLevel || 'Sedentary'}
- Goal: ${profile.healthGoal || 'General wellness'}
- Daily Calorie Target (TDEE): ~${dailyCals} kcal

Daily Goals:
- Steps: ${stepsGoal}
- Sleep: ${sleepGoal} hours
- Hydration: ${waterGoal} liters

Today's Actual Logged Data:
- Steps: ${todayLog.values?.steps || 0}
- Sleep: ${todayLog.values?.sleep || 0} hours
- Hydration: ${todayLog.values?.water || 0} liters
- Heart Rate: ${todayLog.values?.heartRate || 70} bpm
- Calories Burned via Activity: ~${Math.round((todayLog.values?.steps || 0) * 0.04 * (weight / 70))} kcal
- Mood Score (1-5): ${todayLog.mood || 'Not logged'}

Weekly Trends:
- Steps avg: ${weeklyStepsAvg > 0 ? weeklyStepsAvg : 'Not enough data'}

Be concise, friendly and empathetic. Provide 1-2 specific, actionable insights specific to this exact person, not generic tips. Reference their real numbers in every response. Keep responses to 3-5 sentences max. Use plain text only, no markdown.`;
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');

    const userMsg = { id: Date.now(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.sender === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      const dynamicSystemPrompt = generateSystemPrompt();
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            ...history,
            { role: "user", parts: [{ text: userText }] }
          ],
          systemInstruction: {
            parts: [{ text: dynamicSystemPrompt }]
          },
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7
          }
        }),
      });

      const data = await response.json();
      
      let aiText = "I couldn't generate a response. Please try again.";
      if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
        aiText = data.candidates[0].content.parts[0].text;
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiText, sender: 'ai' }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'Connection error. Please check your network and try again.',
        sender: 'ai',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="insights-container">
      <div className="insights-header animate-fade-up delay-1">
        <h1 className="text-gradient font-display">
          <Sparkles size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
          AI Health Insights
        </h1>
        <p>Personalized preventative health analysis powered by real AI · SDG 3</p>
      </div>

      <div className="chat-wrapper animate-fade-up delay-2">
        {messages.length <= 1 && (
          <div className="suggestions-row">
            {SUGGESTIONS.map((s, i) => (
              <button key={i} className="suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>
            ))}
          </div>
        )}

        <div className="chat-interface glass-panel">
          <div className="messages-area">
            {messages.map(msg => (
              <div key={msg.id} className={`message-bubble ${msg.sender} animate-fade-up`}>
                {msg.sender === 'ai' && (
                  <div className="message-avatar ai-avatar"><Bot size={14} /></div>
                )}
                <div className="message-text">{msg.text}</div>
                {msg.sender === 'user' && (
                  <div className="message-avatar user-avatar"><User size={14} /></div>
                )}
              </div>
            ))}

            {loading && (
              <div className="message-bubble ai animate-fade-up">
                <div className="message-avatar ai-avatar"><Bot size={14} /></div>
                <div className="message-text typing-indicator">
                  <span className="dot" style={{ animationDelay: '0s' }} />
                  <span className="dot" style={{ animationDelay: '0.2s' }} />
                  <span className="dot" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ask about your health trends..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="send-btn" disabled={loading || !input.trim()}>
              {loading ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Insights;
