"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Flame,
  Image as ImageIcon,
  ShieldCheck,
  Type,
  Plus,
  Trash2,
  Save,
  Sparkles,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import type {
  SystemSettings,
  HeroSlideItem,
  HeroSideBannerItem,
  TrustBadgeSettingItem,
} from "@/services/admin.service";
import type { ProductCardData } from "@/lib/types/product.types";
import { updateSystemSettingsAction } from "@/actions/admin.actions";
import { toast } from "sonner";

interface Props {
  initialSettings: SystemSettings;
  availableProducts: ProductCardData[];
}

export default function HomepageManagerContent({
  initialSettings,
  availableProducts = [],
}: Props) {
  const [activeTab, setActiveTab] = useState<
    "featured" | "hero" | "trust" | "titles"
  >("featured");

  // 1. Featured Products
  const [featuredProductIds, setFeaturedProductIds] = useState<string[]>(
    initialSettings?.featuredProductIds || []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductIdToAdd, setSelectedProductIdToAdd] = useState("");

  // 2. Hero Slides
  const defaultSlides: HeroSlideItem[] = [
    {
      id: "slide-1",
      title: "iPhone 17 Pro Max, in stock now",
      subtitle: "Titanium build, A19 Pro chip — official warranty included",
      ctaLabel: "Shop iPhone 17",
      ctaHref: "/products",
      imageSrc: "/images/hero/fan1.jpg",
      imageAlt: "iPhone 17 Pro Max",
    },
    {
      id: "slide-2",
      title: "MacBook Air M5, up to ৳15,000 off",
      subtitle: "0% EMI up to 12 months on all card purchases",
      ctaLabel: "Shop MacBooks",
      ctaHref: "/products",
      imageSrc: "/images/hero/light.jpg",
      imageAlt: "MacBook Air M5",
    },
    {
      id: "slide-3",
      title: "Galaxy Watch Ultra, ৳5,000 off",
      subtitle: "Track every workout, call and text from your wrist",
      ctaLabel: "Shop smartwatches",
      ctaHref: "/products",
      imageSrc: "/images/hero/ac_hero.webp",
      imageAlt: "Galaxy Watch Ultra",
    },
  ];

  const [heroSlides, setHeroSlides] = useState<HeroSlideItem[]>(
    initialSettings?.heroSlides && initialSettings.heroSlides.length > 0
      ? initialSettings.heroSlides
      : defaultSlides
  );

  // 3. Hero Side Banner
  const defaultSideBanner: HeroSideBannerItem = {
    imageSrc: "/images/hero/ac_hero.webp",
    alt: "Air conditioner offer",
    link: "/products",
  };

  const [heroSideBanner, setHeroSideBanner] = useState<HeroSideBannerItem>(
    initialSettings?.heroSideBanner || defaultSideBanner
  );

  // 4. Trust Badges
  const defaultTrustBadges: TrustBadgeSettingItem[] = [
    {
      id: "badge-1",
      title: "Nationwide Delivery",
      desc: "Carefully packed & fast shipping",
      icon: "Truck",
    },
    {
      id: "badge-2",
      title: "100% Genuine Warranty",
      desc: "Active digital verification",
      icon: "ShieldCheck",
    },
    {
      id: "badge-3",
      title: "Easy Claim Process",
      desc: "Online repair & replace service",
      icon: "RotateCcw",
    },
    {
      id: "badge-4",
      title: "Dedicated Support",
      desc: "24/7 hotline & technical desk",
      icon: "Headphones",
    },
  ];

  const [trustBadges, setTrustBadges] = useState<TrustBadgeSettingItem[]>(
    initialSettings?.trustBadges && initialSettings.trustBadges.length > 0
      ? initialSettings.trustBadges
      : defaultTrustBadges
  );

  // 5. Section Titles
  const [featuredSectionTitle, setFeaturedSectionTitle] = useState(
    initialSettings?.featuredSectionTitle || "Featured Products"
  );
  const [featuredSectionSubtitle, setFeaturedSectionSubtitle] = useState(
    initialSettings?.featuredSectionSubtitle ||
      "Best-selling electronics with long-term digital warranties"
  );

  const [isSaving, setIsSaving] = useState(false);

  // Featured Product Actions
  const handleAddFeaturedProduct = (productIdToAdd?: string) => {
    const id = productIdToAdd || selectedProductIdToAdd;
    if (!id) {
      toast.error("Please select a product to add.");
      return;
    }
    if (featuredProductIds.length >= 8) {
      toast.error("Maximum 8 featured products allowed! Remove an item first.");
      return;
    }
    if (featuredProductIds.includes(id)) {
      toast.error("This product is already in the featured showcase!");
      return;
    }
    setFeaturedProductIds([...featuredProductIds, id]);
    setSelectedProductIdToAdd("");
    toast.success("Product added to homepage featured showcase.");
  };

  const handleRemoveFeaturedProduct = (productId: string) => {
    setFeaturedProductIds(featuredProductIds.filter((id) => id !== productId));
    toast.info("Product removed from featured showcase.");
  };

  // Hero Slide Actions
  const handleUpdateSlide = (
    index: number,
    field: keyof HeroSlideItem,
    value: string
  ) => {
    const updated = [...heroSlides];
    updated[index] = { ...updated[index], [field]: value };
    setHeroSlides(updated);
  };

  // Trust Badge Actions
  const handleUpdateBadge = (
    index: number,
    field: "title" | "desc",
    value: string
  ) => {
    const updated = [...trustBadges];
    updated[index] = { ...updated[index], [field]: value };
    setTrustBadges(updated);
  };

  // Save All Homepage Configurations
  const handleSaveHomepage = async () => {
    setIsSaving(true);
    try {
      const res = await updateSystemSettingsAction({
        featuredProductIds: featuredProductIds.slice(0, 8),
        heroSlides,
        heroSideBanner,
        trustBadges,
        featuredSectionTitle: featuredSectionTitle.trim(),
        featuredSectionSubtitle: featuredSectionSubtitle.trim(),
      });

      toast.success(res.message || "Homepage settings published successfully!");
    } catch (err: any) {
      console.error("Save homepage error:", err);
      toast.error(err.message || "Failed to publish homepage settings.");
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered available products for search
  const filteredAvailableProducts = availableProducts.filter((p) => {
    const notSelected = !featuredProductIds.includes(p.id);
    if (!searchQuery.trim()) return notSelected;
    const matchName = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = p.categoryName?.toLowerCase().includes(searchQuery.toLowerCase());
    return notSelected && (matchName || matchCat);
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="page-header-title">
            Homepage & Storefront Manager
          </h1>
          <p className="page-header-desc">
            Maintain all dynamic storefront sections — Hero Banners, Featured Showcase (Max 8), and Trust Badges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card text-xs font-bold text-foreground hover:bg-muted transition shadow-2xs"
          >
            <ExternalLink className="h-4 w-4 text-primary" /> View Live Storefront
          </Link>

          <Button
            type="button"
            onClick={handleSaveHomepage}
            disabled={isSaving}
            className="h-10 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-sm cursor-pointer"
          >
            <Save className={`h-4 w-4 mr-2 ${isSaving ? "animate-spin" : ""}`} />
            {isSaving ? "Publishing..." : "Publish Changes"}
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("featured")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center cursor-pointer ${
            activeTab === "featured"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Flame className="h-4 w-4 mr-2 text-red-500" /> Featured Showcase (Max 8)
          <span
            className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "featured"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {featuredProductIds.length}/8
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center cursor-pointer ${
            activeTab === "hero"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <ImageIcon className="h-4 w-4 mr-2" /> Hero Banners & Slider
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("trust")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center cursor-pointer ${
            activeTab === "trust"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <ShieldCheck className="h-4 w-4 mr-2" /> Trust Badges Strip
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("titles")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center cursor-pointer ${
            activeTab === "titles"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Type className="h-4 w-4 mr-2" /> Section Titles
        </button>
      </div>

      {/* Tab 1: Featured Showcase */}
      {activeTab === "featured" && (
        <Card className="rounded-2xl border border-border shadow-sm bg-card overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Flame className="h-5 w-5 text-red-500" /> Homepage Featured Carousel Slots (Max 8)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  These products are featured on the homepage slider. 5 cards visible on desktop, 4 on laptop, 3 on tablet, and 2 on mobile.
                </p>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                  featuredProductIds.length >= 8
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                    : "bg-primary/10 text-primary border-primary/20"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {featuredProductIds.length} / 8 Slots Occupied
              </span>
            </div>

            {/* Visual Slots Grid (Slots 1 to 8) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => {
                const id = featuredProductIds[index];
                const product = id ? availableProducts.find((p) => p.id === id) : null;

                if (product) {
                  return (
                    <div
                      key={id || index}
                      className="relative rounded-2xl border border-primary/30 bg-primary/5 p-4 flex flex-col justify-between group shadow-2xs transition hover:border-primary"
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-xs font-black text-primary-foreground shadow-2xs">
                          {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeaturedProduct(id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition cursor-pointer"
                          title="Remove from featured slot"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-14 w-14 rounded-xl bg-card border border-border/80 flex items-center justify-center overflow-hidden shrink-0">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={56}
                              height={56}
                              className="object-cover h-full w-full"
                            />
                          ) : (
                            <Flame className="h-6 w-6 text-red-500/40" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-foreground truncate" title={product.name}>
                            {product.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                            {product.categoryName || "Catalog"}
                          </p>
                          <p className="text-xs font-black text-primary mt-1">
                            ৳{product.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-primary/10 flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Live on Homepage
                        </span>
                        <span>Slot {index + 1}</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={`empty-${index}`}
                    className="rounded-2xl border border-dashed border-border bg-muted/20 p-4 flex flex-col items-center justify-center text-center min-h-[140px] transition hover:border-muted-foreground/40"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground mb-2">
                      {index + 1}
                    </span>
                    <p className="text-xs font-bold text-muted-foreground">Empty Slot {index + 1}</p>
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                      Assign product from catalog below
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Catalog Search & Add Product */}
            <div className="p-5 rounded-2xl border border-border bg-muted/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    Assign Products from Catalog ({availableProducts.length} Total Available)
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Search and pick products to fill remaining slots.
                  </p>
                </div>
                <div className="w-full sm:w-64">
                  <Input
                    placeholder="Search by name or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 text-xs rounded-xl border-border bg-background"
                  />
                </div>
              </div>

              {featuredProductIds.length >= 8 && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  All 8 slots are occupied. To add a new product, please remove one of the existing 8 slots above.
                </div>
              )}

              <div className="max-h-72 overflow-y-auto divide-y divide-border/40 rounded-xl border border-border bg-card">
                {filteredAvailableProducts.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted-foreground font-medium">
                    No unfeatured products match your search query.
                  </div>
                ) : (
                  filteredAvailableProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 flex items-center justify-between gap-3 hover:bg-muted/40 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border/50">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.name}
                              width={40}
                              height={40}
                              className="object-cover h-full w-full"
                            />
                          ) : (
                            <Flame className="h-4 w-4 text-muted-foreground/40" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {p.categoryName || "Catalog"} • ৳{p.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        disabled={featuredProductIds.length >= 8}
                        onClick={() => handleAddFeaturedProduct(p.id)}
                        className="rounded-xl h-8 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary/90 font-bold shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add to Slot
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Hero Banners & Slider */}
      {activeTab === "hero" && (
        <Card className="rounded-2xl border border-border shadow-sm bg-card overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" /> Main Hero Slider Banners
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Customize titles, subtitles, CTA buttons, and banner images for the 3 homepage hero slides.
              </p>
            </div>

            <div className="space-y-6">
              {heroSlides.map((slide, index) => (
                <div
                  key={slide.id || index}
                  className="p-5 rounded-2xl border border-border bg-muted/20 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-[10px] font-black text-primary-foreground">
                        {index + 1}
                      </span>
                      Slide {index + 1}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                        Slide Heading
                      </label>
                      <Input
                        value={slide.title}
                        onChange={(e) => handleUpdateSlide(index, "title", e.target.value)}
                        className="rounded-xl border-border bg-background text-sm"
                        placeholder="e.g. iPhone 17 Pro Max, in stock now"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                        Subtitle / Offer Details
                      </label>
                      <Input
                        value={slide.subtitle}
                        onChange={(e) => handleUpdateSlide(index, "subtitle", e.target.value)}
                        className="rounded-xl border-border bg-background text-sm"
                        placeholder="e.g. Titanium build, A19 Pro chip — official warranty"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                        Image URL / Path
                      </label>
                      <Input
                        value={slide.imageSrc}
                        onChange={(e) => handleUpdateSlide(index, "imageSrc", e.target.value)}
                        className="rounded-xl border-border bg-background text-sm font-mono text-xs"
                        placeholder="e.g. /images/hero/fan1.jpg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                        CTA Button Label & Link
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={slide.ctaLabel || ""}
                          onChange={(e) => handleUpdateSlide(index, "ctaLabel", e.target.value)}
                          className="rounded-xl border-border bg-background text-xs"
                          placeholder="Button text"
                        />
                        <Input
                          value={slide.ctaHref || ""}
                          onChange={(e) => handleUpdateSlide(index, "ctaHref", e.target.value)}
                          className="rounded-xl border-border bg-background text-xs font-mono"
                          placeholder="/products"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Side Banner Box */}
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-bold text-foreground mb-3">
                Hero Right Side Banner (Under Quick Warranty Check)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl border border-border bg-muted/20">
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                    Side Banner Image URL
                  </label>
                  <Input
                    value={heroSideBanner.imageSrc}
                    onChange={(e) =>
                      setHeroSideBanner({ ...heroSideBanner, imageSrc: e.target.value })
                    }
                    className="rounded-xl border-border bg-background text-sm font-mono text-xs"
                    placeholder="e.g. /images/hero/ac_hero.webp"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                    Banner Target Link
                  </label>
                  <Input
                    value={heroSideBanner.link || ""}
                    onChange={(e) =>
                      setHeroSideBanner({ ...heroSideBanner, link: e.target.value })
                    }
                    className="rounded-xl border-border bg-background text-sm font-mono text-xs"
                    placeholder="/products"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Trust Badges Strip */}
      {activeTab === "trust" && (
        <Card className="rounded-2xl border border-border shadow-sm bg-card overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" /> Trust Badges Strip (4 Badges)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Customize titles and descriptions displayed on the storefront trust badge bar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trustBadges.map((badge, index) => (
                <div
                  key={badge.id || index}
                  className="p-4 rounded-2xl border border-border bg-muted/20 space-y-3"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Badge #{index + 1}
                  </h4>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Title
                    </label>
                    <Input
                      value={badge.title}
                      onChange={(e) => handleUpdateBadge(index, "title", e.target.value)}
                      className="rounded-xl border-border bg-background text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Description
                    </label>
                    <Input
                      value={badge.desc}
                      onChange={(e) => handleUpdateBadge(index, "desc", e.target.value)}
                      className="rounded-xl border-border bg-background text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Section Titles */}
      {activeTab === "titles" && (
        <Card className="rounded-2xl border border-border shadow-sm bg-card overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Type className="h-5 w-5 text-primary" /> Storefront Section Titles & Subtitles
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Maintain the section headlines shown on your public homepage.
              </p>
            </div>

            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Featured Products Section Title
                </label>
                <Input
                  value={featuredSectionTitle}
                  onChange={(e) => setFeaturedSectionTitle(e.target.value)}
                  className="rounded-xl border-border bg-background text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Featured Products Section Subtitle
                </label>
                <Input
                  value={featuredSectionSubtitle}
                  onChange={(e) => setFeaturedSectionSubtitle(e.target.value)}
                  className="rounded-xl border-border bg-background text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

