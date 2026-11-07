import { useEffect, useState } from "react";
import { MdFeedback, MdClose } from "react-icons/md";
import styles from "./FeedbackModal.module.css";

export default function FeedbackModal({ onSubmit, onClose }) {
  const [text, setText] = useState("");

  // close with the Escape key
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(text.trim());
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <form
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className={styles.header}>
          <MdFeedback size={26} />
          <h2 id="feedback-title" className={styles.title}>
            Provide Additional Feedback
          </h2>
          <button
            type="button"
            className={styles.close}
            aria-label="Close"
            onClick={onClose}
          >
            <MdClose size={24} />
          </button>
        </div>

        <textarea
          className={styles.textarea}
          aria-label="Additional feedback"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />

        <div className={styles.actions}>
          <button type="submit" className={styles.submit}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}