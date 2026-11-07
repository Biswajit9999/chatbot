import { createContext, useContext, useState } from "react";
import { getReplies } from "../utils/chatLogic";

const ChatContext = createContext(null);

let counter = 0;
const makeMessage = (sender, text) => ({
  id: `${Date.now()}-${counter++}`,
  sender, // "user" | "ai"
  text,
  time: new Date().toISOString(),
  feedback: sender === "ai" ? { vote: null, rating: 0, comment: "" } : null,
});

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [stage, setStage] = useState("product"); // "product" | "budget" | "done"
  const [product, setProduct] = useState(null);

  const sendMessage = (text) => {
    const clean = text.trim();
    if (!clean) return;

    const result = getReplies({ text: clean, stage, product });

    setMessages((prev) => [
      ...prev,
      makeMessage("user", clean),
      ...result.replies.map((reply) => makeMessage("ai", reply)),
    ]);
    setStage(result.stage);
    setProduct(result.product);
  };

  const resetChat = () => {
    setMessages([]);
    setStage("product");
    setProduct(null);
  };
    const updateFeedback = (id, patch) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id && m.feedback
          ? { ...m, feedback: { ...m.feedback, ...patch } }
          : m
      )
    );
  };

  return (
    <ChatContext.Provider
      value={{ messages, stage, product, sendMessage, resetChat, updateFeedback }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);