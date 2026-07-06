"use client";

import { useState, useMemo } from "react";
import { RARITY_TREE, calculateStarStats, calculateMiningYield, type StarRarity } from "@/gamefi/mechanics";
import { Calculator, Zap, Shield, Swords, TrendingUp, Sparkles, Pickaxe, Coins, Compass } from "lucide-react";

const rarities: { id: StarRarity; label: string; color: string }[] = [
  { id: "common", label: "Common", color: "#94a3b8" },
  { id: "uncommon", label: "Uncommon", color: "#4ade80" },
  { id: "rare", label: "Rare", color: "#60a5fa" },
  { id: "epic", label: "Epic", color: "#c084fc" },
  { id: "legendary", label: "Legendary", color: "#fbbf24" },
  { id: "mythic", label: "Mythic", color: "#22d3ee" },
];

export function StarYieldSimulator() {
  const [selectedRarity, setSelectedRarity] = useState<StarRarity>("rare");
  const [level, setLevel] = useState<number>(15);
  const [hours, setHours] = useState<number>(24);
  const [constellationBonus, setConstellationBonus] = useState<number>(25); // 0%, 15%, 25%, 40%

  const stats = useMemo(() => {
    const config = RARITY_TREE[selectedRarity];
    const baseStats = calculateStarStats(100, 80, 500, level, config.statMultiplier);
    
    // Применяем бонус созвездия к добыче
    const bonusMult = 1 + constellationBonus / 100;
    const effectivePower = Math.round(baseStats.miningPower * bonusMult);
    const effectiveSpeed = Math.round(baseStats.miningSpeed * bonusMult);
    
    const yield24h = calculateMiningYield(effectivePower, effectiveSpeed, hours);
    
    return {
      config,
      baseStats,
      effectivePower,
      effectiveSpeed,
      yield24h,
      estimatedApyTokens: Math.round((yield24h.star_dust ?? 0) * 3.65 * config.statMultiplier),
    };
  }, [selectedRarity, level, hours, constellationBonus]);

  return (
    <div className="space-y-6 rounded-3xl border border-cyan-200/20 bg-slate-950/80 p-6 shadow-2xl shadow-cyan-950/20">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-200">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Интерактивный симулятор дохода и статов</h3>
            <p className="text-xs text-slate-400">Проверьте, как редкость, уровень и созвездия влияют на характеристики и добычу ресурсов</p>
          </div>
        </div>
        <span className="rounded-full border border-cyan-200/30 bg-cyan-200/10 px-3 py-1 text-xs font-semibold text-cyan-200">
          Live GameFi Engine
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Панель настроек */}
        <div className="space-y-6 lg:col-span-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300">
              1. Выберите редкость актива: <span className="font-mono text-cyan-200" style={{ color: stats.config.color }}>{stats.config.name} (×{stats.config.statMultiplier.toFixed(1)})</span>
            </label>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {rarities.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRarity(r.id)}
                  className={`rounded-xl border px-2.5 py-2 text-center text-xs font-bold transition ${
                    selectedRarity === r.id
                      ? "border-white bg-white/15 text-white shadow-lg"
                      : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200"
                  }`}
                  style={selectedRarity === r.id ? { borderColor: r.color, color: r.color } : {}}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold text-slate-300">
              <span>2. Уровень прокачки (Level):</span>
              <span className="font-mono text-cyan-200">Lvl {level}</span>
            </div>
            <input
              type="range"
              min="1"
              max={stats.config.maxLevel}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-cyan-400 outline-none"
            />
            <div className="mt-1 flex justify-between text-[11px] text-slate-500">
              <span>Lvl 1 (Старт)</span>
              <span>Макс. для {stats.config.name}: Lvl {stats.config.maxLevel}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold text-slate-300">
              <span>3. Время активности / Экспедиции:</span>
              <span className="font-mono text-cyan-200">{hours} часов</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[6, 12, 24, 48, 168].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHours(h)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                    hours === h
                      ? "border-cyan-200 bg-cyan-200/20 text-cyan-100"
                      : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {h === 168 ? "1 неделя (168ч)" : `${h} часа`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300">
              4. Бонус от созвездия (Альянс):
            </label>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { val: 0, label: "Без альянса (0%)" },
                { val: 15, label: "Орион (+15%)" },
                { val: 25, label: "Шахтер (+25%)" },
                { val: 40, label: "Глаз (+40%)" },
              ].map((b) => (
                <button
                  key={b.val}
                  type="button"
                  onClick={() => setConstellationBonus(b.val)}
                  className={`rounded-xl border p-2 text-xs font-medium transition ${
                    constellationBonus === b.val
                      ? "border-emerald-300 bg-emerald-300/15 text-emerald-100"
                      : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Экран результатов */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-6 lg:col-span-6">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Расчет боевых и майнинг характеристик
            </h4>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-white/5 p-3">
                <div className="flex items-center justify-center gap-1 text-xs text-slate-400">
                  <Swords className="h-3.5 w-3.5 text-red-400" />
                  <span>Атака</span>
                </div>
                <p className="mt-1 font-mono text-lg font-bold text-white">{stats.baseStats.attack}</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <div className="flex items-center justify-center gap-1 text-xs text-slate-400">
                  <Shield className="h-3.5 w-3.5 text-blue-400" />
                  <span>Защита</span>
                </div>
                <p className="mt-1 font-mono text-lg font-bold text-white">{stats.baseStats.defense}</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <div className="flex items-center justify-center gap-1 text-xs text-slate-400">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <span>HP</span>
                </div>
                <p className="mt-1 font-mono text-lg font-bold text-white">{stats.baseStats.hp}</p>
              </div>
            </div>

            <h4 className="mt-6 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Прогноз добычи ресурсов за {hours}ч
            </h4>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-200">
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                  <span>Star Dust</span>
                </div>
                <p className="mt-1 font-mono text-xl font-black text-white">
                  +{(stats.yield24h.star_dust ?? 0).toLocaleString()}
                </p>
                <span className="text-[10px] text-cyan-200/70">Базовый ресурс</span>
              </div>

              <div className="rounded-xl border border-purple-300/20 bg-purple-300/10 p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-200">
                  <Pickaxe className="h-4 w-4 text-purple-300" />
                  <span>Crystals</span>
                </div>
                <p className="mt-1 font-mono text-xl font-black text-white">
                  +{(stats.yield24h.energy_crystal ?? 0).toLocaleString()}
                </p>
                <span className="text-[10px] text-purple-200/70">Редкая энергия</span>
              </div>

              <div className="col-span-2 rounded-xl border border-amber-300/20 bg-amber-300/10 p-3.5 sm:col-span-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-200">
                  <Coins className="h-4 w-4 text-amber-300" />
                  <span>Data Shards</span>
                </div>
                <p className="mt-1 font-mono text-xl font-black text-white">
                  +{(stats.yield24h.data_shard ?? 0).toLocaleString()}
                </p>
                <span className="text-[10px] text-amber-200/70">Для открытий</span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                Расчетная годовая ценность (APY Score)
              </span>
              <TrendingUp className="h-4 w-4 text-emerald-300" />
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-mono text-2xl font-black text-white">
                ~{stats.estimatedApyTokens.toLocaleString()} pts
              </span>
              <span className="text-xs text-emerald-200/80">
                Мощность: {stats.effectivePower} / Скорость: {stats.effectiveSpeed}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
