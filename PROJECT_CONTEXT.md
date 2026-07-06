# ParagonSpace — Полный контекст проекта

> Скопируйте этот документ в новый чат / на другой компьютер, чтобы продолжить разработку
> ровно с этого места. Здесь описано ВСЁ: концепция, что уже построено, архитектура,
> структура файлов, схема БД, игровые и научные механики, а также как восстановить код.

---

## 1. КРАТКОЕ ОПИСАНИЕ

**ParagonSpace** — блокчейн-проект цифровых активов, основанных на реальных данных звёзд. Каждый NFT — это коллекционный цифровой актив, который к реальному владению небесными телами отношения не имеет.

**Главная формула:** `1 NFT = 1 цифровой актив на данных звезды` на интерактивной 3D-карте звёздного неба.

Проект состоит из трёх смысловых слоёв:
1. **NFT-слой** — каждый токен привязан к научным параметрам одной звезды с координатами, редкостью, созвездием.
2. **GameFi-слой** — звёзды становятся игровыми юнитами: прокачка, ресурсы, экспедиции, PvP, созвездия-альянсы.
3. **Science-слой** — привязка NFT к реальным астрономическим каталогам (NASA/ESA) и космическим миссиям (SpaceX, Blue Origin, NASA).

**Технологии:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + PostgreSQL + Drizzle ORM + lucide-react.

**Текущий статус:** рабочий MVP. Всё собирается, проходит typecheck и production build.

---

## 2. ЧТО УЖЕ ПОСТРОЕНО

### Основное приложение (лендинг + MVP)
- ✅ Одностраничный лендинг с разделами: Hero, 3D-карта, Каталог, Концепция, Как работает, Монетизация, GameFi, Наука, Инвесторам, Этапы, Перенос проекта.
- ✅ **Интерактивная 3D-карта** звёзд с drag-to-orbit вращением (CSS 3D, без WebGL). 20 звёзд.
- ✅ **Каталог активов (Genesis Catalog)** — интерактивный поиск, фильтрация по редкости, созвездию и статусу (minted/свободен).
- ✅ **Симулятор дохода (Live Yield Simulator)** — интерактивный калькулятор статов и добычи ресурсов в реальном времени с учётом бонусов созвездий.
- ✅ **Mint Console** — ввод EVM-адреса → сервер назначает свободный актив, генерирует tx hash.
- ✅ **Live Registry** — статистика: всего / выпущено / свободно (данные из PostgreSQL).

### База данных
- ✅ Таблица `paragon_stars` (Drizzle схема). Автосидирование 20 звёзд при первом запросе.

### GameFi (спроектирован, данные и формулы готовы)
- ✅ 5 типов ресурсов, 6 уровней редкости (Common→Mythic), прокачка до 99 уровня.
- ✅ 5 созвездий-альянсов, 5 экспедиций, 4 PvP-сектора.
- ✅ Формулы: расчёт статов, добычи, боя.

### Science Layer (спроектирован)
- ✅ 6 научных каталогов (Hipparcos, Gaia DR3, TESS, NASA Exoplanet Archive, JWST, Messier).
- ✅ 7 космических миссий с привязкой к NFT (SpaceX Starlink/Transporter, JWST, Artemis, Blue Origin, ISS, Mars Sample Return).
- ✅ 4 уровня партнёрской программы, 10 научных достижений (ачивок).

### Презентации (самодостаточные HTML, открываются на любом компьютере)
- ✅ `public/paragonspace-pitch.html` — инвесторский питч-дек (9 слайдов).
- ✅ `public/paragonspace-impl.html` — план реализации / техническая архитектура (9 слайдов).
- Обе печатаются в PDF через кнопку (window.print) со специальными @media print стилями.

### Перенос проекта
- ✅ `make-restore.sh` — генератор скрипта-восстановителя.
- ✅ `restore-paragonspace.sh` — восстанавливает все 22 файла байт-в-байт.
- ✅ `public/restore-paragonspace.sh.txt` — скачиваемая версия с сайта.

---

## 3. СТРУКТУРА ФАЙЛОВ

```
├── package.json                         # зависимости (next, react, drizzle, pg, lucide-react, tailwind)
├── tsconfig.json                        # strict TS, alias @/* → ./src/*
├── next.config.ts                       # пустой конфиг
├── postcss.config.mjs                   # @tailwindcss/postcss
├── eslint.config.mjs                    # next core-web-vitals flat config
├── drizzle.config.json                  # dialect postgresql, schema ./src/db/schema.ts
├── .env                                 # DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
│
├── src/
│   ├── db/
│   │   ├── index.ts                     # Drizzle client (Pool из pg, глобальный кэш)
│   │   └── schema.ts                    # таблица paragon_stars + тип ParagonStar
│   │
│   ├── lib/
│   │   ├── paragon-space.ts             # серверная логика: сид, getStars, getStats, mint
│   │   └── science-layer.ts             # каталоги, миссии, партнёрства, ачивки (данные + типы)
│   │
│   ├── gamefi/
│   │   └── mechanics.ts                 # ресурсы, редкости, созвездия, экспедиции, PvP, формулы
│   │
│   ├── components/
│   │   ├── paragon-star-map.tsx         # "use client" — 3D-карта + mint console
│   │   ├── star-catalog-explorer.tsx    # "use client" — поиск и фильтрация активов каталога
│   │   ├── star-yield-simulator.tsx     # "use client" — интерактивный калькулятор статов и дохода
│   │   ├── gamefi-section.tsx           # "use client" — вкладки GameFi
│   │   └── science-section.tsx          # "use client" — вкладки Science
│   │
│   └── app/
│       ├── layout.tsx                   # root layout, metadata (ru)
│       ├── page.tsx                     # главная (server component), собирает все секции
│       ├── globals.css                  # @import tailwindcss + dark theme + скроллбары
│       └── api/
│           ├── health/route.ts          # GET /api/health → { ok: true }
│           └── stars/mint/route.ts      # POST /api/stars/mint → назначает звезду кошельку
│
└── public/
    ├── paragonspace-pitch.html          # инвесторская презентация (9 слайдов)
    ├── paragonspace-impl.html           # план реализации (9 слайдов)
    └── restore-paragonspace.sh.txt      # скачиваемый скрипт-восстановитель
```

---

## 4. СХЕМА БАЗЫ ДАННЫХ (`src/db/schema.ts`)

Таблица `paragon_stars`:

| Поле | Тип | Описание |
|------|-----|----------|
| id | serial PK | внутренний id |
| token_id | integer, unique | номер NFT-токена |
| name | text | имя звезды |
| constellation | text | созвездие |
| rarity | text | Mythic / Legendary / Epic / Rare / Common |
| spectral_class | text | O / B / A / F / G / K / M |
| magnitude | real | звёздная величина (меньше = ярче) |
| x, y, z | real | координаты на 3D-карте |
| color | text | hex-цвет свечения |
| minted | boolean | выпущена ли (default false) |
| wallet | text nullable | адрес владельца |
| tx_hash | text nullable | демо-хэш транзакции минта |
| minted_at | timestamptz nullable | время минта |
| created_at | timestamptz | default now() |

Уникальный индекс на `token_id`. Тип `ParagonStar = typeof paragonStars.$inferSelect`.

---

## 5. GAMEFI МЕХАНИКИ (`src/gamefi/mechanics.ts`)

### Ресурсы (5)
| Ресурс | Редкость | Иконка | Назначение |
|--------|----------|--------|-----------|
| Star Dust | common | ✨ | базовый апгрейд уровней |
| Energy Crystal | uncommon | 💎 | восстановление энергии, исследования |
| Data Shard | rare | 🔷 | открытие созвездий |
| Void Essence | epic | 🟣 | повышение редкости |
| Galactic Token | mythic | 🌌 | DAO-голосование, эксклюзив |

### Редкости и множители статов
Common ×1.0 (max lvl 10) · Uncommon ×1.3 (20) · Rare ×1.7 (30) · Epic ×2.2 (40) · Legendary ×3.0 (50) · Mythic ×4.0 (99).

### Формулы
```
levelFactor = 1 + (level - 1) * 0.12
Атака/Защита/HP = base * levelFactor * rarityMultiplier
Добыча Star Dust/час = miningPower * miningSpeed * 0.1
PvP: attackPower = атака * (1 + скорость / (скорость_атак + скорость_защ))
     урон = max(1, attackPower - defensePower * 0.3)
     побеждает у кого больше HP осталось
```

### Созвездия (5 альянсов)
Пояс Ориона (+15% атака), Щит Геркулеса (+20% защита), Печь шахтёра (+25% добыча), Сердце галактики (+30% энергия), Глаз вселенной (+40% открытия).

### Экспедиции (5)
Ближний сектор (2ч, low), Туманность Андромеды (6ч, medium), Поле астероидов (12ч, high), Чёрная дыра (24ч, extreme), Руины предтеч (48ч, extreme).

### PvP-сектора (4)
Арена новичков (lvl1+, 1 GT), Сектор войны (lvl10+, 3 GT), Зона хаоса (lvl25+, 8 GT), Галактический турнир (lvl40+, 20 GT, еженедельно).

---

## 6. SCIENCE LAYER (`src/lib/science-layer.ts`)

### Научные каталоги (6)
Hipparcos (118k звёзд, ESA), Gaia DR3 (1.8 млрд, ESA), TESS (350k, NASA), NASA Exoplanet Archive (5.5k планет), JWST (изображения), Messier (110 туманностей).

### Космические миссии (7)
Starlink Group 12-3 (SpaceX), James Webb (NASA/ESA), Artemis III (NASA), Transporter-15 (SpaceX), New Shepard NS-30 (Blue Origin), ISS, Mars Sample Return (NASA/ESA).

### Партнёрская программа (4 уровня)
Star Mapper (бесплатно) → Constellation Partner ($5k–25k) → Galaxy Partner ($50k–250k) → Mission Partner ($500k+).

### Научные достижения (10)
Первый свет, Создатель созвездия, JWST Certified, ISS Flyover, Охотник за планетами, Mars Visible, Переменная звезда, Галактический коллекционер, Голос галактики, Имя на орбите.

**Ключевые фичи для привлечения SpaceX:** программа "Star Name to Orbit" (имя звезды на спутнике Starlink), брендовые созвездия, STEM-образование, привязка каждого запуска к NFT-дропу.

---

## 7. КЛЮЧЕВЫЕ API И ЛОГИКА

### `src/lib/paragon-space.ts`
- `ensureParagonSeed()` — если таблица пустая, вставляет 20 стартовых звёзд.
- `getParagonStars()` — все звёзды (сортировка по token_id).
- `getParagonStats()` — { total, minted, available }.
- `mintParagonStar(wallet)` — валидирует EVM-адрес (regex `^0x[a-fA-F0-9]{40}$`), находит первую свободную звезду, назначает кошельку, генерирует детерминированный tx hash. Если кошелёк уже владеет звездой — возвращает её.

### API routes
- `GET /api/health` → `{ ok: true }` (healthcheck).
- `POST /api/stars/mint` body `{ wallet }` → `{ ok, star }` или `{ ok:false, message }`.

### `src/app/page.tsx` (server component)
Грузит `getParagonStars()` + `getParagonStats()` через `Promise.all`, рендерит все секции и клиентские компоненты `<ParagonStarMap>`, `<GamefiSection>`, `<ScienceSection>`.

---

## 8. КАК ЗАПУСТИТЬ НА НОВОМ КОМПЬЮТЕРЕ

### Вариант A — через скрипт-восстановитель (рекомендуется)
```bash
mkdir paragonspace && cd paragonspace
# положите restore-paragonspace.sh сюда (скачать с сайта: /restore-paragonspace.sh.txt)
bash restore-paragonspace.sh     # воссоздаёт все 22 файла
npm install
# поднимите PostgreSQL, проверьте DATABASE_URL в .env
npx drizzle-kit push             # создаёт таблицу paragon_stars
npm run dev                      # dev-режим  (или: npm run build && npm run start)
```

### Вариант B — вручную
Создайте файлы из раздела «Структура файлов» с содержимым из репозитория/скрипта, затем те же команды `npm install` → `drizzle-kit push` → `npm run dev`.

### Требования
- Node.js 18+ (лучше 20+), npm.
- PostgreSQL (локально или облако). Строка: `postgresql://<user>:<pass>@<host>:5432/<db>`.

### Команды проверки (должны проходить без ошибок)
```bash
npx next typegen
npx tsc --noEmit --pretty false
npm run build
```

---

## 9. ROADMAP РЕАЛИЗАЦИИ (следующие шаги)

**Phase 1 — MVP+ (0–2 мес, ~$50k):** текущий MVP, seed Hipparcos (1000 звёзд), базовый GameFi, WalletConnect (wagmi/viem), ERC-721 на Base Sepolia.

**Phase 2 — Science Alpha (2–5 мес, ~$100k):** импорт Gaia/TESS/NASA, API-шлюз + cron-синхронизация, "Star Name to Orbit" со SpaceX, ачивки JWST/ISS, партнёрка с университетами.

**Phase 3 — GameFi Beta (5–8 мес, ~$150k):** экспедиции, PvP, созвездия, marketplace с роялти, DAO.

**Phase 4 — Launch (8–12 мес, ~$200k+):** public mint (Base + Ethereum), AR/VR, мультичейн, публичный API, брендовые созвездия.

### Технические TODO (что ещё НЕ реализовано в коде)
- [ ] Реальный smart contract (Solidity ERC-721 + ERC-2981 роялти).
- [ ] WalletConnect/MetaMask (сейчас mint через серверный API, не on-chain).
- [ ] Таблицы `star_stats`, `star_resources`, `expeditions_log`, `battle_log`, `science_links` (GameFi сейчас только данные/формулы, без персистентности).
- [ ] Реальные API-интеграции NASA/ESA/SpaceX (сейчас статические данные).
- [ ] Marketplace (list/buy/cancel).
- [ ] Импорт научных каталогов в БД + алгоритм catalogToStarMap (RA/DEC → x/y/z).
- [ ] Интерактивные действия GameFi/Science на сайте (сейчас презентационные вкладки).

---

## 10. МОНЕТИЗАЦИЯ (6 потоков)
1. Primary mint (продажа звёзд).
2. Secondary royalties (5–10% с перепродаж).
3. Premium sky tools (подписка $5–15/мес).
4. Branded constellations (B2B $5k–50k+).
5. Launchpad / NFT drops (комиссия 5–15%).
6. API licensing (B2B доступ к карте).

**Инвестиции:** pre-seed $150k–300k → seed $1–2M → Series A $5M+.

---

## 11. ВАЖНЫЕ ЗАМЕЧАНИЯ ДЛЯ ПРОДОЛЖЕНИЯ
- Все клиентские компоненты помечены `"use client"`.
- Стиль: тёмная космическая тема, Tailwind, cyan/fuchsia/amber/green акценты, скруглённые карточки, backdrop-blur.
- `page.tsx` — большой server component; секции идут по порядку с якорями (#concept, #how-it-works, #monetization, #gamefi, #science, #investors, #stages, #export).
- Валидация обязательна после изменений: `next typegen` → `tsc --noEmit` → `npm run build`.
- Иконки — из `lucide-react`.
- Не редактировать `package.json` вручную для установки пакетов — использовать npm install.
- `mint` идемпотентен по кошельку (один кошелёк — одна звезда в текущей логике).

---

*Документ описывает состояние проекта ParagonSpace на момент экспорта. Скопируйте его целиком, чтобы восстановить полный контекст и продолжить разработку.*
