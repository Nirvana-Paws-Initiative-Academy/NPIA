import type { Metadata } from "next";
import { LegalDocumentLayout } from "@/components/Legal/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "DPDP Act 2023 Compliance Notice | NPIA",
  description:
    "Nirvana Paws Initiative & Academy (NPIA) Digital Personal Data Protection Act, 2023 (DPDP Act) Notice, Data Principal rights, consent withdrawal, and grievance redressal.",
};

export default function DpdpPolicyPage() {
  return (
    <LegalDocumentLayout
      badge="Statutory Compliance · India"
      title="DPDP Act, 2023 Compliance"
      subtitle="NPIA respects the Digital Personal Data Protection Act, 2023 (DPDP Act) and guarantees clear consent, purpose limitation, and accessible rights for every Data Principal."
      effectiveDate="12 November 2026"
      sections={[
        {
          id: "data-fiduciary",
          heading: "1. Data Fiduciary Identity & Scope",
          paragraphs: [
            "Nirvana Paws Initiative & Academy (NPIA) acts as a Data Fiduciary under the Digital Personal Data Protection Act, 2023 whenever digital personal data is collected online through our contact, volunteer, partner onboarding, or supporter communication forms in India.",
          ],
        },
        {
          id: "notice-consent",
          heading: "2. Clear Notice & Informed Consent (Sections 5 & 6)",
          paragraphs: [
            "Before collecting any digital personal data or non-essential cookies, NPIA provides an itemized notice stating the exact purpose of processing. Consent given by you is free, specific, informed, unconditional, and unambiguous.",
          ],
          bullets: [
            "No pre-checked non-essential consent boxes are ever used in our Customize modal.",
            "Rejecting non-essential cookies or functional tracking never blocks your access to NPIA's animal welfare pages, charter, or contact information.",
            "Withdrawing consent is just as simple as giving it—click Manage Cookie Preferences at any time.",
          ],
        },
        {
          id: "legitimate-uses",
          heading: "3. Certain Legitimate Uses (Section 7)",
          paragraphs: [
            "When you voluntarily submit your contact details on our Contact Us page requesting a callback, rescue coordination, or partnership follow-up, NPIA processes that data strictly to respond to your self-initiated request without repurposing it for unrelated outreach.",
          ],
        },
        {
          id: "data-principal-rights",
          heading: "4. Rights of Data Principals (Sections 11 to 14)",
          paragraphs: [
            "Every individual whose personal data is processed by NPIA holds statutory rights under the DPDP Act, 2023:",
          ],
          bullets: [
            "Right to Access Information (Section 11): Request a clear summary of personal data processed by NPIA and how it is used.",
            "Right to Correction & Erasure (Section 12): Request correction of inaccurate details, updating of contact records, or complete erasure once the purpose is served (subject to mandatory statutory retention).",
            "Right to Withdraw Consent (Section 6(4)): Revoke cookie preferences immediately in-browser or instruct NPIA to stop voluntary outreach updates.",
            "Right of Grievance Redressal (Section 13): Raise any privacy or data concern with our Grievance Desk via our Contact page prior to escalating to the Data Protection Board of India.",
            "Right to Nominate (Section 14): Nominate an authorized individual to exercise rights on your behalf in the event of death or incapacity.",
          ],
        },
        {
          id: "children-security",
          heading: "5. Children's Data (Section 9) & Safeguards (Section 8)",
          paragraphs: [
            "NPIA does not knowingly collect digital personal data from individuals under 18 years of age without verifiable consent from a parent or lawful guardian, and conducts no behavioural monitoring or targeted advertising aimed at children.",
            "We maintain reasonable security safeguards to protect submitted contact and partner correspondence from unauthorized access, alteration, or accidental disclosure.",
          ],
        },
      ]}
    />
  );
}
