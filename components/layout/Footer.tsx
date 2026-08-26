import Link from "next/link";
import type { GlobalSettings } from "@/types/cms";

export function Footer({ settings }: { settings: GlobalSettings }) {
  return (
    <footer className="footer">
      <div className="container grid three">
        <div>
          <h2>{settings.companyName}</h2>
          <p>{settings.footerDescription}</p>
        </div>
        <div>
          <h3>Contact</h3>
          <p>{settings.address}</p>
          {settings.mailingAddress ? <p>{settings.mailingAddress}</p> : null}
          <p><a href={`tel:${settings.phone}`}>{settings.phone}</a></p>
          <p><a href={`mailto:${settings.email}`}>{settings.email}</a></p>
          {settings.socialLinks?.map((link) => (
            <p key={link.label}><a href={link.href} rel="noreferrer" target="_blank">{link.label}</a></p>
          ))}
        </div>
        <div>
          <h3>Services</h3>
          {settings.navigation.map((item) => (
            <p key={item.href}><Link href={item.href}>{item.label}</Link></p>
          ))}
          <p><Link href="/privacy-policy">Privacy Policy</Link></p>
          <p><Link href="/terms">Terms & Content Sources</Link></p>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>{settings.copyrightText}</p>
      </div>
    </footer>
  );
}
