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
    const todayLog = JSON.parse(localStorage.getItem('aura-log-today') || '{"values":{}}');
    
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

    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr += (gender === 'Female') ? -161 : 5;
    const dailyCals = Math.round(bmr * activityFactor);
    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);

    return `You are Aura AI, a warm and knowledgeable personal health companion built for SDG 3. You analyze wellness data and provide personalized preventative health insights.

User Profile:
- Name: ${profile.name || 'User'}
- Age: ${age}, Gender: ${gender}
- Height: ${height}cm, Weight: ${weight}kg, BMI: ${bmi}
- Activity Level: ${profile.activityLevel || 'Sedentary'}
- Goal: ${profile.healthGoal || 'General wellness'}
- Daily Calorie Target (TDEE): ~${dailyCals} kcal
- Recommended Daily Steps: 10,000

Today's Logged Data:
- Steps: ${todayLog.values?.steps || 0}
- Sleep: ${todayLog.values?.sleep || 0} hours
- Hydration: ${todayLog.values?.water || 0} liters
- Heart Rate: ${todayLog.values?.heartRate || 70} bpm
- Calories Burned via Activity: ~${Math.round((todayLog.values?.steps || 0) * 0.04 * (weight / 70))} kcal

Weekly Tends:
- Steps avg: 6500
- Sleep avg: 7.1 hours
- Streak: 3 days

Be concise, friendly and empathetic. Provide 1-2 specific, actionable insights specific to this exact person, not generic tips. Reference their stats directly. Keep responses to 3-5 sentences max. Use plain text only, no markdown.`;
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
        role: m.sender === 'ai' ? 'assistant' : 'user',
        content: m.text,
      }));

      const dynamicSystemPrompt = generateSystemPrompt();

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 1000,
          messages: [
            { role: 'system', content: dynamicSystemPrompt },
            ...history,
            { role: 'user', content: userText },
          ],
        }),
      });

      const data = await response.json();
      const aiText = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";
      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiText, sender: 'ai' }]);
    } catch {
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
