import { useState } from "react";
import {
  MdThumbUp,
  MdThumbUpOffAlt,
  MdThumbDown,
  MdThumbDownOffAlt,
} from "react-icons/md";
import person from "../../assests/person.png";
import bot from "../../assests/bot.png";
import StarRating from "../StarRating/StarRating";
import FeedbackModal from "../FeedbackModal/FeedbackModal";
import { useChat } from "../../context/ChatContext";
import styles from "./Message.module.css";

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function Message({ message }) {
  const { updateFeedback } = useChat();
  const [modalOpen, setModalOpen] = useState(false);

  const isUser = message.sender === "user";
  const fb = message.feedback;

  const handleLike = () => updateFeedback(message.id, { vote: "up" });

  const handleDislike = () => {
    updateFeedback(message.id, { vote: "down" });
    setModalOpen(true);
  };

  const handleSubmitFeedback = (comment) => {
    updateFeedback(message.id, { comment });
    setModalOpen(false);
  };

  return (
    <article className={styles.card}>
      <img
        src={isUser ? person : bot}
        alt={isUser ? "You" : "Product Recommendation AI"}
        className={`${styles.avatar} ${isUser ? styles.round : ""}`}
      />

      <div className={styles.body}>
        <p className={styles.name}>{isUser ? "You" : "Product Recommendation AI"}</p>
        <p className={styles.text}>{message.text}</p>

        <div className={styles.meta}>
          <p className={styles.time}>{formatTime(message.time)}</p>

          {!isUser && (
            <div className={styles.thumbs}>
              <button
                type="button"
                className={styles.thumb}
                aria-label="Like"
                aria-pressed={fb.vote === "up"}
                onClick={handleLike}
              >
                {fb.vote === "up" ? <MdThumbUp /> : <MdThumbUpOffAlt />}
              </button>
              <button
                type="button"
                className={styles.thumb}
                aria-label="Dislike"
                aria-pressed={fb.vote === "down"}
                onClick={handleDislike}
              >
                {fb.vote === "down" ? <MdThumbDown /> : <MdThumbDownOffAlt />}
              </button>
            </div>
          )}
        </div>

        {!isUser && fb.vote === "up" && (
          <div className={styles.rate}>
            <p className={styles.rateLabel}>Rate this reponse:</p>
            <StarRating
              value={fb.rating}
              onChange={(n) => updateFeedback(message.id, { rating: n })}
            />
          </div>
        )}

        {!isUser && fb.vote === "down" && fb.comment && (
          <p className={styles.comment}>Your feedback: {fb.comment}</p>
        )}
      </div>

      {modalOpen && (
        <FeedbackModal
          onSubmit={handleSubmitFeedback}
          onClose={() => setModalOpen(false)}
        />
      )}
    </article>
  );
}