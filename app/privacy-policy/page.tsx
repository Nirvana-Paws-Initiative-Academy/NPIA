import type { Metadata } from "next";
import { LegalDocumentLayout } from "@/components/Legal/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | NPIA",
  description:
    "How Nirvana Paws Initiative & Academy (NPIA) collects, processes, protects, and respects personal information and cookie preferences.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentLayout
      badge="Privacy & Transparency"
      title="Privacy Policy"
      subtitle="NPIA collects only minimal, purposeful information needed to respond to animal rescue partners, supporters, and community volunteers—never selling or renting your data."
      effectiveDate="12 November 2026"
      sections={[
        {
          id: "data-collected",
          heading: "1. Information You Voluntarily Provide",
          paragraphs: [
            "We adhere strictly to data minimization. We collect personal details only when you actively fill out an inquiry on our Contact Us, Partner Network, Newsletter, or Donations pages.",
          ],
          bullets: [
            "Contact and identification details you submit (such as name, email address, organization name, or message context).",
            "Selected inquiry type (general message, partnership proposal, or donor support intent) so our volunteers can route your request accurately.",
          ],
        },
        {
          id: "how-used",
          heading: "2. How We Process Your Information",
          paragraphs: [
            "Submitted form messages are transmitted securely to NPIA's official correspondence inbox solely to answer your inquiry, coordinate allied rescue collaborations, or share requested sanctuary updates.",
            "We do not sell, rent, trade, or use personal information for third-party advertising networks.",
          ],
        },
        {
          id: "cookies-storage",
          heading: "3. Cookies & Browser Storage Controls",
          paragraphs: [
            "We classify browser storage into four transparent categories so you remain in complete control. Non-essential categories stay inactive unless you explicitly choose Accept All or enable them under Customize.",
          ],
          bullets: [
            "Strictly Essential: Required for basic security, navigation state, and saving your cookie consent decision.",
            "Functional & Language Memory: Remembers your selected Indian language preference across page visits when permitted.",
            "Privacy-Safe Analytics: Measures aggregated page reach without cross-site individual tracking.",
            "Outreach Attribution: Preserves partner or donation context when moving between pages to submit an inquiry.",
          ],
        },
        {
          id: "retention-security",
          heading: "4. Security & Data Retention",
          paragraphs: [
            "Personal data is retained only for as long as necessary to fulfill your request, maintain statutory non-profit accounting records where applicable, or comply with legal obligations.",
            "Translated text caches stored locally in your browser contain public UI text strings—never private form submissions—and can be cleared anytime through browser settings or cookie controls.",
          ],
        },
        {
          id: "your-choices",
          heading: "5. Your Rights & Consent Withdrawal",
          paragraphs: [
            "You may accept, reject non-essential cookies, customize granular preferences at any moment using the Manage Cookie Preferences button above, or request deletion/correction of previously emailed inquiries under India's DPDP Act, 2023.",
          ],
        },
      ]}
    />
  );
}
