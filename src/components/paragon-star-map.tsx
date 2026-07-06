"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Sparkles, Filter, HelpCircle, Play, Pause, Compass } from "lucide-react";

export type ParagonStarView = {
  id: number;
  tokenId: number;
  name: string;
  constellation: string;
  rarity: string;
  spectralClass: string;
  magnitude: number;
  x: number;
  y: number;
  z: number;
  color: string;
  minted: boolean;
  wallet: string | null;
  txHash: string | null;
};

type MintResponse =
  | { ok: true; star: ParagonStarView }
  | { ok: false; message: string };

function shortWallet(wallet: string | null) {
  if (!wallet) {
    return "Свободна";
  }
  return `${wallet.slice(0, 6)}…${wallet.slice(-4)}`;
}

function rarityClass(rarity: string) {
  switch (rarity) {
    case "Mythic":
      return "border-cyan-300/70 bg-cyan-300/10 text-cyan-100";
    case "Legendary":
      return "border-violet-300/70 bg-violet-300/10 text-violet-100";
    case "Epic":
      return "border-fuchsia-300/70 bg-fuchsia-300/10 text-fuchsia-100";
    case "Rare":
      return "border-amber-300/70 bg-amber-300/10 text-amber-100";
    default:
      return "border-slate-300/30 bg-white/5 text-slate-200";
  }
}

export function ParagonStarMap({
  stars,
  controlledTokenId,
}: {
  stars: ParagonStarView[];
  /** Внешний выбор звезды (например, клик по карточке в каталоге) */
  controlledTokenId?: number | null;
}) {
  const [localStars, setLocalStars] = useState(stars);
  const [selectedTokenId, setSelectedTokenId] = useState(stars[0]?.tokenId ?? 1);
  const [rotation, setRotation] = useState({ x: -18, y: 32 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [wallet, setWallet] = useState("");
  const [mintStatus, setMintStatus] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  
  // Зум (приближение и отдаление камеры) - увеличен базовый масштаб в 4 раза
  const [zoom, setZoom] = useState<number>(2.5);

  // Панорамирование (перемещение камеры по карте)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Режим перетаскивания: "rotate" (вращение) или "pan" (перемещение)
  const [dragMode, setDragMode] = useState<"rotate" | "pan">("rotate");

  // Фильтрация карты по редкости
  const [mapRarityFilter, setMapRarityFilter] = useState<string>("all");

  // Автовращение 3D сферы
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);

  // Контейнер 3D карты для нативного слушателя колесика мыши (без скролла страницы!)
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Синхронизация с внешним выбором: клик в каталоге выбирает звезду на карте
  useEffect(() => {
    if (controlledTokenId != null) {
      setSelectedTokenId(controlledTokenId);
      setIsAutoRotating(false);
    }
  }, [controlledTokenId]);

  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;

    // Нативный слушатель с { passive: false }, чтобы гарантированно блокировать прокрутку страницы!
    function onNativeWheel(event: globalThis.WheelEvent) {
      event.preventDefault();
      event.stopPropagation();
      const zoomDelta = event.deltaY < 0 ? 0.3 : -0.3;
      // Минимальный зум сильно уменьшен (0.15), чтобы все звёзды помещались в окно
      setZoom((current) => Math.max(0.15, Math.min(8.0, current + zoomDelta)));
    }

    el.addEventListener("wheel", onNativeWheel, { passive: false });
    return () => el.removeEventListener("wheel", onNativeWheel);
  }, []);

  // Таймер автовращения
  useEffect(() => {
    if (!isAutoRotating || dragStart) return;
    const timer = setInterval(() => {
      setRotation((current) => ({
        x: current.x,
        y: (current.y + 0.3) % 360,
      }));
    }, 50);
    return () => clearInterval(timer);
  }, [isAutoRotating, dragStart]);

  const selectedStar = useMemo(
    () => localStars.find((star) => star.tokenId === selectedTokenId) ?? localStars[0],
    [localStars, selectedTokenId],
  );

  const mintedCount = localStars.filter((star) => star.minted).length;
  const progress = localStars.length === 0 ? 0 : Math.round((mintedCount / localStars.length) * 100);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    setIsAutoRotating(false);
    // event.buttons: 1 = левая, 2 = правая, 3 = обе зажаты
    // Если зажаты обе кнопки (или правая) → режим перемещения (pan)
    if (event.buttons >= 2) {
      setDragMode("pan");
    } else {
      setDragMode("rotate");
    }
    setDragStart({ x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragStart) return;

    // Если в процессе движения зажали вторую кнопку — переключаемся в pan
    const currentMode: "rotate" | "pan" = event.buttons >= 2 ? "pan" : dragMode;

    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;

    if (currentMode === "pan") {
      // Перемещение карты (pan) — двигаем всю сцену
      setPan((current) => ({
        x: current.x + deltaX,
        y: current.y + deltaY,
      }));
    } else {
      // Вращение сцены
      setRotation((current) => ({
        x: Math.max(-70, Math.min(70, current.x - deltaY * 0.25)),
        y: current.y + deltaX * 0.3,
      }));
    }
    setDragStart({ x: event.clientX, y: event.clientY });
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    setDragStart(null);
    setDragMode("rotate");
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  // Запрещаем контекстное меню браузера при правом клике (чтобы правый клик работал для pan)
  function handleContextMenu(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  async function handleMint() {
    setIsMinting(true);
    setMintStatus("Подписываем mint-транзакцию ParagonSpace...");

    try {
      const response = await fetch("/api/stars/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      });
      const payload = (await response.json()) as MintResponse;

      if (!payload.ok) {
        setMintStatus(payload.message);
        return;
      }

      setLocalStars((current) =>
        current.map((star) => (star.id === payload.star.id ? { ...star, ...payload.star } : star)),
      );
      setSelectedTokenId(payload.star.tokenId);
      setMintStatus(`NFT #${payload.star.tokenId} закреплен за ${shortWallet(payload.star.wallet)}.`);
    } catch {
      setMintStatus("Сеть недоступна. Повторите попытку позже.");
    } finally {
      setIsMinting(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
      <div className="relative flex flex-col overflow-hidden rounded-[2rem] border border-cyan-200/20 bg-slate-950/70 p-4 shadow-2xl shadow-cyan-950/40 backdrop-blur">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.2),transparent_28%),radial-gradient(circle_at_72%_72%,rgba(168,85,247,0.15),transparent_34%)]" />
        
        {/* Хедер карты */}
        <div className="relative z-10 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-cyan-100/80">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-medium tracking-wide">
              🖱️ ЛКМ — вращать · ПКМ+ЛКМ — двигать · Колесо — зум
            </span>
            <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1.5 text-yellow-300 font-bold animate-pulse">
              Zoom: {zoom.toFixed(1)}x
            </span>
            <button
              type="button"
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-bold transition ${
                isAutoRotating
                  ? "border-cyan-400/50 bg-cyan-400/20 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                  : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {isAutoRotating ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              {isAutoRotating ? "Автовращение" : "Вращать"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedTokenId}
              onChange={(e) => {
                setSelectedTokenId(Number(e.target.value));
                setIsAutoRotating(false);
              }}
              className="rounded-full border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 outline-none transition focus:border-cyan-400"
            >
              <option value="">🎯 Быстрый переход к звезде...</option>
              {localStars.map((s) => (
                <option key={s.id} value={s.tokenId}>
                  #{s.tokenId} {s.name} ({s.constellation})
                </option>
              ))}
            </select>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-semibold">
              {mintedCount}/{localStars.length} NFT minted
            </span>
          </div>
        </div>

        {/* Интерактивное 3D-пространство */}
        <div
          ref={mapContainerRef}
          className="relative h-[520px] cursor-grab select-none overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.1),rgba(2,6,23,0.95)_70%)] active:cursor-grabbing overscroll-contain touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => setDragStart(null)}
          onContextMenu={handleContextMenu}
        >
          {/* Контроллеры камеры и зума на карте */}
          <div className="absolute left-4 top-4 z-10 flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/80 p-1.5 backdrop-blur">
            <button
              type="button"
              title="Приблизить камеру"
              onClick={() => {
                setIsAutoRotating(false);
                setZoom(z => Math.min(8.0, z + 0.3));
              }}
              className="grid h-8 w-8 place-items-center rounded-xl text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Отдалить камеру"
              onClick={() => {
                setIsAutoRotating(false);
                setZoom(z => Math.max(0.15, z - 0.3));
              }}
              className="grid h-8 w-8 place-items-center rounded-xl text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Сбросить камеру (центр + масштаб)"
              onClick={() => {
                setZoom(2.5);
                setRotation({ x: -18, y: 32 });
                setPan({ x: 0, y: 0 });
              }}
              className="grid h-8 w-8 place-items-center rounded-xl text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Фильтр отображения на карте */}
          <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-2xl border border-white/10 bg-slate-950/80 p-1.5 backdrop-blur text-[10px]">
            <span className="px-2 font-semibold text-slate-400">Показать на карте:</span>
            {["all", "Mythic", "Legendary", "Epic", "Rare", "Common"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setMapRarityFilter(r)}
                className={`rounded-lg px-2 py-1 font-bold transition ${
                  mapRarityFilter === r
                    ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {r === "all" ? "Все" : r}
              </button>
            ))}
          </div>

          {/* Концентрические орбитальные кольца с учётом зума */}
          <div 
            className="absolute left-1/2 top-1/2 rounded-full border border-cyan-200/5 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300"
            style={{ width: `${78 * zoom}%`, height: `${78 * zoom}%` }}
          />
          <div 
            className="absolute left-1/2 top-1/2 rounded-full border border-fuchsia-200/5 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300"
            style={{ width: `${56 * zoom}%`, height: `${56 * zoom}%` }}
          />
          <div 
            className="absolute left-1/2 top-1/2 rounded-full border border-amber-200/5 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300"
            style={{ width: `${34 * zoom}%`, height: `${34 * zoom}%` }}
          />

          {/* 3D Сцена со звёздами-шарами (pan + rotate + zoom) */}
          <div
            className="absolute inset-10 [transform-style:preserve-3d] transition-all duration-150"
            style={{ 
              transform: `translate(${pan.x}px, ${pan.y}px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`
            }}
          >
            <div className="absolute left-1/2 top-1/2 h-[84%] w-[84%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-300/5 [transform:rotateX(72deg)]" />
            
            {localStars.map((star) => {
              if (mapRarityFilter !== "all" && star.rarity !== mapRarityFilter) {
                return null;
              }

              // Вычисляем размер шара на основе реальной звёздной величины (увеличен в 2 раза)
              const size = Math.max(32, Math.round(64 - star.magnitude * 4.0));
              const isSelected = star.tokenId === selectedStar?.tokenId;

              // Эффект настоящей 3D-сферы (шара) с тенью, атмосферой и бликом
              const style = {
                left: `${50 + star.x * 1.0}%`,
                top: `${50 - star.y * 1.0}%`,
                width: `${size}px`,
                height: `${size}px`,
                // Радиальный градиент создает иллюзию объемного шара со светотенью и атмосферой
                background: `radial-gradient(circle at 28% 28%, #ffffff 0%, rgba(255,255,255,0.85) 15%, ${star.color} 55%, rgba(2,6,23,0.98) 95%)`,
                // Внутренние и внешние тени для глубокого объемного свечения и атмосферой планеты/звезды
                boxShadow: isSelected 
                  ? `0 0 ${size * 2.2}px #ffffff, 0 0 ${size * 1.6}px ${star.color}, inset -3px -3px ${size * 0.4}px rgba(0,0,0,0.9), inset 2px 2px ${size * 0.2}px rgba(255,255,255,0.7)`
                  : `0 0 ${size * 1.3}px ${star.color}, inset -2px -2px ${size * 0.35}px rgba(0,0,0,0.9), inset 1px 1px ${size * 0.15}px rgba(255,255,255,0.5)`,
                transform: `translate(-50%, -50%) translateZ(${star.z * 3.5}px)`,
                borderRadius: "50%",
              } satisfies CSSProperties;

              return (
                <button
                  key={star.id}
                  type="button"
                  aria-label={`NFT star ${star.name}`}
                  className={`absolute transition-all duration-200 hover:scale-135 focus:outline-none ${
                    star.minted ? "ring-2 ring-emerald-400/90 shadow-[0_0_15px_rgba(52,211,153,0.5)]" : "ring-1 ring-white/30"
                  } ${isSelected ? "scale-140 z-20 ring-4 ring-white" : ""}`}
                  style={style}
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedTokenId(star.tokenId);
                  }}
                >
                  {/* Световой блик на поверхности сферы */}
                  <span className="absolute left-[20%] top-[20%] h-[25%] w-[25%] rounded-full bg-white/70 blur-[1px] pointer-events-none" />
                  
                  {/* Световые 3D кольца-атмосферы вокруг выбранного шара */}
                  {isSelected && (
                    <span 
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 animate-pulse pointer-events-none"
                      style={{ width: `${size * 1.6}px`, height: `${size * 1.6}px` }}
                    />
                  )}
                  {isSelected && (
                    <span className="absolute left-1/2 top-1/2 h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-white/10 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Информационная панель положения камеры */}
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-[11px] text-slate-300 backdrop-blur">
            <span>Камера: X {rotation.x.toFixed(0)}°</span>
            <span>ParagonSpace 3D Sphere Engine</span>
            <span>Камера: Y {rotation.y.toFixed(0)}°</span>
          </div>
        </div>
      </div>

      <aside className="space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 text-slate-100 shadow-2xl shadow-slate-950/30 backdrop-blur">
        <div className="rounded-3xl border border-cyan-200/20 bg-cyan-300/10 p-5">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/80">selected asset</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">{selectedStar?.name}</h2>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className={`rounded-full border px-3 py-1 ${rarityClass(selectedStar?.rarity ?? "")}`}>
              {selectedStar?.rarity}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200">
              NFT #{selectedStar?.tokenId}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200">
              Class {selectedStar?.spectralClass}
            </span>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-slate-950/40 p-3">
              <dt className="text-slate-400">Созвездие</dt>
              <dd className="font-medium text-white">{selectedStar?.constellation}</dd>
            </div>
            <div className="rounded-2xl bg-slate-950/40 p-3">
              <dt className="text-slate-400">Величина</dt>
              <dd className="font-medium text-white">{selectedStar?.magnitude.toFixed(1)}</dd>
            </div>
            <div className="col-span-2 rounded-2xl bg-slate-950/40 p-3">
              <dt className="text-slate-400">Держатель</dt>
              <dd className="break-all font-medium text-white">{shortWallet(selectedStar?.wallet ?? null)}</dd>
            </div>
            <div className="col-span-2 rounded-2xl bg-slate-950/40 p-3">
              <dt className="text-slate-400">Tx hash</dt>
              <dd className="break-all font-mono text-xs text-cyan-100">{selectedStar?.txHash ?? "ожидает минта"}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Mint console</p>
              <h3 className="mt-1 text-xl font-semibold text-white">Получить актив</h3>
            </div>
            <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100">
              {progress}% claimed
            </span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200" style={{ width: `${progress}%` }} />
          </div>
          <label className="mt-5 block text-sm text-slate-300" htmlFor="wallet">
            EVM wallet address
          </label>
          <input
            id="wallet"
            value={wallet}
            onChange={(event) => setWallet(event.target.value)}
            placeholder="0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-mono text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/70 focus:bg-white/15"
          />
          <button
            type="button"
            onClick={handleMint}
            disabled={isMinting}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-cyan-300 via-sky-300 to-fuchsia-300 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-950/40 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isMinting ? "Minting..." : "Mint next asset NFT"}
          </button>
          <p className="mt-3 min-h-10 text-sm text-cyan-100/85">{mintStatus || "Введите кошелек, чтобы получить свободную звезду."}</p>
        </div>
      </aside>
    </section>
  );
}
