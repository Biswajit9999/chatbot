import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useChat } from "../../context/ChatContext";
import person from "../../assests/person.png";
import bot from "../../assests/bot.png";
import styles from "./History.module.css";

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

const dayLabel = (iso) => {
  const d = new Date(iso);
  return d.toDateString() === new Date().toDateString()
    ? "Today's chats"
    : `Chats on ${d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
};

function HistoryMessage({ message }) {
  const isUser = message.sender === "user";
  const fb = message.feedback;

  return (
    <article className={styles.msg}>
      <img
        src={isUser ? person : bot}
        alt=""
        className={`${styles.avatar} ${isUser ? styles.round : ""}`}
      />
      <div className={styles.msgBody}>
        <p className={styles.name}>{isUser ? "You" : "Product Recommendation AI"}</p>
        <p className={styles.text}>{message.text}</p>
        <p className={styles.time}>{formatTime(message.time)}</p>
        {fb?.vote === "up" && (
          <p className={styles.fb}>
            Liked{fb.rating ? ` · Rated ${fb.rating}/5` : ""}
          </p>
        )}
        {fb?.vote === "down" && (
          <p className={styles.fb}>
            Disliked{fb.comment ? ` · Feedback: ${fb.comment}` : ""}
          </p>
        )}
      </div>
    </article>
  );
}

export default function History() {
  const { saved } = useChat();
  const [filter, setFilter] = useState("all");

  const visible = saved.filter(
    (c) => filter === "all" || c.rating === Number(filter)
  );

  // group by day, newest first (saved is already newest first)
  const groups = {};
  visible.forEach((c) => {
    const label = dayLabel(c.savedAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(c);
  });

  return (
    <Layout>
      <div className={styles.page}>
        <h2 className={styles.heading}>Previous Suggestions</h2>

        <div className={styles.filter}>
          <label htmlFor="rating-filter" className={styles.filterLabel}>
            Filter by rating
          </label>
          <select
            id="rating-filter"
            className={styles.select}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Ratings</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "Star" : "Stars"}
              </option>
            ))}
          </select>
        </div>

        {visible.length === 0 ? (
          <p className={styles.empty}>No saved conversations yet.</p>
        ) : (
          Object.entries(groups).map(([label, convos]) => (
            <section key={label}>
              <h3 className={styles.day}>{label}</h3>

              {convos.map((c) => (
                <div key={c.id} className={styles.convo}>
                  {c.messages.map((m) => (
                    <HistoryMessage key={m.id} message={m} />
                  ))}

                  <div className={styles.summary}>
                    <p>
                      Overall rating: {c.rating ? `${c.rating}/5` : "Not rated"}
                    </p>
                    {c.feedback && <p>Feedback: {c.feedback}</p>}
                  </div>
                </div>
              ))}
            </section>
          ))
        )}
      </div>
    </Layout>
  );
}