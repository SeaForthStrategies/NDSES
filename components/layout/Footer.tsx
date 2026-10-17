import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { GlobalSettings } from "@/types/cms";

export function Footer({ settings }: { settings: GlobalSettings }) {
  const tel = `tel:${settings.phone.replace(/[^\d+]/g, "")}`;
  const hours = settings.businessHours.split(/;\s*/).filter(Boolean);

  return (
    <footer className="site-footer">
      <div className="footer-cta">
        <div className="container footer-cta-inner">
          <div>
            <h2>Need trash service, recycling, or a dumpster?</h2>
            <p>Call the office or send a request, and NDS will confirm availability and pricing.</p>
          </div>
          <div className="footer-cta-actions">
            <a className="btn btn-gold" href={tel}><Phone size={18} aria-hidden /> {settings.phone}</a>
            <Link className="btn btn-on-dark" href="/contact">Request a Quote</Link>
          </div>
        </div>
      </div>

      <div className="container footer-grid">
        <div className="footer-brand">
          <Image className="footer-logo" src="/nds-assets/nds-logo-primary.png" alt="NDS Environmental Solutions" width={600} height={373} sizes="150px" />
          <p>{settings.footerDescription}</p>
        </div>

        <div>
          <h3>Contact</h3>
          <ul className="footer-contact">
            <li><MapPin size={17} aria-hidden /> <span>{settings.address}{settings.mailingAddress ? <><br />Mailing: {settings.mailingAddress}</> : null}</span></li>
            <li><Phone size={17} aria-hidden /> <a href={tel}>{settings.phone}</a></li>
            <li><Mail size={17} aria-hidden /> <a href={`mailto:${settings.email}`}>{settings.email}</a></li>
            <li><Clock size={17} aria-hidden /> <span>{hours.map((line) => <span className="footer-hours-line" key={line}>{line}</span>)}</span></li>
          </ul>
        </div>

        <div>
          <h3>Services</h3>
          <ul className="footer-links">
            {settings.navigation.filter((item) => item.href !== "/whats-new").map((item) => (
              <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
            ))}
            <li><Link href="/dumpster-calculator">Dumpster Calculator</Link></li>
            <li><Link href="/special-events">Special Events</Link></li>
          </ul>
        </div>

        <div>
          <h3>Customers</h3>
          <ul className="footer-links">
            <li><Link href="/make-a-payment">Pay Your Bill</Link></li>
            <li><Link href="/whats-new">Service Alerts</Link></li>
            <li><Link href="/faqs">FAQs</Link></li>
            <li><Link href="/about">About NDS</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
          {settings.socialLinks?.length ? (
            <ul className="footer-social">
              {settings.socialLinks.map((link) => (
                <li key={link.label}><a href={link.href} rel="noreferrer" target="_blank">{link.label}</a></li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>{settings.copyrightText}</p>
          <ul>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms &amp; Content Sources</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
