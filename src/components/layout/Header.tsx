import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { company, contact, navLinks } from "@/config/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-baseline gap-1 font-extrabold tracking-tight">
          <span className="text-lg text-primary">Betaalbaar</span>
          <span className="text-lg text-anthracite">Beton.nl</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Hoofdmenu">
          <Link to="/bestellen" className="text-sm font-semibold text-foreground hover:text-primary">
            Beton bestellen
          </Link>
          {navLinks.slice(2).map((link) => (
            <a
              key={link.label}
              href={`${"to" in link ? link.to : "/"}${"hash" in link && link.hash ? `#${link.hash}` : ""}`}
              className="text-sm font-semibold text-foreground hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`tel:${contact.phone}`}
            className="inline-flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent"
          >
            <Phone className="size-4" aria-hidden />
            {contact.phone}
          </a>
          <Link
            to="/bestellen"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90"
          >
            Bereken je prijs
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Menu sluiten" : "Menu openen"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3" aria-label="Mobiel menu">
            <Link
              to="/bestellen"
              className="rounded-md px-2 py-3 text-base font-semibold hover:bg-accent"
              onClick={() => setOpen(false)}
            >
              Beton bestellen
            </Link>
            {navLinks.slice(2).map((link) => (
              <a
                key={link.label}
                href={`${"to" in link ? link.to : "/"}${"hash" in link && link.hash ? `#${link.hash}` : ""}`}
                className="rounded-md px-2 py-3 text-base font-semibold hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href={`tel:${contact.phone}`}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-md border border-input px-4 py-3 text-sm font-semibold"
            >
              <Phone className="size-4" aria-hidden />
              {contact.phone}
            </a>
            <Link
              to="/bestellen"
              className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
              onClick={() => setOpen(false)}
            >
              Bereken je prijs
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
