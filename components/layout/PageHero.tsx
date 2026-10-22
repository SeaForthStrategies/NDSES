import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import type { CTA } from "@/types/cms";

type PageHeroProps = {
  eyebrow?: string;
  heading: string;
  description?: string;
  actions?: CTA[];
  image?: { src: string; alt: string; width: number; height: number };
  children?: ReactNode;
};

/** Shared banner for every inner page: forest green, gold/green stripe, optional photo. */
export function PageHero({ eyebrow, heading, description, actions = [], image, children }: PageHeroProps) {
  return (
    <section className={`page-hero${image ? " has-image" : ""}`}>
      <div className="container page-hero-inner">
        <div className="page-hero-copy">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1>{heading}</h1>
          {description ? <p className="lead">{description}</p> : null}
          {actions.length ? (
            <div className="button-row">
              {actions.map((action, index) => {
                const className = `btn ${index === 0 ? "btn-gold" : "btn-on-dark"}`;
                const content = <>{action.label} {index === 0 ? <ArrowRight size={18} aria-hidden /> : null}</>;
                return action.href.startsWith("tel:") ? (
                  <a className={className} href={action.href} key={action.href}>{content}</a>
                ) : (
                  <Link className={className} href={action.href} key={action.href}>{content}</Link>
                );
              })}
            </div>
          ) : null}
          {children}
        </div>
        {image ? (
          <figure className="page-hero-media">
            <Image src={image.src} alt={image.alt} width={image.width} height={image.height} priority sizes="(max-width: 900px) 100vw, 520px" />
          </figure>
        ) : null}
      </div>
    </section>
  );
}
