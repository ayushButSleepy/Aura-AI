import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, User, Loader2 } from 'lucide-react';
import './Insights.css';

const SYSTEM_PROMPT = `You are Aura AI, a warm and knowledgeable personal health companion built for SDG 3 (Good Health and Well-being). You analyze wellness data and provide personalized preventative health insights.

The user's current health data:
- Steps today: 6,230 (goal: 10,000 — 62% complete)
- Sleep last night: 7.2 hours (goal: 8 hours — 90% quality score)
- Hydration: 1.5 liters (goal: 3 liters — 50% complete)
- Heart rate: 72 bpm (healthy resting range)
- Wellness score: 72/100

Weekly trends:
- Steps: Mon 5200, Tue 7800, Wed 6100, Thu 9200, Fri 8400, Sat 4500, Sun 6230
- Sleep: Mon 6.5h, Tue 7.0h, Wed 6.8h, Thu 7.5h, Fri 7.2h, Sat 8.1h, Sun 7.2h
- Hydration: Mon 1.2L, Tue 1.8L, Wed 1.5L, Thu 2.0L, Fri 1.7L, Sat 1.4L, Sun 1.5L

Be concise, friendly and empathetic. Provide 1-2 specific, actionable insights based on the data. Reference SDG 3 and global health access where relevant. Keep responses to 3-5 sentences max. Use plain text only, no markdown.`;

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
      text: "Hi! I'm your Aura AI health companion. I've looked at your health data — your sleep has been consistent this week which is great. However, your hydration is only at 50% today and your step count needs a push. Ask me anything about your wellness trends!",
      sender: 'ai',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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
            { role: 'system', content: SYSTEM_PROMPT },
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
