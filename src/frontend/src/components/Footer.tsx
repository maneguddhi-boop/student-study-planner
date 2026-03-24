export function Footer() {
  const year = new Date().getFullYear();
  const href = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;
  return (
    <footer className="text-center text-xs text-muted-foreground py-3 border-t border-border">
      © {year}. Built with ❤️ using{" "}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-foreground transition-colors"
      >
        caffeine.ai
      </a>
    </footer>
  );
}
