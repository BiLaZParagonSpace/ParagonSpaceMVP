"use client";

import { useState } from "react";
import {
  RESOURCES,
  RARITY_TREE,
  CONSTELLATIONS,
  EXPEDITIONS,
  PVP_SECTORS,
  type StarRarity,
} from "@/gamefi/mechanics";
import { ChevronDown, ChevronUp, Swords, Pickaxe, Compass, Stars, Trophy, ArrowUp, Calculator } from "lucide-react";
import { StarYieldSimulator } from "@/components/star-yield-simulator";

type Tab = "simulator" | "overview" | "resources" | "leveling" | "constellations" | "expeditions" | "pvp";

const tabs: { id: Tab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: "simulator", label: "🧮 Симулятор", icon: Calculator },
  { id: "overview", label: "Обзор", icon: Stars },
  { id: "resources", label: "Ресурсы", icon: Pickaxe },
  { id: "leveling", label: "Прокачка", icon: ArrowUp },
  { id: "constellations", label: "Созвездия", icon: Compass },
  { id: "expeditions", label: "Экспедиции", icon: Trophy },
  { id: "pvp", label: "PvP-сектора", icon: Swords },
];

function rarityBadgeClass(rarity: string) {
  switch (rarity) {
    case "mythic": return "bg-cyan-300/10 text-cyan-100 border-cyan-300/40";
    case "epic": return "bg-purple-300/10 text-purple-100 border-purple-300/40";
    case "rare": return "bg-blue-300/10 text-blue-100 border-blue-300/40";
    case "uncommon": return "bg-green-300/10 text-green-100 border-green-300/40";
    default: return "bg-slate-300/10 text-slate-200 border-slate-300/30";
  }
}

function riskBadgeClass(risk: string) {
  switch (risk) {
    case "low": return "bg-green-300/10 text-green-100 border-green-300/40";
    case "medium": return "bg-amber-300/10 text-amber-100 border-amber-300/40";
    case "high": return "bg-orange-300/10 text-orange-100 border-orange-300/40";
    case "extreme": return "bg-red-300/10 text-red-100 border-red-300/40";
    default: return "bg-slate-300/10 text-slate-200 border-slate-300/30";
  }
}

export function GamefiSection() {
  const [activeTab, setActiveTab] = useState<Tab>("simulator");
  const [expandedResource, setExpandedResource] = useState<string | null>(null);
  const [expandedExpedition, setExpandedExpedition] = useState<number | null>(null);

  const ActiveIcon = tabs.find((t) => t.id === activeTab)?.icon ?? Stars;

  return (
    <section id="gamefi" className="relative mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-8 backdrop-blur">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-fuchsia-200/70">GameFi Engine</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">Игровой слой и экономика</h2>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Цифровые активы становятся живыми игровыми единицами с прокачкой, ресурсами, экспедициями, альянсами созвездий и PvP-сражениями за территории.
          </p>
        </div>

        {/* ─── Вкладки ─── */}
        <nav className="mt-8 flex flex-wrap gap-2" role="tablist">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "border-cyan-200/60 bg-cyan-200/10 text-cyan-100"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* ─── СИМУЛЯТОР ─── */}
        {activeTab === "simulator" && (
          <div className="mt-8">
            <StarYieldSimulator />
          </div>
        )}

        {/* ─── ОБЗОР ─── */}
        {activeTab === "overview" && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-cyan-200/20 bg-cyan-200/10 p-6">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-white">
                <Stars className="h-6 w-6 text-cyan-200" />
                Что такое GameFi в ParagonSpace
              </h3>
              <p className="mt-4 leading-7 text-slate-200">
                Обычные NFT — это картинки, которые стоят в кошельке. В ParagonSpace GameFi каждая звезда становится
                игровым юнитом с характеристиками, уровнем, энергией и способностью добывать ресурсы, сражаться и объединяться в созвездия.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-fuchsia-200/10">
                    <Pickaxe className="h-6 w-6 text-fuchsia-200" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Добыча ресурсов</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Цифровые активы автоматически генерируют игровые ресурсы (Star Dust, Energy Crystals, Data Shards),
                      когда держатель актива активен. Чем выше уровень и редкость — тем быстрее добыча.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cyan-200/10">
                    <ArrowUp className="h-6 w-6 text-cyan-200" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Прокачка и повышение редкости</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Тратьте ресурсы, чтобы повышать уровень звезды. На определенных уровнях можно повысить
                      ее редкость (Common → Uncommon → Rare → Epic → Legendary → Mythic).
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-200/10">
                    <Compass className="h-6 w-6 text-green-200" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Созвездия (альянсы)</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Объединяйте свои звезды в созвездия для получения бонусов.
                      Чем выше редкость звезд в созвездии — тем сильнее бонус.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-200/10">
                    <Swords className="h-6 w-6 text-amber-200" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">PvP и территории</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Сражайтесь за ресурсные сектора карты. Победитель получает контроль над территорией
                      и долю добычи проигравшего.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ключевая формула */}
            <div className="rounded-2xl border border-amber-200/15 bg-amber-200/10 p-5">
              <h4 className="font-semibold text-amber-100">Как считаются характеристики звезды</h4>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-slate-950/70 p-4 font-mono text-xs leading-6 text-amber-50/85">
{`// Базовая формула силы звезды
Уровень: 1–99
Множитель уровня: 1 + (level - 1) * 0.12
Множитель редкости: Common=1.0, Uncommon=1.3, Rare=1.7, Epic=2.2, Legendary=3.0, Mythic=4.0

Атака = baseAttack * множитель_уровня * множитель_редкости
Защита = baseDefense * множитель_уровня * множитель_редкости
HP = baseHp * множитель_уровня * множитель_редкости

Добыча Star Dust/час = miningPower * miningSpeed * 0.1
Шанс найти Data Shard = 0.05 * miningPower * miningSpeed`}
              </pre>
            </div>
          </div>
        )}

        {/* ─── РЕСУРСЫ ─── */}
        {activeTab === "resources" && (
          <div className="mt-8 space-y-4">
            <p className="text-sm leading-6 text-slate-400">
              В ParagonSpace пять типов ресурсов. Они выпадают при добыче, экспедициях и PvP-победах.
              Ресурсы нужны для прокачки звезд, повышения редкости, создания артефактов и управления DAO.
            </p>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Object.values(RESOURCES).map((resource) => {
                const isExpanded = expandedResource === resource.type;
                return (
                  <button
                    key={resource.type}
                    type="button"
                    onClick={() => setExpandedResource(isExpanded ? null : resource.type)}
                    className={`rounded-2xl border p-5 text-left transition ${
                      isExpanded
                        ? "border-cyan-200/30 bg-cyan-200/10"
                        : "border-white/10 bg-slate-950/45 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{resource.icon}</span>
                        <div>
                          <h4 className="font-semibold text-white">{resource.name}</h4>
                          <span className={`mt-1 inline-block rounded-full border px-2.5 py-0.5 text-xs ${rarityBadgeClass(resource.rarity)}`}>
                            {resource.rarity}
                          </span>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                      )}
                    </div>
                    {isExpanded && (
                      <p className="mt-4 text-sm leading-6 text-slate-300">{resource.description}</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── ПРОКАЧКА ─── */}
        {activeTab === "leveling" && (
          <div className="mt-8 space-y-6">
            <p className="text-sm leading-6 text-slate-400">
              Каждая звезда может прокачиваться до 99 уровня. По достижении пороговых уровней
              можно повысить редкость звезды — это требует ресурсов и повышает все характеристики.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-950/70">
                    <th className="p-4 text-left font-semibold text-cyan-100">Редкость</th>
                    <th className="p-4 text-left font-semibold text-slate-300">Макс. уровень</th>
                    <th className="p-4 text-left font-semibold text-slate-300">Множитель статов</th>
                    <th className="p-4 text-left font-semibold text-slate-300">Цена апгрейда</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(RARITY_TREE).map(([key, config], index) => (
                    <tr key={key} className={index % 2 === 0 ? "bg-white/5" : "bg-white/[0.02]"}>
                      <td className="p-4">
                        <span className="font-semibold" style={{ color: config.color }}>
                          {config.name}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{config.maxLevel}</td>
                      <td className="p-4 text-slate-300">×{config.statMultiplier.toFixed(1)}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(config.upgradeCost)
                            .filter(([_, cost]) => cost > 0)
                            .map(([resourceType, cost]) => {
                              const resource = RESOURCES[resourceType as keyof typeof RESOURCES];
                              return (
                                <span key={resourceType} className="inline-flex items-center gap-1 rounded-full bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300">
                                  {resource?.icon} {cost.toLocaleString()}
                                </span>
                              );
                            })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── СОЗВЕЗДИЯ ─── */}
        {activeTab === "constellations" && (
          <div className="mt-8 space-y-4">
            <p className="text-sm leading-6 text-slate-400">
              Соберите несколько звезд в одно созвездие — все они получат бонус к характеристикам.
              Чем выше редкость звезд и чем больше их в созвездии — тем сильнее эффект.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {CONSTELLATIONS.map((constellation) => (
                <article key={constellation.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-semibold text-white">{constellation.name}</h4>
                    <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs ${rarityBadgeClass(constellation.requiredRarity)}`}>
                      {constellation.requiredRarity}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{constellation.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-cyan-200/30 bg-cyan-200/10 px-2.5 py-1 text-cyan-100">
                      {constellation.requiredStars} звезд
                    </span>
                    <span className="rounded-full border border-emerald-200/30 bg-emerald-200/10 px-2.5 py-1 text-emerald-100">
                      {constellation.bonusDescription}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ─── ЭКСПЕДИЦИИ ─── */}
        {activeTab === "expeditions" && (
          <div className="mt-8 space-y-4">
            <p className="text-sm leading-6 text-slate-400">
              Отправляйте звезду в экспедицию — она вернется с ресурсами. Чем дольше и опаснее экспедиция, тем ценнее награда.
              Экспедиции тратят энергию звезды (восстанавливается со временем).
            </p>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {EXPEDITIONS.map((expedition) => {
                const isExpanded = expandedExpedition === expedition.id;
                return (
                  <button
                    key={expedition.id}
                    type="button"
                    onClick={() => setExpandedExpedition(isExpanded ? null : expedition.id)}
                    className={`rounded-2xl border p-5 text-left transition ${
                      isExpanded
                        ? "border-cyan-200/30 bg-cyan-200/10"
                        : "border-white/10 bg-slate-950/45 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white">{expedition.name}</h4>
                          <span className={`rounded-full border px-2 py-0.5 text-xs ${riskBadgeClass(expedition.risk)}`}>
                            {expedition.risk}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-400">{expedition.description}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                      )}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                        ⏱ {expedition.durationHours}ч
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                        ⚡ min {expedition.requiredEnergy} энергии
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                        lvl {expedition.minLevel}+
                      </span>
                    </div>
                    {isExpanded && (
                      <div className="mt-4 rounded-2xl border border-amber-200/15 bg-amber-200/10 p-3">
                        <p className="text-xs font-semibold text-amber-100">Награды:</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {Object.entries(expedition.rewards).map(([resourceType, amount]) => {
                            const resource = RESOURCES[resourceType as keyof typeof RESOURCES];
                            return (
                              <span key={resourceType} className="inline-flex items-center gap-1 rounded-full bg-slate-950/60 px-2.5 py-1 text-xs text-slate-200">
                                {resource?.icon} ×{amount}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── PVP ─── */}
        {activeTab === "pvp" && (
          <div className="mt-8 space-y-4">
            <p className="text-sm leading-6 text-slate-400">
              Бросайте вызов другим держателям активов. Победитель забирает игровые ресурсы с сектора и получает Galactic Token.
              Бои имеют кулдаун — нельзя атаковать одного игрока слишком часто.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {PVP_SECTORS.map((sector) => (
                <article key={sector.id} className="rounded-2xl border border-red-200/10 bg-slate-950/50 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-semibold text-white">{sector.name}</h4>
                    <span className="shrink-0 rounded-full border border-amber-200/30 bg-amber-200/10 px-2.5 py-0.5 text-xs text-amber-100">
                      lvl {sector.minLevel}+
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{sector.description}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs">
                    <span className="rounded-full border border-fuchsia-200/30 bg-fuchsia-200/10 px-2.5 py-1 text-fuchsia-100">
                      🌌 ×{sector.rewardToken} Galactic Tokens
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                      кулдаун {sector.cooldownHours}ч
                    </span>
                  </div>
                </article>
              ))}
            </div>
            <div className="rounded-2xl border border-red-200/10 bg-red-200/10 p-5">
              <h4 className="flex items-center gap-3 font-semibold text-red-100">
                <Swords className="h-5 w-5" />
                Как работает PvP
              </h4>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-slate-950/70 p-4 font-mono text-xs leading-6 text-red-50/85">
{`// Формула боя
attackPower = атака_атакующего * (1 + скорость_атакующего / (скорость_атакующего + скорость_защитника))
defensePower = защита_защитника * (1 + скорость_защитника / (скорость_атакующего + скорость_защитника))

урон_защитнику = max(1, attackPower - defensePower * 0.3)
урон_атакующему = max(1, defensePower - attackPower * 0.3)

Побеждает тот, у кого осталось больше HP.
Победитель получает galactic_token и часть ресурсов проигравшего.`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
