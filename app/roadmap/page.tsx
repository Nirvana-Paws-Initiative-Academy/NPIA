import type { Metadata } from "next";
import { SanctuaryRoadmap } from "@/components/Roadmap/SanctuaryRoadmap";

export const metadata: Metadata = {
  title: "The Sanctuary Roadmap | 4 Stages of Impact — NPIA",
  description:
    "Saving street animals today while building tomorrow's sanctuary: explore NPIA's 4-stage rollout across connected shelters, emergency vet triage, our flagship sanctuary, and the Canine Academy.",
};

export default function RoadmapPage() {
  return <SanctuaryRoadmap />;
}
