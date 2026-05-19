import React, { useState } from "react";

function AIChat() {

  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------- AI LOGIC ----------------
  const getAIResponse = (q) => {

    const text = q.toLowerCase();

    if (text.includes("follow")) {
      return "Hi, just following up regarding your inquiry. Let me know if you're interested, we can schedule a quick demo.";
    }

    if (text.includes("price")) {
      return "Our pricing depends on your needs. We offer flexible and affordable plans. Let's connect to discuss the best option.";
    }

    if (text.includes("marketing")) {
      return "To grow your business, use WhatsApp automation + Facebook Ads + proper follow-up system.";
    }

    if (text.includes("demo")) {
      return "We can schedule a free demo to show how our system works. Please share your available time.";
    }

    if (text.includes("crm")) {
      return "CRM helps you manage leads, track follow-ups, automate tasks, and increase sales efficiently.";
    }

    // default
    return "Thank you for your message. Our team will get back to you shortly.";
  };

  // ---------------- ASK AI ----------------
  const askAI = () => {

    if (!question.trim() || loading) return;

    setLoading(true);

    const userQuestion = question;

    setTimeout(() => {

      const answer = getAIResponse(userQuestion);

      const newMessage = {
        question: userQuestion,
        answer
      };

      setChat(prev => [...prev, newMessage]);

      setQuestion("");
      setLoading(false);

    }, 600);

  };

  // ---------------- ENTER KEY FIX ----------------
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      askAI();
    }
  };

  // ---------------- COPY ----------------
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  // ---------------- CLEAR CHAT ----------------
  const clearChat = () => {
    if (window.confirm("Clear all chat?")) {
      setChat([]);
    }
  };

  // ---------------- UI ----------------
  return (

    <div style={{
      border: "1px solid #ddd",
      padding: "20px",
      borderRadius: "10px",
      maxWidth: "600px",
      background: "#fafafa"
    }}>

      <h2>🤖 AI Assistant</h2>
      <p>Ask about follow-up, pricing, marketing, CRM, demo etc.</p>

      {/* INPUT */}
      <div style={{ display: "flex", gap: "10px" }}>

        <input
          placeholder="Ask AI..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}   // ✅ FIX
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={askAI}
          disabled={loading}
          style={{
            padding: "10px 20px",
            background: loading ? "#9ca3af" : "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "..." : "Ask"}
        </button>

      </div>

      <br />

      {/* CLEAR BUTTON */}
      {chat.length > 0 && (
        <button onClick={clearChat} style={{ marginBottom: "10px" }}>
          Clear Chat
        </button>
      )}

      {/* LOADING */}
      {loading && <p>🤖 Thinking...</p>}

      {/* CHAT */}
      <h3>Conversation</h3>

      {chat.length === 0 && <p>No messages yet.</p>}

      {chat.map((c, i) => (
        <div key={i} style={{
          marginBottom: "15px",
          background: "#fff",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #eee"
        }}>

          <p><b>You:</b> {c.question}</p>
          <p><b>AI:</b> {c.answer}</p>

          <button onClick={() => copyText(c.answer)}>
            Copy Reply
          </button>

        </div>
      ))}

    </div>
  );
}

export default AIChat;