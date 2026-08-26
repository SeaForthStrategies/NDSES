import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { ScheduleCalendar } from "@/components/sections/ScheduleCalendar";
import { getCommunities, getResidentialPage, getScheduleItems } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Residential Waste Collection",
  description: "Residential garbage and recycling information for NDSES communities."
};

export default async function ResidentialPage() {
  const [page, communities, schedule] = await Promise.all([getResidentialPage(), getCommunities(), getScheduleItems()]);
  const recycling = communities[0];

  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <p className="eyebrow">{page.hero.eyebrow}</p>
          <h1>{page.hero.heading}</h1>
          <p className="lead">{page.hero.description}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <p className="eyebrow">Community Schedules</p>
          <h2>Select your community</h2>
          <div className="grid three stack-top">
            {communities.map((community) => (
              <Link className="card" href={`/residential/${community.slug}`} key={community.slug}>
                <span className="badge">{community.municipalityType}</span>
                <h3 className="stack-top-sm">{community.name}</h3>
                <p>{community.summary}</p>
                <strong>View collection details</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container split">
          <div>
            <p className="eyebrow">Pickup Expectations</p>
            <h2>Simple rules for weekly residential service</h2>
            <ul className="check-list">
              <li><CheckCircle2 size={18} aria-hidden /> Place bagged trash roadside by 5:30am.</li>
              <li><CheckCircle2 size={18} aria-hidden /> Use your own cans, not exceeding 60 pounds.</li>
              <li><CheckCircle2 size={18} aria-hidden /> Extra material beyond the allowance may be subject to fees.</li>
            </ul>
          </div>
          <div>
            <ScheduleCalendar items={schedule} />
            <figure className="asset-frame stack-top">
              <Image src="/nds-assets/residential-02-8ad01488fb.png" alt="Town of Walworth residential service calendar and recycling route reference from the NDS redesign workbook" width={906} height={670} />
            </figure>
            <p className="asset-caption">Client-supplied calendar/map visual from the NDS Website Redesign workbook.</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container grid two">
          <div className="card tint">
            <p className="eyebrow">Accepted Recycling</p>
            <h2>What can go in recycling</h2>
            <ul className="check-list">
              {recycling.acceptedRecycling.map((item) => <li key={item}><CheckCircle2 size={18} aria-hidden /> {item}</li>)}
            </ul>
          </div>
          <div className="card">
            <p className="eyebrow">Do Not Recycle</p>
            <h2>Keep these items out</h2>
            <div className="grid two">
              <ul className="x-list">
                {recycling.recyclingNotAccepted.map((item) => <li key={item}><XCircle size={18} aria-hidden /> {item}</li>)}
              </ul>
              <ul className="x-list">
                {recycling.recyclingNeverAccepted.map((item) => <li key={item}><XCircle size={18} aria-hidden /> {item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container grid two">
          <div>
            <p className="eyebrow">Bulk Items</p>
            <h2>Current residential customers can schedule bulk pickups</h2>
            <p>{recycling.bulkPolicy}</p>
          </div>
          <div className="grid two">
            <div className="card">
              <h3>Accepted</h3>
              <ul>{recycling.bulkAccepted.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="card">
              <h3>Not Accepted</h3>
              <ul>{recycling.bulkNotAccepted.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>
      <SectionRenderer sections={page.sections} />
    </>
  );
}
