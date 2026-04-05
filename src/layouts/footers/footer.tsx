export default function Footer() {
  return (
    <footer className="border-t">
      <div className="text-muted-foreground container mx-auto flex items-center justify-between p-4 text-sm">
        <span>
          © {new Date().getFullYear()} AI MadLibs. All rights reserved.
        </span>
        <nav className="flex gap-4">
          <a href="/about" className="hover:text-foreground transition-colors">
            About
          </a>
          <a
            href="/privacy"
            className="hover:text-foreground transition-colors"
          >
            Privacy
          </a>
          <a href="/terms" className="hover:text-foreground transition-colors">
            Terms
          </a>
        </nav>
      </div>
    </footer>
  );
}
