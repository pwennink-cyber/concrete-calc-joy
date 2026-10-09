import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { company, contact, navLinks } from "@/config/site";

export function Footer() {
  return (
    <footer className="no-print bg-anthracite text-anthracite-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="flex items-baseline gap-1 text-lg font-extrabold">
            <span className="text-primary">Betaalbaar</span>
            <span>Beton.nl</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed opacity-80">
            {company.promise}
          </p>
        </div>

        <nav aria-label="Footer navigatie">
          <p className="text-sm font-bold uppercase tracking-wide opacity-70">Navigatie</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/bestellen" className="hover:text-primary">
                Beton bestellen
              </Link>
            </li>
            {navLinks.slice(2).map((link) => (
              <li key={link.label}>
                <a
                  href={`${"to" in link ? link.to : "/"}${"hash" in link && link.hash ? `#${link.hash}` : ""}`}
                  className="hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide opacity-70">Contact</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={`tel:${contact.phone}`} className="inline-flex items-center gap-2 hover:text-primary">
                <Phone className="size-4" aria-hidden />
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="hover:text-primary">
                {contact.email}
              </a>
            </li>
            <li className="opacity-80">{contact.openingHours}</li>
            <li className="opacity-80">{company.address}</li>
            <li className="opacity-60">KvK: {company.kvk}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs opacity-70">
          <p>
            © {new Date().getFullYear()} {company.name} — BTW: {company.vatNumber}
          </p>
          <div className="flex gap-4">
            <Link to="/voorwaarden" className="hover:text-primary">
              Voorwaarden
            </Link>
            <Link to="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link to="/cookies" className="hover:text-primary">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
