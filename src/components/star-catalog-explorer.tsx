"use client";

import { useState, useMemo } from "react";
import type { ParagonStarView } from "@/components/paragon-star-map";
import { Search, Filter, Sparkles, CheckCircle2, CircleDashed, ArrowRight } from "lucide-react";

function rarityBadgeClass(rarity: string) {
  switch (rarity) {
    case "Mythic": return "bg-cyan-300/15 text-cyan-100 border-cyan-300/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]";
    case "Legendary": return "bg-purple-300/15 text-purple-100 border-purple-300/50";
    case "Epic": return "bg-fuchsia-300/15 text-fuchsia-100 border-fuchsia-300/50";
    case "Rare": return "bg-blue-300/15 text-blue-100 border-blue-300/50";
    case "Uncommon": return "bg-green-300/15 text-green-100 border-green-300/50";
    default: return "bg-slate-300/10 text-slate-200 border-slate-300/30";
  }
}

export function StarCatalogExplorer({
  stars,
  onSelectStar,
}: {
  stars: ParagonStarView[];
  onSelectStar?: (tokenId: number) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [selectedConstellation, setSelectedConstellation] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "minted">("all");

  const constellations = useMemo(() => {
    const set = new Set(stars.map((s) => s.constellation));
    return Array.from(set);
  }, [stars]);

  const rarities = ["all", "Mythic", "Legendary", "Epic", "Rare", "Common"];

  const filteredStars = useMemo(() => {
    return stars.filter((star) => {
      const matchesSearch =
        star.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        star.constellation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        star.tokenId.toString().includes(searchQuery);

      const matchesRarity = selectedRarity === "all" || star.rarity === selectedRarity;
      const matchesConstellation = selectedConstellation === "all" || star.constellation === selectedConstellation;
      
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && !star.minted) ||
        (statusFilter === "minted" && star.minted);

      return matchesSearch && matchesRarity && matchesConstellation && matchesStatus;
    });
  }, [stars, searchQuery, selectedRarity, selectedConstellation, statusFilter]);

  return (
    <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h3 className="text-xl font-bold text-white">Каталог цифровых активов (Genesis Collection)</h3>
          <p className="text-xs text-slate-400">Поиск и фильтрация всех {stars.length} уникальных активов по параметрам, созвездиям и статусу</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">
            Найдено: <strong className="text-white">{filteredStars.length}</strong> из {stars.length}
          </span>
        </div>
      </div>

      {/* Панель фильтров */}
      <div className="grid gap-3 md:grid-cols-4">
        {/* Поиск */}
        <div className="relative md:col-span-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Поиск по имени или ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:bg-white/10"
          />
        </div>

        {/* Редкость */}
        <div>
          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900 py-2 px-3 text-xs text-slate-200 outline-none transition focus:border-cyan-400"
          >
            <option value="all">⭐ Все редкости ({stars.length})</option>
            {rarities.filter(r => r !== "all").map((r) => (
              <option key={r} value={r}>
                {r} ({stars.filter(s => s.rarity === r).length})
              </option>
            ))}
          </select>
        </div>

        {/* Созвездие */}
        <div>
          <select
            value={selectedConstellation}
            onChange={(e) => setSelectedConstellation(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900 py-2 px-3 text-xs text-slate-200 outline-none transition focus:border-cyan-400"
          >
            <option value="all">🌌 Все созвездия ({constellations.length})</option>
            {constellations.map((c) => (
              <option key={c} value={c}>
                {c} ({stars.filter(s => s.constellation === c).length})
              </option>
            ))}
          </select>
        </div>

        {/* Статус */}
        <div className="flex rounded-xl border border-white/10 bg-white/5 p-1 text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`flex-1 rounded-lg py-1 text-center font-medium transition ${
              statusFilter === "all" ? "bg-white/15 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Все
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("available")}
            className={`flex-1 rounded-lg py-1 text-center font-medium transition ${
              statusFilter === "available" ? "bg-cyan-400/20 text-cyan-200 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Свободны
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("minted")}
            className={`flex-1 rounded-lg py-1 text-center font-medium transition ${
              statusFilter === "minted" ? "bg-emerald-400/20 text-emerald-200 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Minted
          </button>
        </div>
      </div>

      {/* Сетка активов */}
      {filteredStars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CircleDashed className="h-8 w-8 animate-spin text-slate-600" />
          <p className="mt-3 text-sm text-slate-400">Ни один актив не подходит под выбранные фильтры</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedRarity("all");
              setSelectedConstellation("all");
              setStatusFilter("all");
            }}
            className="mt-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-cyan-300 hover:bg-white/10"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredStars.map((star) => (
            <div
              key={star.id}
              onClick={() => {
                if (onSelectStar) {
                  onSelectStar(star.tokenId);
                }
                const el = document.getElementById("mint");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 p-4 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-cyan-950/30"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full shadow-inner"
                    style={{ backgroundColor: star.color, boxShadow: `0 0 12px ${star.color}` }}
                  >
                    <span className="text-[10px] font-black text-slate-950">#{star.tokenId}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white transition group-hover:text-cyan-200">{star.name}</h4>
                    <p className="text-[11px] text-slate-400">{star.constellation}</p>
                  </div>
                </div>
                {star.minted ? (
                  <span title="Актив выпущен (Minted)" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <span title="Свободен для минта" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-300">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3 text-[11px]">
                <span className={`rounded-full border px-2 py-0.5 font-semibold ${rarityBadgeClass(star.rarity)}`}>
                  {star.rarity}
                </span>
                <span className="font-mono text-slate-400">
                  Mag: {star.magnitude.toFixed(1)} / Cl: {star.spectralClass}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                <span>Коорд: ({star.x}, {star.y}, {star.z})</span>
                <span className="flex items-center gap-1 font-semibold text-cyan-300 opacity-0 transition group-hover:opacity-100">
                  На карту <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
