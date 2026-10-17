import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Truck } from "lucide-react";
import type { DumpsterSize } from "@/types/cms";

export function DumpsterCard({ dumpster, featured = false }: { dumpster: DumpsterSize; featured?: boolean }) {
  return (
    <article className={`dumpster-card card${featured ? " featured" : ""}`}>
      <div className="dumpster-visual">
        {dumpster.image ? (
          <Image src={dumpster.image} alt={`${dumpster.name} with dimensions`} width={560} height={315} sizes="(max-width: 640px) 90vw, 260px" />
        ) : (
          <Truck size={42} aria-hidden />
        )}
      </div>
      <div className="dumpster-card-body">
        <h3>{dumpster.name}</h3>
        <p className="dumpster-capacity">{dumpster.capacity}</p>
        <p>{dumpster.recommendedUses}</p>
        <ul className="check-list compact">
          {dumpster.included.map((item) => (
            <li key={item}><CheckCircle2 size={16} aria-hidden /> {item}</li>
          ))}
        </ul>
        <Link className="btn btn-primary btn-sm" href={dumpster.cta.href}>{dumpster.cta.label}</Link>
      </div>
    </article>
  );
}
