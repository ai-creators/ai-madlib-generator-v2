import Layout from "@/layouts/layout";
import VizViewer from "./_components/viz-viewer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visualizations — AI MadLibs",
  description: "Data visualizations and analytics for AI MadLibs.",
};

export default function VizPage() {
  return (
    <Layout>
      <VizViewer />
    </Layout>
  );
}
