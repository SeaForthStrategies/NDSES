import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Truck } from "lucide-react";
import type { DumpsterSize } from "@/types/cms";

export function DumpsterCard({ dumpster, featured = false }: { dumpster: DumpsterSize; featured?: boolean }) {
  return (
    <article className={`dumpster-card card ${featured ? "featured" : ""}`}>
      <div className="dumpster-visual">
        {dumpster.image ? (
          <Image src={dumpster.image} alt={`${dumpster.name} dimension graphic supplied by NDS`} width={560} height={150} sizes="(max-width: 860px) 90vw, 280px" />
        ) : (
          <Truck size={42} aria-hidden />
        )}
        <span>{dumpster.name.replace(" Dumpster", "")}</span>
      </div>
      <div className="dumpster-card-body">
        <span className="badge">{dumpster.containerType}</span>
        <h3>{dumpster.name}</h3>
        <p>{dumpster.recommendedUses}</p>
        <dl className="spec-list">
          <div>
            <dt>Capacity</dt>
            <dd>{dumpster.capacity}</dd>
          </div>
          <div>
            <dt>Rental</dt>
            <dd>{dumpster.rentalPeriod}</dd>
          </div>
        </dl>
        <ul className="check-list compact">
          {dumpster.included.map((item) => (
            <li key={item}><CheckCircle2 size={16} aria-hidden /> {item}</li>
          ))}
        </ul>
        <Link className="btn primary" href={dumpster.cta.href}>{dumpster.cta.label}</Link>
      </div>
    </article>
  );
}
