import { LegalDocumentLayout } from "@/components/Legal/LegalDocumentLayout";
import { JsonLd } from "@/components/SEO/JsonLd";
import { buildPageMetadata, getLegalSchemaGraph } from "@/lib/seo/schema";

const DESCRIPTION =
  "Terms and Conditions governing use of the Nirvana Paws Initiative & Academy (NPIA) digital platform, partner inquiries, and voluntary support pledges.";

export const metadata = buildPageMetadata({
  title: "Terms & Conditions | NPIA",
  description: DESCRIPTION,
  path: "/terms-and-conditions",
});

export default function TermsAndConditionsPage() {
  return (
    <>
      <JsonLd
        data={getLegalSchemaGraph({
          path: "/terms-and-conditions",
          title: "Terms & Conditions | NPIA",
          description: DESCRIPTION,
        })}
      />
      <LegalDocumentLayout
      badge="Legal Governance"
      title="Terms & Conditions"
      subtitle="Please review the rules governing access to the Nirvana Paws Initiative & Academy (NPIA) website, program information, partner outreach, and voluntary support inquiries."
      effectiveDate="12 November 2026"
      sections={[
        {
          id: "acceptance",
          heading: "1. Acceptance of Terms",
          paragraphs: [
            "By accessing or using the Nirvana Paws Initiative & Academy (NPIA) website, submitting a partner inquiry, selecting a donation pledge intent, or interacting with our digital tools, you agree to comply with these Terms & Conditions and all applicable laws of India.",
            "If you do not agree with any provision stated here, please discontinue use of this website.",
          ],
        },
        {
          id: "mission-scope",
          heading: "2. Mission Information & Roadmap Disclosures",
          paragraphs: [
            "NPIA presents its founding mission, four-stage sanctuary development roadmap, allied partner network categories, and animal welfare programs for public awareness and community collaboration.",
            "Timelines, sanctuary capacity targets, and allied partner goals represent active organizational planning objectives and may evolve responsibly as field conditions, regulatory approvals, or veterinary priorities require.",
          ],
        },
        {
          id: "contributions",
          heading: "3. Voluntary Donations & Support Pledges",
          paragraphs: [
            "When you choose a shelter, care, or rescue support amount on our Donations page, you are initiating a voluntary non-commercial pledge or inquiry with NPIA.",
            "All contributions, once confirmed through sanctioned settlement channels, are applied strictly toward NPIA's animal welfare objectives—including street dog rescue triage, partner shelter beds, sterilization/vaccination coordination, rehabilitation, and flagship sanctuary development.",
          ],
          bullets: [
            "Pledge amounts submitted through inquiry forms do not automatically debit any bank account or card on this static showcase.",
            "Receipts, utilization acknowledgements, and statutory exemptions (where applicable under Indian law) follow verified settlement and contributor identity verification.",
          ],
        },
        {
          id: "partner-network",
          heading: "4. Partner Network & Community Conduct",
          paragraphs: [
            "Organizations, veterinarians, rescue volunteers, and institutional collaborators submitting details to join NPIA's network represent that all submitted information is truthful, lawful, and provided with organizational authority.",
            "You agree not to use the NPIA website to transmit misleading distress reports, spam, automated scraping traffic, or unlawful content.",
          ],
        },
        {
          id: "intellectual-property",
          heading: "5. Intellectual Property & Language Translation",
          paragraphs: [
            "All NPIA wordmarks, charter publications, visual media, interactive code, and program copy belong to Nirvana Paws Initiative & Academy or are used with licensed permission.",
            "Our integrated multi-language switcher assists visitors in reading NPIA information in major Indian languages for accessibility. Where any translated passage differs subtly from the original text, the English charter and legal text governs.",
          ],
        },
        {
          id: "liability",
          heading: "6. Limitation of Liability & Governing Law",
          paragraphs: [
            "This platform is provided on an 'as-is' and 'as-available' basis. To the fullest extent permitted by Indian law, NPIA shall not be liable for indirect or incidental damages arising from temporary network interruptions or automated browser translations.",
            "These Terms are governed by the laws of India, and any dispute shall be subject to the competent courts in India.",
          ],
        },
      ]}
    />
    </>
  );
}
