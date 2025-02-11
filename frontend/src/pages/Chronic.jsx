import { useState, useRef, useEffect } from "react";

const Chronic = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, chat_type: "chronic_management" }),
      });

      const data = await response.json();
      const botMessage = { role: "bot", content: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-100 shadow-lg rounded-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white text-center py-3 font-semibold">
        AI Nutrition Assistant
      </div>

      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[75%] ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-gray-500">AI is typing...</div>}
        <div ref={chatEndRef} />
      </div>

      {/* Input Field */}
      <div className="flex items-center gap-2 p-3 border-t bg-white">
        <input
          type="text"
          className="flex-grow p-2 border rounded-lg focus:outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chronic;
