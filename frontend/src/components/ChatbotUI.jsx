import React, { useState } from "react";
import axios from "axios";

const ChatbotUI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.get("http://localhost:3000/recommend");
      const botMsg = {
        text:
          res.data.recommendations.map((r) => r.name).join(", ") ||
          "No songs found",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: "Error fetching recommendations.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl mb-6">
      <div className="h-64 overflow-y-scroll mb-2 border p-2 rounded">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-1 ${
              msg.sender === "bot" ? "text-green-400" : "text-blue-300"
            }`}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
        {loading && (
          <div className="text-green-400">
            <strong>bot:</strong> typing...
          </div>
        )}
      </div>
      <div className="flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-grow p-2 rounded-l bg-gray-700 text-white"
          placeholder="Ask for music..."
        />
        <button onClick={sendMessage} className="bg-blue-500 p-2 rounded-r">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatbotUI;
