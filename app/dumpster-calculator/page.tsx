import type { Metadata } from "next";
import { DumpsterCalculator } from "@/components/dumpster/DumpsterCalculator";
import { DumpsterCard } from "@/components/dumpster/DumpsterCard";
import { getCalculatorPage, getDumpsterSizes } from "@/lib/cms";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Dumpster Calculator",
  description: "Choose the right NDS roll-off dumpster size for cleanouts, remodels, roofing, construction debris, and heavy materials."
};

export default async function DumpsterCalculatorPage() {
  const [page, dumpsters] = await Promise.all([getCalculatorPage(), getDumpsterSizes()]);
  return (
    <>
      <PageHero {...page.hero} />
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
          <div className="grid five service-grid">
            {dumpsters.map((dumpster) => <DumpsterCard dumpster={dumpster} key={dumpster.slug} />)}
          </div>
        </div>
      </section>
    </>
  );
}
