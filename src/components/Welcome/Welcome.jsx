import bot from "../../assests/bot.png";
import styles from "./Welcome.module.css";

const cards = ["Jeans", "Smartphone", "Laptop", "T-Shirt"];

export default function Welcome({ onPick }) {
  return (
    <div className={styles.wrap}>
      <h2 className={styles.heading}>Hi, Please tell me what you want?</h2>
      <img src={bot} alt="Chat bot" className={styles.bot} />

      <div className={styles.grid}>
        {cards.map((name) => (
          <button
            key={name}
            type="button"
            className={styles.card}
            onClick={() => onPick(name)}
          >
            <span className={styles.title}>{name}</span>
            <span className={styles.sub}>Get immediate AI generated response</span>
          </button>
        ))}
      </div>
    </div>
  );
}