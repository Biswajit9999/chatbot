import { createContext, useContext, useState } from "react";
import { getReplies } from "../utils/chatLogic";

const ChatContext = createContext(null);
const STORAGE_KEY = "conversations";

let counter = 0;
const nextId = () => `${Date.now()}-${counter++}`;

const makeMessage = (sender, text) => ({
  id: nextId(),
  sender, // "user" | "ai"
  text,
  time: new Date().toISOString(),
  feedback: sender === "ai" ? { vote: null, rating: 0, comment: "" } : null,
});

const readSaved = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [stage, setStage] = useState("product"); // "product" | "budget" | "done"
  const [product, setProduct] = useState(null);
  const [chatId, setChatId] = useState(nextId);
  const [overall, setOverall] = useState({ rating: 0, comment: "" });
  const [saved, setSaved] = useState(readSaved);

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

  const updateFeedback = (id, patch) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id && m.feedback
          ? { ...m, feedback: { ...m.feedback, ...patch } }
          : m
      )
    );
  };

  // saving the same chat twice updates it instead of adding a duplicate
  const saveConversation = () => {
    if (messages.length === 0) return;

    const convo = {
      id: chatId,
      savedAt: new Date().toISOString(),
      messages,
      rating: overall.rating,
      feedback: overall.comment,
    };

    const next = saved.some((c) => c.id === chatId)
      ? saved.map((c) => (c.id === chatId ? convo : c))
      : [convo, ...saved];

    setSaved(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const resetChat = () => {
    setMessages([]);
    setStage("product");
    setProduct(null);
    setChatId(nextId());
    setOverall({ rating: 0, comment: "" });
  };

  // "Want new suggestion?" -> save what we have, then start fresh
  const startNewChat = () => {
    saveConversation();
    resetChat();
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        stage,
        product,
        saved,
        overall,
        setOverall,
        sendMessage,
        updateFeedback,
        saveConversation,
        startNewChat,
        resetChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);