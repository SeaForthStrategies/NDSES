import {
  commercialPage,
  commercialContainers,
  aboutContent,
  communities,
  dumpsterPage,
  dumpsterSizes,
  globalSettings,
  homePage,
  paymentContent,
  residentialPage,
  scheduleItems,
  serviceNotices,
  serviceAreas,
  specialEventsPage
} from "./mock-data";
import {
  getWordPressCommunities,
  getWordPressDumpsterSizes,
  getWordPressGlobals,
  getWordPressPage,
  getWordPressServiceNotices
} from "./wordpress";

export async function getGlobalSettings() {
  return (await getWordPressGlobals()) ?? globalSettings;
}

export async function getHomePage() {
  return (await getWordPressPage("home")) ?? homePage;
}

export async function getResidentialPage() {
  return (await getWordPressPage("residential")) ?? residentialPage;
}

export async function getCommercialPage() {
  return (await getWordPressPage("commercial")) ?? commercialPage;
}

export async function getDumpsterPage() {
  return (await getWordPressPage("dumpster-rentals")) ?? dumpsterPage;
}

export async function getSpecialEventsPage() {
  return (await getWordPressPage("special-events")) ?? specialEventsPage;
}

export async function getAboutContent() {
  return aboutContent;
}

export async function getCommunities() {
  return (await getWordPressCommunities()) ?? communities;
}

export async function getCommunityBySlug(slug: string) {
  return (await getCommunities()).find((community) => community.slug === slug) ?? null;
}

export async function getDumpsterSizes() {
  return (await getWordPressDumpsterSizes()) ?? dumpsterSizes;
}

export async function getCommercialContainers() {
  return commercialContainers;
}

export async function getServiceAreas() {
  return serviceAreas;
}

export async function getScheduleItems() {
  return scheduleItems;
}

export async function getPaymentContent() {
  return paymentContent;
}

export async function getServiceNotices() {
  return (await getWordPressServiceNotices()) ?? serviceNotices;
}

export async function getServiceNoticeBySlug(slug: string) {
  return (await getServiceNotices()).find((notice) => notice.slug === slug) ?? null;
}
