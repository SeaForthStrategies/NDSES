import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { DownloadList } from "@/components/sections/DownloadList";
import { FAQSection } from "@/components/sections/FAQSection";
import { ServiceNoticeList } from "@/components/notices/ServiceNoticeList";
import { getCommunities, getCommunityBySlug, getServiceNotices } from "@/lib/cms";
import { activeNoticesForLocation } from "@/lib/notices";

export async function generateStaticParams() {
  const communities = await getCommunities();
  return communities.map((community) => ({ communitySlug: community.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ communitySlug: string }> }): Promise<Metadata> {
  const { communitySlug } = await params;
  const community = await getCommunityBySlug(communitySlug);
  if (!community) return {};
  return {
    title: community.seo.title,
    description: community.seo.description
  };
}

export default async function CommunityPage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const [community, notices] = await Promise.all([getCommunityBySlug(communitySlug), getServiceNotices()]);
  if (!community) notFound();

  const communityNotices = activeNoticesForLocation(notices, "community", community.slug);

  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <p className="eyebrow">{community.municipalityType}</p>
          <h1>{community.name} Collection Information</h1>
          <p className="lead">{community.heroDescription}</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid two">
          <div className="card tint">
            <h2>Normal Collection</h2>
            <p><strong>Service day:</strong> {community.serviceDay}</p>
            <p><strong>Trash:</strong> {community.trashSchedule}</p>
            <p><strong>Recycling:</strong> {community.recyclingSchedule}</p>
          </div>
          <div>
            <h2>Current Notices</h2>
            <ServiceNoticeList notices={communityNotices} emptyMessage="No active notices for this community." />
          </div>
        </div>
      </section>
      {community.slug === "town-of-walworth" ? (
        <section className="section">
          <div className="container">
            <Image
              className="zone-map-image"
              src="/nds-assets/walworth-recycling-zone-map.png"
              alt="Town of Walworth recycling service map showing North and South collection zones"
              width={482}
              height={512}
            />
          </div>
        </section>
      ) : null}
      <section className="section alt">
        <div className="container grid two">
          <div>
            <h2>Service Guidelines</h2>
            <ul>
              {community.guidelines.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h2>Bulk Items</h2>
            <p>{community.bulkPolicy}</p>
            <DownloadList documents={community.documents} />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container grid three">
          <div className="card tint">
            <h2>Accepted Recycling</h2>
            <ul>{community.acceptedRecycling.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="card">
            <h2>Not Accepted</h2>
            <ul>{community.recyclingNotAccepted.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="card">
            <h2>Absolutely No Recycling</h2>
            <ul>{community.recyclingNeverAccepted.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </section>
      <FAQSection faqs={community.faqs} title={`${community.name} FAQs`} />
    </>
  );
}
