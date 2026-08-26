import Link from "next/link";
import Image from "next/image";
import { ChevronDown, CreditCard, MapPin, Phone } from "lucide-react";
import type { CTA, GlobalSettings } from "@/types/cms";

export function Header({ settings }: { settings: GlobalSettings }) {
  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="container utility-inner">
          <span><MapPin size={15} aria-hidden /> Southern Wisconsin service</span>
          <span>Locally owned waste collection, recycling, and rentals</span>
        </div>
      </div>
      <div className="container nav">
        <Link className="brand" href="/" aria-label="NDS Environmental Solutions home">
          <Image className="brand-logo" src="/nds-assets/nds-logo-primary.png" alt="NDS Environmental Solutions logo" width={600} height={373} priority />
        </Link>
        <NavStack settings={settings} label="Primary navigation" className="desktop-nav-stack" />
        <details className="mobile-nav-panel">
          <summary>
            <span>Menu</span>
            <ChevronDown size={18} aria-hidden />
          </summary>
          <NavStack settings={settings} label="Mobile navigation" />
        </details>
      </div>
    </header>
  );
}

function NavStack({ className = "", label, settings }: { className?: string; label: string; settings: GlobalSettings }) {
  return (
    <div className={`nav-stack ${className}`}>
      <nav className="nav-links" aria-label={label}>
        {settings.navigation.map((item) => (
          <NavigationItem item={item} key={item.href} />
        ))}
      </nav>
      <div className="header-actions">
        <Link className="phone-link" href={`tel:${settings.phone}`}><Phone size={17} aria-hidden /> {settings.phone}</Link>
        <Link className="btn secondary" href="/contact">Get Quote</Link>
        <Link className="btn primary" href="/make-a-payment"><CreditCard size={17} aria-hidden /> Pay Bill</Link>
      </div>
    </div>
  );
}

function NavigationItem({ item }: { item: CTA }) {
  if (!item.children?.length) {
    return <Link href={item.href}>{item.label}</Link>;
  }

  return (
    <details className="nav-menu">
      <summary>
        <span>{item.label}</span>
        <ChevronDown size={15} aria-hidden />
      </summary>
      <div className="nav-dropdown">
        <div className="nav-dropdown-heading">
          <strong>{item.label}</strong>
          {item.description ? <span>{item.description}</span> : null}
        </div>
        <div className="nav-dropdown-links">
          {item.children.map((child) => (
            <Link href={child.href} key={`${item.href}-${child.label}`}>
              <strong>{child.label}</strong>
              {child.description ? <span>{child.description}</span> : null}
            </Link>
          ))}
        </div>
      </div>
    </details>
  );
}
