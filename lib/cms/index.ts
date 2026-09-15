import {
  commercialPage,
  commercialContainers,
  aboutContent,
  aboutPage,
  calculatorPage,
  communities,
  contactPage,
  dumpsterPage,
  dumpsterSizes,
  faqs,
  faqsPage,
  globalSettings,
  homePage,
  paymentContent,
  paymentPage,
  residentialPage,
  scheduleItems,
  serviceNotices,
  serviceAreas,
  specialEventsPage,
  whatsNewPage
} from "./mock-data";
import {
  getWordPressCommunities,
  getWordPressDumpsterSizes,
  getWordPressFAQs,
  getWordPressGlobals,
  getWordPressPage,
  getWordPressScheduleItems,
  getWordPressServiceAreas,
  getWordPressServiceNotices
} from "./wordpress";

export async function getGlobalSettings() {
  return (await getWordPressGlobals(globalSettings)) ?? globalSettings;
}

export async function getHomePage() {
  return (await getWordPressPage("home", homePage)) ?? homePage;
}

export async function getResidentialPage() {
  return (await getWordPressPage("residential", residentialPage)) ?? residentialPage;
}

export async function getCommercialPage() {
  return (await getWordPressPage("commercial", commercialPage)) ?? commercialPage;
}

export async function getDumpsterPage() {
  return (await getWordPressPage("dumpster-rentals", dumpsterPage)) ?? dumpsterPage;
}

export async function getCalculatorPage() {
  return (await getWordPressPage("dumpster-calculator", calculatorPage)) ?? calculatorPage;
}

export async function getFaqsPage() {
  return (await getWordPressPage("faqs", faqsPage)) ?? faqsPage;
}

export async function getContactPage() {
  return (await getWordPressPage("contact", contactPage)) ?? contactPage;
}

export async function getPaymentPage() {
  return (await getWordPressPage("make-a-payment", paymentPage)) ?? paymentPage;
}

export async function getWhatsNewPage() {
  return (await getWordPressPage("whats-new", whatsNewPage)) ?? whatsNewPage;
}

export async function getSpecialEventsPage() {
  return (await getWordPressPage("special-events", specialEventsPage)) ?? specialEventsPage;
}

export async function getAboutPage() {
  return (await getWordPressPage("about", aboutPage)) ?? aboutPage;
}

export async function getAboutContent() {
  return aboutContent;
}

export async function getCommunities() {
  return (await getWordPressCommunities(communities)) ?? communities;
}

export async function getCommunityBySlug(slug: string) {
  return (await getCommunities()).find((community) => community.slug === slug) ?? null;
}

export async function getDumpsterSizes() {
  return (await getWordPressDumpsterSizes(dumpsterSizes)) ?? dumpsterSizes;
}

export async function getCommercialContainers() {
  return commercialContainers;
}

export async function getServiceAreas() {
  return (await getWordPressServiceAreas(serviceAreas)) ?? serviceAreas;
}

export async function getScheduleItems() {
  return (await getWordPressScheduleItems(scheduleItems)) ?? scheduleItems;
}

export async function getFAQs() {
  return (await getWordPressFAQs(faqs)) ?? faqs;
}

export async function getPaymentContent() {
  return paymentContent;
}

export async function getServiceNotices() {
  return (await getWordPressServiceNotices(serviceNotices)) ?? serviceNotices;
}

export async function getServiceNoticeBySlug(slug: string) {
  return (await getServiceNotices()).find((notice) => notice.slug === slug) ?? null;
}
