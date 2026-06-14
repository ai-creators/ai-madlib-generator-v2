"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Maximize2, Minimize2, ExternalLink } from "lucide-react";

type VizType = "html" | "image";

interface Visualization {
  id: string;
  label: string;
  file: string;
  type: VizType;
  category: string;
}

const VISUALIZATIONS: Visualization[] = [
  // Interactive HTML
  { id: "dashboard_gauges", label: "Dashboard Gauges", file: "dashboard_gauges.html", type: "html", category: "Interactive" },
  { id: "kmeans_clusters", label: "K-Means Clusters", file: "kmeans_clusters.html", type: "html", category: "Interactive" },
  { id: "lda_top_terms", label: "LDA Top Terms", file: "lda_top_terms.html", type: "html", category: "Interactive" },
  { id: "length_distributions", label: "Length Distributions", file: "length_distributions.html", type: "html", category: "Interactive" },
  { id: "pairs_plot", label: "Pairs Plot", file: "pairs_plot.html", type: "html", category: "Interactive" },
  { id: "pca_scatter", label: "PCA Scatter", file: "pca_scatter.html", type: "html", category: "Interactive" },
  { id: "prompt_wordcloud", label: "Prompt Word Cloud", file: "prompt_wordcloud.html", type: "html", category: "Interactive" },
  { id: "result_wordcloud", label: "Result Word Cloud", file: "result_wordcloud.html", type: "html", category: "Interactive" },
  { id: "sentiment_comparison", label: "Sentiment Comparison", file: "sentiment_comparison.html", type: "html", category: "Interactive" },
  { id: "tfidf_heatmap", label: "TF-IDF Heatmap", file: "tfidf_heatmap.html", type: "html", category: "Interactive" },
  { id: "top_prompt_words", label: "Top Prompt Words", file: "top_prompt_words.html", type: "html", category: "Interactive" },
  { id: "top_result_words", label: "Top Result Words", file: "top_result_words.html", type: "html", category: "Interactive" },
  { id: "word_stats_table", label: "Word Stats Table", file: "word_stats_table.html", type: "html", category: "Interactive" },
  // Static images
  { id: "bigrams", label: "Bigrams", file: "bigrams.png", type: "image", category: "Static" },
  { id: "boxplots", label: "Boxplots", file: "boxplots.png", type: "image", category: "Static" },
  { id: "correlation_matrix", label: "Correlation Matrix", file: "correlation_matrix.png", type: "image", category: "Static" },
  { id: "nrc_emotions", label: "NRC Emotions", file: "nrc_emotions.png", type: "image", category: "Static" },
  { id: "tfidf_top_words", label: "TF-IDF Top Words", file: "tfidf_top_words.png", type: "image", category: "Static" },
  { id: "unique_words", label: "Unique Words", file: "unique_words.png", type: "image", category: "Static" },
];

const CATEGORIES = ["Interactive", "Static"] as const;

export default function VizViewer() {
  const [selected, setSelected] = useState<Visualization>(VISUALIZATIONS[0]!);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const vizContent = (
    <>
      {selected.type === "html" ? (
        <iframe
          key={selected.id}
          src={`/viz/${selected.file}`}
          title={selected.label}
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center overflow-auto p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={selected.id}
            src={`/viz/${selected.file}`}
            alt={selected.label}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}
    </>
  );

  const contentBar = (fullScreen: boolean) => (
    <div className="flex shrink-0 items-center gap-2 border-b px-4 py-2">
      <span className="truncate text-sm font-medium">{selected.label}</span>
      <span className="text-muted-foreground rounded-full border px-2 py-0.5 text-xs">
        {selected.type === "html" ? "Interactive" : "Static"}
      </span>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          asChild
          title="Open in new tab"
        >
          <a href={`/viz/${selected.file}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullScreen(!fullScreen)}
          title={fullScreen ? "Exit full screen" : "Full screen"}
        >
          {fullScreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Normal layout */}
      <div className="flex grow overflow-hidden">
        {/* Sidebar */}
        <aside className="bg-muted/30 hidden w-56 shrink-0 overflow-y-auto border-r md:block lg:w-64">
          <div className="p-4">
            <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
              Visualizations
            </p>
            {CATEGORIES.map((category) => (
              <div key={category} className="mb-4">
                <p className="text-muted-foreground mb-1 px-2 text-xs font-medium">
                  {category}
                </p>
                <ul className="space-y-0.5">
                  {VISUALIZATIONS.filter((v) => v.category === category).map(
                    (viz) => (
                      <li key={viz.id}>
                        <button
                          onClick={() => setSelected(viz)}
                          className={cn(
                            "w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                            selected.id === viz.id
                              ? "bg-primary text-primary-foreground font-medium"
                              : "hover:bg-accent hover:text-accent-foreground",
                          )}
                        >
                          {viz.label}
                        </button>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Content pane */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {contentBar(false)}
          <div className="flex-1 overflow-hidden">{vizContent}</div>
        </div>
      </div>

      {/* Full-screen overlay */}
      {isFullScreen && (
        <div className="bg-background fixed inset-0 z-50 flex flex-col">
          {contentBar(true)}
          <div className="flex-1 overflow-hidden">{vizContent}</div>
        </div>
      )}
    </>
  );
}
