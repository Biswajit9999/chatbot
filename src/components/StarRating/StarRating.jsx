import { MdStar, MdStarBorder } from "react-icons/md";
import styles from "./StarRating.module.css";

export default function StarRating({ value = 0, onChange, size = 24 }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={styles.star}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          aria-pressed={value >= n}
          onClick={() => onChange(n)}
        >
          {value >= n ? (
            <MdStar size={size} className={styles.filled} />
          ) : (
            <MdStarBorder size={size} className={styles.empty} />
          )}
        </button>
      ))}
    </div>
  );
}