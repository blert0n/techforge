export function Footer() {
  return (
    <footer style={styles.footer}>
      <p>&copy; {new Date().getFullYear()} TechForge. All rights reserved.</p>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    padding: "1.5rem 2rem",
    borderTop: "1px solid #e5e5e5",
    fontFamily: "sans-serif",
    fontSize: "0.875rem",
    color: "#666",
  },
};
