"use client";

import { useState } from "react";
import { ParagonStarMap, type ParagonStarView } from "@/components/paragon-star-map";
import { StarCatalogExplorer } from "@/components/star-catalog-explorer";

/**
 * StarExperience — обёртка, связывающая 3D-карту и каталог активов общим состоянием.
 * Клик по карточке звезды в каталоге:
 *   1. Выбирает эту звезду на 3D-карте (открывается панель метаданных)
 *   2. Плавно скроллит страницу к карте
 */
export function StarExperience({ stars }: { stars: ParagonStarView[] }) {
  // Выбранная звезда (общая для карты и каталога).
  // Счётчик version нужен, чтобы повторный клик по той же звезде тоже срабатывал.
  const [selection, setSelection] = useState<{ tokenId: number; version: number } | null>(null);

  function handleSelectStar(tokenId: number) {
    setSelection((prev) => ({ tokenId, version: (prev?.version ?? 0) + 1 }));
    // Плавный скролл к карте
    const el = document.getElementById("mint");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <>
      {/* ─── 3D MAP ─── */}
      <section id="mint" className="relative mx-auto w-full max-w-7xl scroll-mt-24 px-5 pb-14 sm:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/70">3D Sky Map</p>
            <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">Интерактивная 3D-карта активов</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            Вращайте карту (ЛКМ), перемещайтесь по ней (ПКМ), приближайте колесом мыши. Клик по звезде или карточке в каталоге ниже откроет её метаданные. Зеленое кольцо — актив уже выпущен.
          </p>
        </div>
        <ParagonStarMap stars={stars} controlledTokenId={selection?.tokenId ?? null} />
      </section>

      {/* ─── CATALOG EXPLORER ─── */}
      <section id="catalog" className="relative mx-auto w-full max-w-7xl scroll-mt-24 px-5 pb-14 sm:px-8">
        <StarCatalogExplorer stars={stars} onSelectStar={handleSelectStar} />
      </section>
    </>
  );
}
