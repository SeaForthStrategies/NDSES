import { ArrowRight, CreditCard, MapPin, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { DumpsterCard } from "@/components/dumpster/DumpsterCard";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { ServiceAreaMap } from "@/components/sections/ServiceAreaMap";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { ServiceNoticeList } from "@/components/notices/ServiceNoticeList";
import { getDumpsterSizes, getHomePage, getServiceAreas, getServiceNotices } from "@/lib/cms";
import { faqs } from "@/lib/cms/mock-data";
import { activeNoticesForLocation } from "@/lib/notices";
import { localBusinessSchema } from "@/lib/schema";

export default async function HomePage() {
  const [page, notices, dumpsters, areas] = await Promise.all([getHomePage(), getServiceNotices(), getDumpsterSizes(), getServiceAreas()]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
      />
      <section className="hero">
        <div className="container hero-shell">
          <div className="hero-copy">
            <p className="eyebrow">{page.hero.eyebrow}</p>
            <h1>{page.hero.heading}</h1>
            <p className="lead">{page.hero.description}</p>
            <div className="button-row">
              {page.hero.actions.map((action, index) => (
                <Link className={`btn ${index === 0 ? "primary" : "secondary"}`} href={action.href} key={action.href}>
                  {action.label} <ArrowRight size={18} aria-hidden />
                </Link>
              ))}
            </div>
            <div className="hero-meta" aria-label="Service summary">
              <span>Residential</span>
              <span>Commercial</span>
              <span>Dumpster Rentals</span>
              <span>Special Events</span>
            </div>
          </div>
        </div>
      </section>
      <section className="action-dock" aria-label="Common actions">
        <div className="container action-dock-grid">
          <Link href="/residential">
            <MapPin size={21} aria-hidden />
            <span>
              <strong>Collection Schedule</strong>
              <small>Trash, recycling, and community details</small>
            </span>
          </Link>
          <Link href="/dumpster-rentals">
            <Truck size={21} aria-hidden />
            <span>
              <strong>Rent a Dumpster</strong>
              <small>Choose a size and request delivery</small>
            </span>
          </Link>
          <Link href="/make-a-payment">
            <CreditCard size={21} aria-hidden />
            <span>
              <strong>Pay Bill</strong>
              <small>Account payment access</small>
            </span>
          </Link>
          <Link href="/service-notices">
            <ShieldCheck size={21} aria-hidden />
            <span>
              <strong>Service Alerts</strong>
              <small>Weather, holiday, and route updates</small>
            </span>
          </Link>
        </div>
      </section>
      <section className="section notice-section">
        <div className="container">
          <div className="split">
            <div>
              <p className="eyebrow">Current Notices</p>
              <h2>Weather, route, and service updates</h2>
              <p className="lead">Check here for weather delays, holiday changes, closures, and route updates.</p>
            </div>
            <ServiceNoticeList notices={activeNoticesForLocation(notices, "home")} />
          </div>
        </div>
      </section>
      <SectionRenderer sections={page.sections} />
      <section className="section">
        <div className="container">
          <div className="section-intro">
            <p className="eyebrow">Dumpster Sizing</p>
            <h2>Popular roll-off sizes at a glance</h2>
            <p className="lead">Compare capacity, included rental details, and ideal uses before requesting a quote.</p>
          </div>
          <div className="grid four service-grid">
            {dumpsters.map((dumpster) => <DumpsterCard dumpster={dumpster} key={dumpster.slug} />)}
          </div>
          <div className="button-row section-actions">
            <Link className="btn primary" href="/dumpster-calculator">Use Dumpster Calculator</Link>
            <Link className="btn secondary" href="/dumpster-rentals">View Rental Details</Link>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <ServiceAreaMap areas={areas} />
        </div>
      </section>
      <section className="section">
        <div className="container grid two">
          <div>
            <p className="eyebrow">FAQs</p>
            <h2>Quick answers before you call</h2>
            <p>Review common dumpster, residential, and commercial questions, or contact NDS for help choosing service.</p>
            <Link className="btn secondary" href="/faqs">View All FAQs</Link>
          </div>
          <FAQAccordion faqs={faqs.slice(0, 4)} />
        </div>
      </section>
      <section className="section cta-band">
        <div className="container split">
          <div>
            <p className="eyebrow">Get Started</p>
            <h2>Need trash service, recycling, or a dumpster?</h2>
            <p>NDS can help confirm service availability, recommend the right dumpster size, and provide a customized quote.</p>
          </div>
          <div className="button-row">
            <Link className="btn primary" href="/contact">Get a Quote</Link>
            <Link className="btn secondary" href="tel:262-233-6131">Call 262-233-6131</Link>
          </div>
        </div>
      </section>
    </>
  );
}
