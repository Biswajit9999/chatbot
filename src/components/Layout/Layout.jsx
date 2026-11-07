import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdMenu, MdClose, MdBrightness4 } from "react-icons/md";
import { useTheme } from "../../context/ThemeContext";
import newChatIcon from "../../assests/newchat.png";
import editIcon from "../../assests/edit.png";
import styles from "./Layout.module.css";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const goTo = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className={styles.app}>
      {open && <div className={styles.backdrop} onClick={() => setOpen(false)} />}

      <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={() => setOpen(false)}
        >
          Close <MdClose size={18} />
        </button>

        {/* Saving the current chat comes in a later step */}
        <button type="button" className={styles.newBtn} onClick={() => goTo("/")}>
          <img src={newChatIcon} alt="" className={styles.newIcon} />
          <span className={styles.newText}>Want new suggestion?</span>
          <img src={editIcon} alt="" className={styles.editIcon} />
        </button>

        <button
          type="button"
          className={styles.prevBtn}
          onClick={() => goTo("/history")}
        >
          Previous Suggestions
        </button>
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