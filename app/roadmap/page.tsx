import { SanctuaryRoadmap } from "@/components/Roadmap/SanctuaryRoadmap";
import { JsonLd } from "@/components/SEO/JsonLd";
import { buildPageMetadata, getRoadmapSchemaGraph } from "@/lib/seo/schema";

export const metadata = buildPageMetadata({
  title: "The Sanctuary Roadmap | 4 Stages of Impact — NPIA",
  description:
    "Saving street animals today while building tomorrow's sanctuary: explore NPIA's 4-stage rollout across connected shelters, emergency vet triage & ABC, our flagship sanctuary, and the Canine Academy.",
  path: "/roadmap",
  image: "/Puppies_resting_at_animal_shelter_60e4af22.jpg",
  imageAlt: "Rescued puppies resting at an NPIA partner sanctuary",
  keywords: [
    "NPIA 4-Stage Roadmap",
    "flagship animal sanctuary build",
    "ABC sterilization and vet triage grid",
  ],
});

export default function RoadmapPage() {
  return (
    <>
      <JsonLd data={getRoadmapSchemaGraph()} />
      <SanctuaryRoadmap />
    </>
  );
}
