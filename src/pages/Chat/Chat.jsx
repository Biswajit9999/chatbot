import { useEffect, useRef } from "react";
import Layout from "../../components/Layout/Layout";
import Welcome from "../../components/Welcome/Welcome";
import Message from "../../components/Message/Message";
import ChatInput from "../../components/ChatInput/ChatInput";
import { useChat } from "../../context/ChatContext";
import styles from "./Chat.module.css";

export default function Chat() {
  const { messages, sendMessage } = useChat();
  const scrollRef = useRef(null);

  // keep the newest message in view
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSave = () => {
    // Saving to localStorage comes in Step 6
  };

  return (
    <Layout>
      <div className={styles.chat}>
        <div className={styles.scroll} ref={scrollRef}>
          {messages.length === 0 ? (
            <Welcome onPick={sendMessage} />
          ) : (
            messages.map((m) => <Message key={m.id} message={m} />)
          )}
        </div>

        <ChatInput
          onSend={sendMessage}
          onSave={handleSave}
          canSave={messages.length > 0}
        />
      </div>
    </Layout>
  );
}