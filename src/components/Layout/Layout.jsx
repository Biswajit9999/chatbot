import { useState } from "react";
import { Link } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import { MdMenu, MdClose, MdBrightness4 } from "react-icons/md";
import { useTheme } from "../../context/ThemeContext";
import newChatIcon from "../../assests/newchat.png";
import editIcon from "../../assests/edit.png";
import styles from "./Layout.module.css";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const { startNewChat } = useChat();

  const handleNew = () => {
    startNewChat();
    setOpen(false);
  };
  return (
    <div className={styles.app}>
      {open && (
        <div className={styles.backdrop} onClick={() => setOpen(false)} />
      )}

      <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={() => setOpen(false)}
        >
          Close <MdClose size={18} />
        </button>

        {/* Saving the current chat comes in a later step */}
        <Link to="/" className={styles.newBtn} onClick={handleNew}>
          <img src={newChatIcon} alt="" className={styles.newIcon} />
          <span className={styles.newText}>Want new suggestion?</span>
          <img src={editIcon} alt="" className={styles.editIcon} />
        </Link>

        <Link
          to="/history"
          className={styles.prevBtn}
          onClick={() => setOpen(false)}
        >
          Previous Suggestions
        </Link>
      </aside>

      <div className={styles.column}>
        <header className={styles.header}>
          <button
            type="button"
            className={styles.menuBtn}
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <MdMenu size={26} />
          </button>

          <h1 className={styles.title}>Product Recommendation AI</h1>

          <button
            type="button"
            className={styles.themeBtn}
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            <span className={styles.themeLabel}>
              {theme === "light" ? "Light" : "Dark"}
            </span>
            <MdBrightness4 size={26} />
          </button>
        </header>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
