import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Search, Image, Filter, Grid3X3, LayoutList, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const BRIDGE_COLORS: Record<string, string> = {
  ACAD: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  MEMORIAL: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  TRE: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  CHART: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const CATEGORY_ICONS: Record<string, string> = {
  logo: "🏛️", book: "📖", framework: "🔬", stats: "📊",
  hero: "⭐", icard: "🃏", heritage: "🏰", exhibition: "🎭",
  screenshot: "📱", evidence: "🔒", governance: "⚖️",
};

export default function MediaGallery() {
  const [search, setSearch] = useState("");
  const [bridgeFilter, setBridgeFilter] = useState<string | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: items = [], isLoading } = trpc.media.list.useQuery(
    { bridge: bridgeFilter, category: categoryFilter, search: search || undefined },
    { placeholderData: (prev) => prev }
  );
  const { data: stats } = trpc.media.stats.useQuery();

  const bridges = useMemo(() => Object.keys(stats?.bridges ?? {}), [stats]);
  const categories = useMemo(() => Object.keys(stats?.categories ?? {}), [stats]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container py-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold font-mono tracking-tight">MEDIA CATALOGUE</h1>
              <p className="text-xs text-muted-foreground">
                {stats?.total ?? 0} assets across {bridges.length} bridges
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="h-8 w-8"
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search assets by title, description, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Filter className="w-3 h-3" />
            <span>BRIDGE</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Button
              variant={!bridgeFilter ? "default" : "outline"}
              size="sm"
              onClick={() => setBridgeFilter(undefined)}
              className="h-7 text-xs"
            >
              All ({stats?.total ?? 0})
            </Button>
            {bridges.map((b) => (
              <Button
                key={b}
                variant={bridgeFilter === b ? "default" : "outline"}
                size="sm"
                onClick={() => setBridgeFilter(bridgeFilter === b ? undefined : b)}
                className="h-7 text-xs"
              >
                {b} ({stats?.bridges?.[b] ?? 0})
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <Image className="w-3 h-3" />
            <span>CATEGORY</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Button
              variant={!categoryFilter ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(undefined)}
              className="h-7 text-xs"
            >
              All
            </Button>
            {categories.map((c) => (
              <Button
                key={c}
                variant={categoryFilter === c ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(categoryFilter === c ? undefined : c)}
                className="h-7 text-xs"
              >
                {CATEGORY_ICONS[c] || "📄"} {c} ({stats?.categories?.[c] ?? 0})
              </Button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Grid View */}
        {!isLoading && viewMode === "grid" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:border-cyan-500/50 transition-colors"
                  onClick={() => setSelectedImage(item.cdnUrl)}
                >
                  <div className="aspect-square bg-muted/30 relative overflow-hidden">
                    <img
                      src={item.cdnUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-1 right-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${BRIDGE_COLORS[item.bridge] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>
                        {item.bridge}
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{item.description}</p>
                    {item.blockRef && (
                      <span className="text-[10px] text-cyan-500 font-mono">{item.blockRef}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* List View */}
        {!isLoading && viewMode === "list" && (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-card border border-border rounded-lg p-3 hover:border-cyan-500/50 transition-colors cursor-pointer"
                onClick={() => setSelectedImage(item.cdnUrl)}
              >
                <div className="w-16 h-16 rounded-md overflow-hidden bg-muted/30 shrink-0">
                  <img
                    src={item.cdnUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 ${BRIDGE_COLORS[item.bridge] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>
                      {item.bridge}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-muted-foreground">{CATEGORY_ICONS[item.category] || "📄"} {item.category}</span>
                    {item.blockRef && <span className="text-[10px] text-cyan-500 font-mono">{item.blockRef}</span>}
                    {item.tags && <span className="text-[10px] text-muted-foreground truncate">{item.tags}</span>}
                  </div>
                </div>
                <a
                  href={item.cdnUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-cyan-400" />
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && items.length === 0 && (
          <div className="text-center py-12">
            <Image className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No assets found matching your filters</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl font-bold"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
