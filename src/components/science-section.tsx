"use client";

import { useState } from "react";
import {
  SCIENCE_CATALOGS,
  SPACE_MISSIONS,
  PARTNERSHIP_TIERS,
  SCIENCE_ACHIEVEMENTS,
  type SpaceMission,
} from "@/lib/science-layer";
import { ChevronDown, ChevronUp, Globe, Rocket, Telescope, Building2, Award } from "lucide-react";

type Tab = "catalogs" | "missions" | "partnerships" | "achievements";

const tabs: { id: Tab; label: string; icon: React.FC<{ className?: string }>; description: string }[] = [
  { id: "catalogs", label: "Научные каталоги", icon: Globe, description: "Реальные данные из космических обсерваторий и телескопов" },
  { id: "missions", label: "Космические миссии", icon: Rocket, description: "Привязка NFT к реальным запускам SpaceX, NASA, Blue Origin и другим" },
  { id: "partnerships", label: "Партнерская программа", icon: Building2, description: "Как научные организации и университеты могут сотрудничать с ParagonSpace" },
  { id: "achievements", label: "Научные достижения", icon: Award, description: "Система ачивок за исследование космоса через NFT" },
];

export function ScienceSection() {
  const [activeTab, setActiveTab] = useState<Tab>("catalogs");
  const [expandedCatalog, setExpandedCatalog] = useState<string | null>(null);
  const [expandedMission, setExpandedMission] = useState<number | null>(null);
  const [expandedTier, setExpandedTier] = useState<string | null>(null);

  return (
    <section id="science" className="relative mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-8 backdrop-blur">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-green-200/70">Scientific Layer</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">ParagonSpace x Наука</h2>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            ParagonSpace — это не просто NFT-коллекция. Мы строим мост между цифровыми активами на основе звездных данных и реальной космической наукой: каталоги NASA/ESA, миссии SpaceX, телескоп James Webb и образовательные программы. При этом каждый актив — это цифровой предмет коллекционирования, не имеющий отношения к реальному владению небесными телами.
          </p>
        </div>

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
                    ? "border-green-200/60 bg-green-200/10 text-green-100"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* ─── НАУЧНЫЕ КАТАЛОГИ ─── */}
        {activeTab === "catalogs" && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-green-200/20 bg-green-200/10 p-6">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-white">
                <Globe className="h-6 w-6 text-green-200" />
                Реальные звезды из реальных каталогов
              </h3>
              <p className="mt-4 leading-7 text-slate-200">
                Каждая NFT-звезда в ParagonSpace может быть привязана к реальному небесному объекту
                из научных каталогов. Мы используем данные телескопов и космических миссий,
                чтобы сделать каждую звезду уникальной и научно обоснованной.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {SCIENCE_CATALOGS.map((catalog) => {
                const isExpanded = expandedCatalog === catalog.id;
                return (
                  <button
                    key={catalog.id}
                    type="button"
                    onClick={() => setExpandedCatalog(isExpanded ? null : catalog.id)}
                    className={`rounded-2xl border p-5 text-left transition ${
                      isExpanded
                        ? "border-green-200/30 bg-green-200/10"
                        : "border-white/10 bg-slate-950/45 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-white">{catalog.name}</h4>
                        <p className="mt-1 text-xs text-slate-400">{catalog.source}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                      )}
                    </div>
                    <p className="mt-3 text-sm text-slate-300">{catalog.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-green-200/30 bg-green-200/10 px-2.5 py-1 text-green-100">
                        {catalog.totalObjects.toLocaleString()} объектов
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                        {catalog.type}
                      </span>
                    </div>
                    {isExpanded && catalog.imageCredit && (
                      <p className="mt-3 text-xs text-slate-500">Credit: {catalog.imageCredit}</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── КОСМИЧЕСКИЕ МИССИИ ─── */}
        {activeTab === "missions" && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-green-200/20 bg-green-200/10 p-6">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-white">
                <Rocket className="h-6 w-6 text-green-200" />
                NFT, привязанные к реальным космическим миссиям
              </h3>
              <p className="mt-4 leading-7 text-slate-200">
                Представьте: ваш цифровой актив привязан к звезде, которую изучает или отслеживает реальная миссия SpaceX.
                Вы получаете телеметрию, координаты спутника, статус запуска и научные данные.
                Это превращает коллекционирование в увлекательное взаимодействие с космической программой.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {SPACE_MISSIONS.map((mission) => {
                const isExpanded = expandedMission === mission.id;
                return (
                  <button
                    key={mission.id}
                    type="button"
                    onClick={() => setExpandedMission(isExpanded ? null : mission.id)}
                    className={`rounded-2xl border p-5 text-left transition ${
                      isExpanded
                        ? "border-green-200/30 bg-green-200/10"
                        : "border-white/10 bg-slate-950/45 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white">{mission.name}</h4>
                          <span className="rounded-full border border-orange-200/30 bg-orange-200/10 px-2 py-0.5 text-[10px] text-orange-100">
                            {mission.organization}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">{mission.date}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                      )}
                    </div>
                    <p className="mt-3 text-sm text-slate-300">{mission.description}</p>
                    {isExpanded && (
                      <div className="mt-4 rounded-2xl border border-green-200/15 bg-green-200/10 p-4">
                        <p className="text-xs font-semibold text-green-100">Связь с NFT:</p>
                        <p className="mt-2 text-sm leading-6 text-green-50/90">{mission.nftConnection}</p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── ПАРТНЕРСКАЯ ПРОГРАММА ─── */}
        {activeTab === "partnerships" && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-green-200/20 bg-green-200/10 p-6">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-white">
                <Building2 className="h-6 w-6 text-green-200" />
                Сотрудничество с научными организациями
              </h3>
              <p className="mt-4 leading-7 text-slate-200">
                ParagonSpace предлагает партнерскую программу для университетов, лабораторий,
                космических агентств и аэрокосмических компаний. Мы делимся доходами от NFT,
                предоставляем научные данные и создаем образовательные программы.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {PARTNERSHIP_TIERS.map((tier) => {
                const isExpanded = expandedTier === tier.level;
                return (
                  <button
                    key={tier.level}
                    type="button"
                    onClick={() => setExpandedTier(isExpanded ? null : tier.level)}
                    className={`rounded-2xl border p-5 text-left transition ${
                      isExpanded
                        ? "border-green-200/30 bg-green-200/10"
                        : "border-white/10 bg-slate-950/45 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-white">{tier.level}</h4>
                        <p className="text-sm text-green-100">{tier.price}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                      )}
                    </div>
                    {isExpanded && (
                      <ul className="mt-4 space-y-2">
                        {tier.benefits.map((benefit) => (
                          <li key={benefit} className="flex gap-2 text-sm text-slate-300">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-200" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── НАУЧНЫЕ ДОСТИЖЕНИЯ ─── */}
        {activeTab === "achievements" && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-green-200/20 bg-green-200/10 p-6">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-white">
                <Award className="h-6 w-6 text-green-200" />
                Научные достижения и бейджи
              </h3>
              <p className="mt-4 leading-7 text-slate-200">
                Каждое действие в ParagonSpace, связанное с наукой, приносит достижения.
                Соберите звезду, снятую JWST? Получите бейдж. Застали ISS над своей звездой?
                Ачивка. Каждое достижение дает реальные бонусы и статус в комьюнити.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {SCIENCE_ACHIEVEMENTS.map((achievement) => (
                <div key={achievement.id} className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white">{achievement.name}</h4>
                      <p className="mt-1 text-sm text-slate-400">{achievement.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                        <span className="rounded-full border border-cyan-200/30 bg-cyan-200/10 px-2 py-0.5 text-cyan-100">
                          {achievement.condition}
                        </span>
                        <span className="rounded-full border border-amber-200/30 bg-amber-200/10 px-2 py-0.5 text-amber-100">
                          {achievement.reward}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
