"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Maximize2,
  Minimize2,
  ExternalLink,
  Search,
  X,
  Menu,
  Download,
} from "lucide-react";

// ---- types & data ----

type VizType = "html" | "image";
type ViewMode = "gallery" | "viewer";

interface Visualization {
  id: string;
  label: string;
  file: string;
  type: VizType;
  category: string;
  description: string;
}

const VISUALIZATIONS: Visualization[] = [
  { id: "dashboard_gauges", label: "Dashboard Gauges", file: "dashboard_gauges.html", type: "html", category: "Interactive", description: "High-level summary gauges showing aggregate statistics like total adlibs, average length, and overall sentiment across the dataset." },
  { id: "kmeans_clusters", label: "K-Means Clusters", file: "kmeans_clusters.html", type: "html", category: "Interactive", description: "K-means clustering of adlib prompts and results to reveal natural groupings in the data." },
  { id: "lda_top_terms", label: "LDA Top Terms", file: "lda_top_terms.html", type: "html", category: "Interactive", description: "Top terms per topic discovered via Latent Dirichlet Allocation topic modeling." },
  { id: "length_distributions", label: "Length Distributions", file: "length_distributions.html", type: "html", category: "Interactive", description: "Distribution of word and character counts across prompts and generated results." },
  { id: "pairs_plot", label: "Pairs Plot", file: "pairs_plot.html", type: "html", category: "Interactive", description: "Pairwise scatter plots of numeric features to surface correlations across the dataset." },
  { id: "pca_scatter", label: "PCA Scatter", file: "pca_scatter.html", type: "html", category: "Interactive", description: "Principal component analysis projecting high-dimensional text features into 2D space." },
  { id: "prompt_wordcloud", label: "Prompt Word Cloud", file: "prompt_wordcloud.html", type: "html", category: "Interactive", description: "Word frequency cloud for all user-submitted prompt templates." },
  { id: "result_wordcloud", label: "Result Word Cloud", file: "result_wordcloud.html", type: "html", category: "Interactive", description: "Word frequency cloud for all AI-generated results across the dataset." },
  { id: "sentiment_comparison", label: "Sentiment Comparison", file: "sentiment_comparison.html", type: "html", category: "Interactive", description: "Side-by-side sentiment scores comparing prompts against their AI-generated responses." },
  { id: "tfidf_heatmap", label: "TF-IDF Heatmap", file: "tfidf_heatmap.html", type: "html", category: "Interactive", description: "Heatmap of TF-IDF scores showing which terms are most distinctive across categories." },
  { id: "top_prompt_words", label: "Top Prompt Words", file: "top_prompt_words.html", type: "html", category: "Interactive", description: "Bar chart of the most frequently used words in prompt templates." },
  { id: "top_result_words", label: "Top Result Words", file: "top_result_words.html", type: "html", category: "Interactive", description: "Bar chart of the most frequently used words in AI-generated results." },
  { id: "word_stats_table", label: "Word Stats Table", file: "word_stats_table.html", type: "html", category: "Interactive", description: "Tabular summary of word-level statistics including frequency, uniqueness, and TF-IDF scores." },
  { id: "bigrams", label: "Bigrams", file: "bigrams.png", type: "image", category: "Static", description: "Most common two-word phrases (bigrams) found across prompts and results." },
  { id: "boxplots", label: "Boxplots", file: "boxplots.png", type: "image", category: "Static", description: "Box and whisker plots showing the spread and outliers of key numeric metrics." },
  { id: "correlation_matrix", label: "Correlation Matrix", file: "correlation_matrix.png", type: "image", category: "Static", description: "Pearson correlation matrix between all numeric features in the dataset." },
  { id: "nrc_emotions", label: "NRC Emotions", file: "nrc_emotions.png", type: "image", category: "Static", description: "Emotion scores derived from the NRC Emotion Lexicon across prompts and results." },
  { id: "tfidf_top_words", label: "TF-IDF Top Words", file: "tfidf_top_words.png", type: "image", category: "Static", description: "Bar chart of top TF-IDF weighted terms across the entire corpus." },
  { id: "unique_words", label: "Unique Words", file: "unique_words.png", type: "image", category: "Static", description: "Count and proportion of unique vocabulary used across prompts versus results." },
];

const CATEGORIES = ["Interactive", "Static"] as const;
const MIN_SIDEBAR_W = 160;
const MAX_SIDEBAR_W = 400;

// ---- component ----

export default function VizViewer() {
  const [selected, setSelected] = useState<Visualization | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("gallery");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);

  // Keep a ref so drag handlers always read the latest width without stale closure
  const sidebarWidthRef = useRef(256);
  sidebarWidthRef.current = sidebarWidth;

  // Dynamic page title
  useEffect(() => {
    document.title = selected
      ? `${selected.label} — Visualizations — AI MadLibs`
      : "Visualizations — AI MadLibs";
  }, [selected]);

  // Reset loading spinner whenever the selection changes
  useEffect(() => {
    if (selected) setIsLoading(true);
  }, [selected]);

  // Filtered list (search across label + description)
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return VISUALIZATIONS;
    return VISUALIZATIONS.filter(
      (v) =>
        v.label.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  // Arrow-key navigation through filtered list
  useEffect(() => {
    if (viewMode !== "viewer") return;
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea")) return;
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
      e.preventDefault();
      const idx = filtered.findIndex((v) => v.id === selected?.id);
      if (idx === -1) return;
      const next =
        e.key === "ArrowDown"
          ? filtered[Math.min(idx + 1, filtered.length - 1)]
          : filtered[Math.max(idx - 1, 0)];
      if (next && next.id !== selected?.id) setSelected(next);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [viewMode, filtered, selected]);

  // Drag-to-resize sidebar
  const startResize = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidthRef.current;
    const onMove = (ev: PointerEvent) => {
      setSidebarWidth(
        Math.max(MIN_SIDEBAR_W, Math.min(MAX_SIDEBAR_W, startWidth + ev.clientX - startX)),
      );
    };
    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }, []);

  // ---- helpers ----

  const selectViz = (viz: Visualization) => {
    setSelected(viz);
    setViewMode("viewer");
    setMobileSheetOpen(false);
  };

  // ---- shared sidebar list (used in both desktop sidebar and mobile sheet) ----

  const sidebarList = (
    <div className="flex h-full flex-col">
      <div className="border-b p-3">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {filtered.length === 0 && (
          <p className="text-muted-foreground px-2 py-8 text-center text-sm">
            No results.
          </p>
        )}
        {CATEGORIES.map((cat) => {
          const items = filtered.filter((v) => v.category === cat);
          if (!items.length) return null;
          return (
            <div key={cat} className="mb-4">
              <p className="text-muted-foreground mb-1 px-2 text-xs font-medium">
                {cat}
              </p>
              <ul className="space-y-0.5">
                {items.map((viz) => (
                  <li key={viz.id}>
                    <button
                      onClick={() => selectViz(viz)}
                      className={cn(
                        "w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                        selected?.id === viz.id && viewMode === "viewer"
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      {viz.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ---- content bar (top strip in viewer) ----

  const contentBar = (fullScreen: boolean) =>
    selected ? (
      <div className="flex shrink-0 flex-col border-b">
        <div className="flex items-center gap-2 px-4 py-2">
          {!fullScreen && (
            <button
              onClick={() => setViewMode("gallery")}
              className="text-muted-foreground hover:text-foreground mr-1 text-xs"
            >
              ← Gallery
            </button>
          )}
          <span className="truncate text-sm font-medium">{selected.label}</span>
          <span className="text-muted-foreground rounded-full border px-2 py-0.5 text-xs">
            {selected.type === "html" ? "Interactive" : "Static"}
          </span>
          <div className="ml-auto flex items-center gap-1">
            <span className="text-muted-foreground hidden text-xs lg:inline">
              ↑↓ navigate
            </span>
            {selected.type === "image" && (
              <Button variant="ghost" size="icon" title="Download" asChild>
                <a href={`/viz/${selected.file}`} download>
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button variant="ghost" size="icon" title="Open in new tab" asChild>
              <a
                href={`/viz/${selected.file}`}
                target="_blank"
                rel="noopener noreferrer"
              >
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
        {/* Description strip */}
        <div className="border-t px-4 py-1.5">
          <p className="text-muted-foreground text-xs">{selected.description}</p>
        </div>
      </div>
    ) : null;

  // ---- viz content (iframe or image) ----

  const vizContent = selected ? (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="bg-background/80 absolute inset-0 z-10 flex items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      )}
      {selected.type === "html" ? (
        <iframe
          key={selected.id}
          src={`/viz/${selected.file}`}
          title={selected.label}
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => setIsLoading(false)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center overflow-auto p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={selected.id}
            src={`/viz/${selected.file}`}
            alt={selected.label}
            className="max-h-full max-w-full object-contain"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      )}
    </div>
  ) : null;

  // ---- gallery view ----

  if (viewMode === "gallery") {
    return (
      <div className="grow overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Visualizations
              </h1>
              <p className="text-muted-foreground text-sm">
                {VISUALIZATIONS.length} charts — click any to explore
              </p>
            </div>
            <div className="relative sm:ml-auto sm:w-64">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search visualizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {CATEGORIES.map((cat) => {
            const items = filtered.filter((v) => v.category === cat);
            if (!items.length) return null;
            return (
              <section key={cat} className="mb-10">
                <h2 className="text-muted-foreground mb-4 text-xs font-semibold tracking-widest uppercase">
                  {cat}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((viz) => (
                    <button
                      key={viz.id}
                      onClick={() => selectViz(viz)}
                      className="group bg-card hover:border-primary/50 overflow-hidden rounded-lg border text-left transition-all hover:shadow-md"
                    >
                      <div className="bg-muted/40 relative h-36 overflow-hidden">
                        {viz.type === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`/viz/${viz.file}`}
                            alt={viz.label}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="pointer-events-none absolute inset-0 overflow-hidden">
                            <iframe
                              src={`/viz/${viz.file}`}
                              title={viz.label}
                              sandbox="allow-scripts allow-same-origin"
                              className="border-0"
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "400%",
                                height: "400%",
                                transform: "scale(0.25)",
                                transformOrigin: "top left",
                              }}
                            />
                          </div>
                        )}
                        <span className="bg-background/80 absolute top-2 right-2 rounded-full border px-2 py-0.5 text-[10px] backdrop-blur-sm">
                          {viz.type === "html" ? "Interactive" : "Static"}
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium">{viz.label}</p>
                        <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                          {viz.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-muted-foreground text-sm">
                No visualizations match your search.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- viewer view ----

  return (
    <>
      <div className="flex grow overflow-hidden pb-14 md:pb-0">
        {/* Desktop sidebar */}
        <aside
          className="bg-muted/30 relative hidden shrink-0 border-r md:flex md:flex-col"
          style={{ width: sidebarWidth }}
        >
          {sidebarList}
          {/* Drag-to-resize handle */}
          <div
            onPointerDown={startResize}
            className="hover:bg-primary/30 active:bg-primary/50 absolute top-0 right-0 h-full w-1 cursor-col-resize transition-colors"
          />
        </aside>

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {contentBar(false)}
          <div className="flex-1 overflow-hidden">
            {vizContent ?? (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  Select a visualization from the sidebar.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="bg-background fixed bottom-0 left-0 right-0 z-40 flex items-center gap-3 border-t px-4 py-3 md:hidden">
        <span className="flex-1 truncate text-sm font-medium">
          {selected?.label ?? "Select a visualization"}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileSheetOpen(true)}
        >
          <Menu className="mr-1.5 h-4 w-4" />
          Browse
        </Button>
      </div>

      {/* Mobile bottom sheet */}
      {mobileSheetOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileSheetOpen(false)}
          />
          <div className="bg-background absolute right-0 bottom-0 left-0 flex max-h-[75vh] flex-col rounded-t-2xl shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <span className="text-sm font-semibold">Visualizations</span>
              <button
                onClick={() => setMobileSheetOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1">{sidebarList}</div>
          </div>
        </div>
      )}

      {/* Full-screen overlay */}
      {isFullScreen && selected && (
        <div className="bg-background fixed inset-0 z-50 flex flex-col">
          {contentBar(true)}
          <div className="flex-1 overflow-hidden">{vizContent}</div>
        </div>
      )}
    </>
  );
}
