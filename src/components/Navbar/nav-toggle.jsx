import styles from "./navbar.module.css";

export function NavToggle({ menuOpen, onClick }) {
  return (
    <button
      className={`${styles.menuButton} ${menuOpen ? styles.menuOpen : ""}`}
      aria-label="Toggle menu"
      onClick={onClick}
    >
      <span className={styles.menuIcon}></span>
      <span className={styles.menuIcon}></span>
      <span className={styles.menuIcon}></span>
    </button>
  );
}
