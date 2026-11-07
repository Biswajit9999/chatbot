import { useState } from "react";
import styles from "./ChatInput.module.css";

export default function ChatInput({ onSend, onSave, canSave }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.input}
        placeholder="Please tell me about your query!"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className={styles.ask}>
        Ask
      </button>
      <button
        type="button"
        className={styles.save}
        disabled={!canSave}
        onClick={onSave}
      >
        Save
      </button>
    </form>
  );
}