# 🤖 CURSOR HANDOFF — Главное руководство и Промпт-Бук для работы в Cursor

> **Этот документ создан специально для вас как соло-фаундера.**
> Когда вы откроете проект в редакторе **Cursor**, этот файл станет вашей «шпаргалкой» и источником
> готовых команд (промптов) для ИИ. Здесь сохранена ВСЯ техническая логика проекта без потерь.

---

## 🚀 ЧАСТЬ 1. КАК НАЧАТЬ РАБОТУ В CURSOR (ЗА 3 МИНУТЫ)

1. **Откройте папку проекта в Cursor:**  
   В верхнем меню нажмите `File -> Open Folder` и выберите папку `paragonspace`.
2. **ИИ уже знает всё о проекте!**  
   В проекте лежит файл **`.cursorrules`**. Редактор Cursor автоматически считывает его в фоновом режиме. ИИ уже знает, что это Next.js 16, PostgreSQL, Drizzle ORM, что формула проекта — `1 NFT = 1 цифровой актив на данных звезды`, и помнит все формулы GameFi и Science!
3. **Откройте чат с ИИ:**  
   Нажмите на клавиатуре `Ctrl + I` (на Windows) или `Cmd + I` (на Mac) или `Ctrl + L` / `Cmd + L` для открытия правой панели чата.
4. **Выберите правильную модель:**  
   В правом нижнем углу чата выберите модель **`Claude 3.7 Sonnet`** (или `Claude 3.5 Sonnet`) — это лучший в мире ИИ для веб-разработки и Next.js.
5. **Вставьте готовый промпт из ЧАСТИ 3 этого документа!**

---

## 🏗️ ЧАСТЬ 2. ТЕХНИЧЕСКИЙ КАРКАС И СОСТОЯНИЕ КОДА (ДЛЯ ИИ)

> *Примечание для Cursor AI: Ниже приведено точное состояние архитектуры и контрактов данных, которые уже реализованы в коде. Используй эти типы и константы при расширении функционала.*

### 1. Текущая база данных (`src/db/schema.ts`)
```typescript
export const paragonStars = pgTable("paragon_stars", {
  id: serial("id").primaryKey(),
  tokenId: integer("token_id").notNull(),
  name: text("name").notNull(),
  constellation: text("constellation").notNull(),
  rarity: text("rarity").notNull(),          // "Mythic" | "Legendary" | "Epic" | "Rare" | "Common"
  spectralClass: text("spectral_class").notNull(), // "O" | "B" | "A" | "F" | "G" | "K" | "M"
  magnitude: real("magnitude").notNull(),
  x: real("x").notNull(),
  y: real("y").notNull(),
  z: real("z").notNull(),
  color: text("color").notNull(),
  minted: boolean("minted").default(false).notNull(),
  wallet: text("wallet"),
  txHash: text("tx_hash"),
  mintedAt: timestamp("minted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
```

### 2. Серверные API-роуты
- **GET `/api/health`** → Возвращает `{ ok: true }` после проверки `SELECT 1` в PostgreSQL.
- **POST `/api/stars/mint`** → Принимает JSON `{ wallet: "0x..." }`. Проверяет формат EVM-адреса, находит первую свободную звезду (`minted === false`), обновляет запись в БД, генерирует детерминированный `txHash` вида `0xps...` и возвращает `{ ok: true, star: ParagonStar }`.

### 3. Архитектура 3D-карты (`src/components/paragon-star-map.tsx`)
- Работает на чистом CSS 3D: контейнер имеет `transform-style: preserve-3d`, вращение управляется через состояния `rotateX` и `rotateY`, захват мыши через `onPointerDown`/`onPointerMove`/`onPointerUp`. Каждая точка получает стиль: `left: 50% + x*0.42%`, `top: 50% - y*0.42%`, `transform: translateZ(z*2.1px)`.
- Никаких WebGL-библиотек не подключено — это обеспечивает мгновенную загрузку и 60 FPS на любых устройствах.

---

## 📋 ЧАСТЬ 3. ПРОМПТ-БУК (ГОТОВЫЕ ПРОМПТЫ ДЛЯ КОПИРОВАНИЯ В CURSOR)

Когда вы захотите перевести проект на следующий этап, просто скопируйте нужный промпт из блоков ниже и вставьте в чат Cursor (`Cmd+I` / `Ctrl+I`).

### 🔹 ПРОМПТ 1: Добавление персистентного хранения для GameFi-ресурсов (PostgreSQL)
*Зачем: Сейчас ресурсы и формулы описаны в `src/gamefi/mechanics.ts` как типы. Этот промпт создаст таблицы в базе данных для хранения реального баланса ресурсов каждого игрока и истории экспедиций.*

```text
Прочитай наш файл .cursorrules и изучи src/db/schema.ts и src/gamefi/mechanics.ts.
Нам нужно сделать GameFi-слой персистентным (сохраняемым в PostgreSQL).
Выполни следующие задачи:
1. В файле src/db/schema.ts добавь две новые таблицы:
   - `star_stats`: связь по `star_id` (foreign key на paragon_stars.id), поля `level` (int, default 1), `experience` (int, default 0), `energy` (int, default 100), `max_energy` (int, default 100).
   - `user_resources`: связь по `wallet` (text), поля для балансов всех 5 ресурсов из mechanics.ts (`star_dust`, `energy_crystal`, `data_shard`, `void_essence`, `galactic_token` — все integer, default 0), а также `updated_at`.
   - `expeditions_log`: поля `id` (serial), `star_id`, `expedition_id` (int), `start_time` (timestamp), `end_time` (timestamp), `claimed` (boolean default false).
2. Обнови src/lib/paragon-space.ts: при минте новой звезды автоматически создавай для неё начальную запись в `star_stats` и проверяй наличие записи в `user_resources` для кошелька.
3. Напиши новый API-роут `src/app/api/gamefi/expedition/route.ts` (POST), который будет принимать `{ starId, expeditionId }`, проверять энергию в `star_stats`, создавать запись в `expeditions_log` и списывать энергию.
4. После изменений напомни мне запустить `npx drizzle-kit push` и проверь типизацию через `npx tsc --noEmit`.
```

---

### 🔹 ПРОМПТ 2: Интеграция Web3 кошелька (WalletConnect / MetaMask)
*Зачем: Чтобы пользователи могли подключать настоящий криптокошелек на сайте вместо ручного ввода адреса в текстовое поле.*

```text
Прочитай .cursorrules. Мы переходим к Фазе 2 (Web3 Alpha).
Нам нужно подключить реальную авторизацию через Web3-кошельки (MetaMask, Rabby, Trust Wallet).
Выполни шаги:
1. Установи современные стандарты Web3 для React: запусти в терминале команду `npm install wagmi viem @tanstack/react-query @web3modal/wagmi`.
2. Создай конфигурационный файл `src/lib/wagmi.ts`, настроив поддержку сетей `base` (Coinbase L2) и `mainnet` (Ethereum). Используй публичные RPC или подготовь место под NEXT_PUBLIC_WC_PROJECT_ID.
3. Создай клиентский провайдер `src/components/web3-provider.tsx` и оберни в него наше приложение в `src/app/layout.tsx`.
4. В компоненте `src/components/paragon-star-map.tsx` замени текстовое поле ввода кошелька (`input id="wallet"`) на красивую кнопку подключения кошелька (`<w3m-button />` или кастомную кнопку Wagmi `useAccount()`). Когда кошелек подключен, автоматически подставляй его адрес в функцию handleMint().
5. Проверь сборку через `npm run build`.
```

---

### 🔹 ПРОМПТ 3: Написание смарт-контракта ERC-721 на Solidity (для сети Base)
*Зачем: Чтобы перенести владение активами из PostgreSQL на блокчейн.*
*(Совет: Для этого промпта выберите в Cursor модель **o3-mini** или **o1** — они лучше пишут смарт-контракты).*

```text
Мы готовим смарт-контракт для проекта ParagonSpace для развёртывания в сети Base L2.
Наш принцип: "1 NFT = 1 цифровой актив на астрономических данных звезды".
Создай в новой папке `contracts/` файл `ParagonStarNFT.sol` на языке Solidity (версия ^0.8.24) со следующей архитектурой:
1. Наследуй контракты от OpenZeppelin: `ERC721`, `ERC721Enumerable`, `ERC2981` (для роялти 5% в пользу платформы), `Ownable`.
2. Добавь структуру `StarMetadata`, содержащую:
   - `uint256 scienceId` (ID объекта в научном каталоге Hipparcos/Gaia),
   - `uint8 rarity` (0=Common ... 5=Mythic),
   - `uint16 level` (уровень в GameFi, от 1 до 99).
3. Маппинг `mapping(uint256 => StarMetadata) public starData`.
4. Функция `mintStar(address to, uint256 tokenId, uint256 scienceId, uint8 rarity, string memory uri)` — вызывается только владельцем контракта (нашим бэкендом после оплаты или верификации).
5. Функция `levelUp(uint256 tokenId)` — позволяет нашему серверному GameFi-оракулу повышать уровень звезды на блокчейне.
6. Напиши подробный комментарий в шапке контракта, объясняющий назначение каждой функции.
```

---

### 🔹 ПРОМПТ 4: Интеграция реальных научных данных (NASA Exoplanet Archive API)
*Зачем: Подключить Science Layer к настоящим открытым космическим данным.*

```text
Прочитай .cursorrules и изучи файл src/lib/science-layer.ts.
Нам нужно сделать так, чтобы наш сервер получал актуальные научные данные из открытых источников NASA.
Выполни шаги:
1. Создай новый сервисный файл `src/lib/nasa-api.ts`.
2. Напиши функцию `fetchExoplanetData()`, которая делает запрос к открытому API NASA Exoplanet Archive (TAP service: `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+top+10+hostname,pl_name,sy_dist,st_spectype,st_optmag+from+ps+where+default_flag=1&format=json`) и возвращает список звёзд с подтверждёнными экзопланетами.
3. Создай новый API-роут `src/app/api/science/sync/route.ts`, который при вызове будет загружать эти данные и сохранять информацию о найденных планетах в метаданных наших звёзд в PostgreSQL.
4. Обнови интерфейс в `src/components/science-section.tsx`, чтобы во вкладке "Научные каталоги" отображался статус последнего обновления данных от NASA.
```

---

## 🛠️ ЧАСТЬ 4. ЗОЛОТЫЕ ПРАВИЛА СОЛО-ФАУНДЕРА ПРИ РАБОТЕ С CURSOR

1. **Один промпт — одна задача:** Не просите ИИ сделать 10 вещей сразу. Сначала попросите создать таблицу в БД, проверьте, что всё работает, затем просите сделать кнопку на сайте.
2. **Если что-то сломалось (красный экран в браузере):**  
   Просто скопируйте текст ошибки из терминала или браузера, вставьте в чат Cursor и напишите: *"Вот такая ошибка возникла после последнего изменения. Исправь её, опираясь на правила в .cursorrules"*. ИИ сам найдёт баг и починит.
3. **Регулярно делайте бэкап:**  
   Когда вы завершили важный этап (например, подключили Web3 и всё работает), откройте терминал в Cursor и запустите наш генератор: `bash make-restore.sh`. Он обновит файл `restore-paragonspace.sh` и вы сможете сохранить его на флешку или в облако!
