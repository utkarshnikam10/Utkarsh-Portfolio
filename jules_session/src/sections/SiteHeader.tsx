import { UTKARSH } from "@/constants/portfolio";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-header__mark" href="#top" aria-label="Utkarsh portfolio home">
        <span>U</span>
        <strong>{UTKARSH.name}</strong>
      </a>
      <nav className="site-header__nav" aria-label="Portfolio sections">
        <a href="#codex">Codex</a>
        <a href="#campaigns">Campaigns</a>
        <a href="#ascent">Ascent</a>
      </nav>
      <a className="site-header__contact" href="#contact">
        Initiate contact
      </a>
    </header>
  );
}
