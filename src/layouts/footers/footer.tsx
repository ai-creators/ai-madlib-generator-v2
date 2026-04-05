export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex items-center justify-between p-4 text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} AI MadLibs. All rights reserved.</span>
        <nav className="flex gap-4">
          <a href="/about" className="transition-colors hover:text-foreground">
            About
          </a>
          <a href="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </a>
          <a href="/terms" className="transition-colors hover:text-foreground">
            Terms
          </a>
        </nav>
      </div>
    </footer>
  );
}
