import type { Metadata } from "next";
import { DumpsterCalculator } from "@/components/dumpster/DumpsterCalculator";
import { DumpsterCard } from "@/components/dumpster/DumpsterCard";
import { getDumpsterSizes } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Dumpster Calculator",
  description: "Choose the right NDS roll-off dumpster size for cleanouts, remodels, roofing, construction debris, and heavy materials."
};

export default async function DumpsterCalculatorPage() {
  const dumpsters = await getDumpsterSizes();
  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <p className="eyebrow">Dumpster Calculator</p>
          <h1>Choose the right roll-off dumpster</h1>
          <p className="lead">Use project type and material information to compare available 10/12, 15, 20, and 30 yard dumpster rentals.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <DumpsterCalculator dumpsters={dumpsters} />
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <div className="section-intro">
            <p className="eyebrow">All Sizes</p>
            <h2>Compare other dumpster sizes</h2>
          </div>
          <div className="grid four service-grid">
            {dumpsters.map((dumpster) => <DumpsterCard dumpster={dumpster} key={dumpster.slug} />)}
          </div>
        </div>
      </section>
    </>
  );
}
