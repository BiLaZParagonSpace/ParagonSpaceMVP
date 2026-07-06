import { StarExperience } from "@/components/star-experience";
import { GamefiSection } from "@/components/gamefi-section";
import { ScienceSection } from "@/components/science-section";
import { getParagonStars, getParagonStats } from "@/lib/paragon-space";
import { Star, Code, Banknote, UserCheck, Coins, ShoppingCart, Users, ExternalLink, Sparkles, Swords, Pickaxe, Compass, Trophy, ArrowUp, Globe, Rocket, Telescope, Building2, Award } from "lucide-react";

export const dynamic = "force-dynamic";

const conceptPillars = [
  {
    icon: Star,
    title: "Цифровой актив на основе данных звезды",
    text: "Каждый токен (NFT) привязан строго к одной записи в базе данных — астрономическим параметрам звезды (координаты X, Y, Z, название, созвездие, редкость, спектральный класс, величина). Получая NFT, вы приобретаете цифровой коллекционный актив, основанный на реальных данных, без претензий на реальное владение небесными телами.",
  },
  {
    icon: Code,
    title: "Серверный реестр на PostgreSQL",
    text: "Все записи хранятся в таблице ParagonStars внутри PostgreSQL. Каждая запись — это ID, tokenId, имя, цвет, rarity, x/y/z, minted (выпущен ли актив), wallet (за кем закреплен), txHash (запись о mint). Это основа, на которой потом надстраивается on-chain smart contract.",
  },
  {
    icon: UserCheck,
    title: "Любой кошелек может получить актив",
    text: "Достаточно ввести EVM-адрес (0x...) в консоль Mint, и сервер найдет следующий свободный актив, закрепит его за вами в реестре, сгенерирует transaction hash и вернет результат. Это симуляция того, как будет работать on-chain mint, но уже с живой базой данных и координатами.",
  },
  {
    icon: Sparkles,
    title: "Разные редкости = разная ценность",
    text: "В коллекции 50 реальных звёзд из астрономических каталогов ЕКА и NASA: Mythic (самые яркие, малая величина), Legendary, Epic, Rare и Common. Редкость влияет на визуальный размер звезды на карте и ценность NFT. Качество звезды определяется её спектральным классом (O, B, A, F, G, K, M) и реальной звёздной величиной.",
  },
];

const devDeepDive = [
  {
    subject: "База данных и Drizzle ORM",
    forWhat: "Зачем это нужно",
    howWorks: "Все звезды хранятся в таблице paragon_stars. Drizzle ORM — это TypeScript-обертка над SQL. Мы описываем таблицу в schema.ts, и Drizzle автоматически создает типы, запросы и проверки.",
    exampleCode: `// Таблица звезды (упрощенно)
export const paragonStars = pgTable("paragon_stars", {
  id: serial("id").primaryKey(),
  tokenId: integer("token_id").notNull(),
  name: text("name").notNull(),
  rarity: text("rarity").notNull(),
  x: real("x").notNull(),
  y: real("y").notNull(),
  z: real("z").notNull(),
  minted: boolean("minted").default(false),
  wallet: text("wallet"),
  txHash: text("tx_hash"),
});`,
    whyImportant: "Это основа: если вы не можете хранить активы и закреплять их за кошельками в базе, вы не сможете сделать это на blockchain. Серверный реестр — must-have первый шаг.",
  },
  {
    subject: "Rarity, координаты и спектральные классы",
    forWhat: "Зачем звездам характеристики",
    howWorks: "Каждая звезда имеет спектральный класс (O — самый горячий, голубой, M — холодный, красный), звездную величину magnitude (чем меньше, тем ярче) и позицию x/y/z в условном пространстве карты.",
    exampleCode: `// Пример одной звезды
{
  tokenId: 1,
  name: "Astra Prime",
  constellation: "Genesis Ring",
  rarity: "Mythic",
  spectralClass: "O",
  magnitude: 1.2,
  x: -42, y: 30, z: 72,
  color: "#8fd3ff" // голубой
}`,
    whyImportant: "Характеристики — это data layer, который делает NFT содержательным. Без них звезда — просто строка. С ними — это игровой и коллекционный объект.",
  },
  {
    subject: "3D карта с drag-to-orbit",
    forWhat: "Зачем нужна 3D визуализация",
    howWorks: "React-компонент ParagonStarMap принимает массив звезд из базы и отрисовывает их как точки на 2D Canvas с 3D-трансформациями (perspective через CSS transform-style: preserve-3d).",
    exampleCode: `// Отрисовка одной звезды на карте
{localStars.map(star => (
  <button
    key={star.id}
    className="absolute rounded-full"
    style={{
      left: \`$\{50 + star.x * 0.42}%\`,
      top: \`$\{50 - star.y * 0.42}%\`,
      width: \`$\{size}px\`,
      backgroundColor: star.color,
      boxShadow: \`0 0 $\{size * 1.8}px $\{star.color}\`,
      transform: \`translateZ($\{star.z * 2.1}px)\`,
    }}
  />
))}`,
    whyImportant: "3D-карта — это то, что превращает реестр данных из таблицы в визуальный продукт. Пользователь видит звезду, может выбрать её, изучить научные метаданные и захотеть получить этот цифровой актив в коллекцию.",
  },
  {
    subject: "Mint flow: как назначается звезда",
    forWhat: "Что происходит при нажатии кнопки Mint",
    howWorks: "Когда вы вводите EVM-адрес и нажимаете Mint, браузер отправляет POST-запрос на /api/stars/mint. Сервер находит ближайшую свободную звезду (minted = false), записывает ваш адрес в поле wallet, генерирует тестовый txHash и ставит minted = true.",
    exampleCode: `// Серверный код минта
export async function mintParagonStar(wallet: string) {
  const available = await db.select()
    .from(paragonStars)
    .where(eq(paragonStars.minted, false))
    .orderBy(asc(paragonStars.tokenId))
    .limit(1);          // берем первую свободную
  const star = available[0];
  const [minted] = await db.update(paragonStars)
    .set({ minted: true, wallet, txHash, mintedAt: new Date() })
    .where(eq(paragonStars.id, star.id))
    .returning();
  return minted;
}`,
    whyImportant: "Этот же паттерн будет работать с настоящим Ethereum smart contract: вместо записи в таблицу — emit события Transfer(0, wallet, tokenId).",
  },
  {
    subject: "Сидирование: откуда берутся звезды",
    forWhat: "Как заполняется база звезд",
    howWorks: "В файле paragon-space.ts зашит массив seedStars с 50 реальными звёздами. При первом запросе к базе функция ensureParagonSeed() проверяет, есть ли записи в таблице. Если нет — вставляет все 50 звёзд через INSERT.",
    exampleCode: `// Логика при старте
async function ensureParagonSeed() {
  const [{ value }] = await db
    .select({ value: count() })
    .from(paragonStars);
  if (value === 0) {
    await db.insert(paragonStars)
      .values(seedStars)
      .onConflictDoNothing();
  }
}`,
    whyImportant: "Это делает проект самодостаточным: при первом развертывании звездная коллекция создается автоматически. Не нужно вручную заполнять базу или запускать отдельные скрипты.",
  },
  {
    subject: "TypeScript и Next.js Server Components",
    forWhat: "Почему сервер рендерит звезды",
    howWorks: "Главная страница — async серверный компонент, который прямо при запросе подключается к PostgreSQL, загружает звезды и статистику, после чего передает их клиентскому компоненту ParagonStarMap.",
    exampleCode: `// server component на главной
export default async function HomePage() {
  const [stars, stats] = await Promise.all([
    getParagonStars(),   // запрос в PostgreSQL
    getParagonStats(),   // запрос статистики
  ]);
  return <ParagonStarMap stars={stars} />;
}`,
    whyImportant: "Данные загружаются до того, как страница отправляется клиенту. Нет спинеров, нет restore-состояний. Клиент получает готовую звездную карту с данными из базы.",
  },
];

const monetizationStreams = [
  {
    name: "Primary mint",
    model: "Продажа первичных звездных NFT",
    detail: "Самый простой и понятный доход. Коллекция делится на сектора (Genesis, Explorer, Galaxy). Каждый сектор — 20–100 звезд. Цена растет от ранних продаж к поздним. Пример: первые 20 звезд по 0.01 ETH, следующие по 0.05 ETH.",
    why: "Вы получаете деньги сразу. Пользователь получает звезду. Нет сложной экономики — есть простая сделка. На старте это главный источник.",
  },
  {
    name: "Secondary royalties",
    model: "Комиссия с перепродаж",
    detail: "Когда пользователь перепродает звезду другому пользователю, ParagonSpace получает процент (например, 5–10%). Это стандарт NFT-рынка (EIP-2981). Чем выше оборот, тем больше доход.",
    why: "Вы продолжаете зарабатывать после первичной продажи. Если звезда становится ценной и перепродается за большую сумму, вы получаете долю без дополнительных усилий.",
  },
  {
    name: "Premium sky tools",
    model: "Подписка для коллекционеров",
    detail: "Бесплатная версия — просмотр карты и базовая информация. Premium ($5–15/мес) добавляет: кастомные 3D-профили, историю владения активом, аналитику редкостей, экспорт в Twitter/OpenSea, уведомления о новых дропах.",
    why: "Повторяющийся доход (MRR/ARR). Если у вас 1000 платных пользователей по $10/мес — это $120k/год дохода, предсказуемого и растущего.",
  },
  {
    name: "Branded constellations",
    model: "B2B-партнерства",
    detail: "Бренды, артисты, YouTube-каналы, игровые проекты получают выделенное созвездие активов (5–15 звезд) для своей аудитории. Пример: игровой проект оформляет созвездие «GameVerse» с 8 активами и раздает фанатам.",
    why: "B2B-продажи — это крупные контракты ($5k–$50k+ за созвездие). Это строит комьюнити, привлекает новых пользователей и дает PR.",
  },
  {
    name: "Launchpad / NFT drops",
    model: "Платформа для запуска коллекций",
    detail: "ParagonSpace может стать платформой, где сторонние создатели запускают свои NFT-коллекции с темой космоса, созвездий и звезд. ParagonSpace берет комиссию (5–15%) с каждого mint на своей платформе.",
    why: "Это модель к Plattform-as-a-Service. Вы не просто продаете свои звезды, а даете другим продавать свои — и получаете процент с их продаж. Масштабируется без увеличения вашей коллекции.",
  },
  {
    name: "API-лицензирование",
    model: "B2B-доступ к данным карты",
    detail: "Игры, метавселенные, сайты и приложения могут интегрировать звездную карту ParagonSpace: показывать звезды, держателей активов, разрешать вывод данных на свои платформы. API с tier-лицензиями.",
    why: "Это создает сетевой эффект: чем больше людей видят звезды на других платформах, тем больше интереса к ParagonSpace. Плюс — дополнительный B2B-доход.",
  },
];

const investorSections = [
  {
    icon: Banknote,
    title: "Что нужно доказать инвестору",
    items: [
      "Спрос: люди готовы платить за NFT-активы → waitlist, регистрации, тестовые mint.",
      "Retention: держатели активов возвращаются → демонстрируют карту, перепродают, участвуют в голосованиях.",
      "GMV (Gross Merchandise Volume): объем продаж и перепродаж — ключевой KPI для NFT-проекта.",
      "Комьюнити: соцсети, Discord, вовлечение — показатель, что проект жив и растет.",
    ],
  },
  {
    icon: ShoppingCart,
    title: "Что уже есть в MVP",
    items: [
      "Полноценная 3D-карта с 50 реальными звёздами и вращением.",
      "Рабочий mint-flow с кошельком и tx hash.",
      "База звезд с характеристиками, созвездиями и редкостями.",
      "Серверный реестр цифровых активов на PostgreSQL.",
      "Готовая архитектура для перехода на smart contract.",
    ],
  },
  {
    icon: Coins,
    title: "Куда пойдут деньги pre-seed ($150k–$300k)",
    items: [
      "Написание и аудит ERC-721 smart contract ($30k–$50k).",
      "WalletConnect + on-chain mint flow + explorer ($40k).",
      "Discord/Twitter-маркетинг, дизайн, контент ($50k).",
      "Разработка marketplace и инструментов ($50k).",
      "Юридическая упаковка: terms, IP, white paper ($20k).",
    ],
  },
  {
    icon: Users,
    title: "Ключевые метрики через 12 месяцев",
    items: [
      "10 000+ зарегистрированных EVM-кошельков.",
      "1 000+ mint-транзакций (купленных звезд).",
      "$100 000+ GMV через marketplace.",
      "5+ B2B-партнерств (бренды, игры, комьюнити).",
      "Работающая DAO-система голосования за развитие.",
    ],
  },
];

const developmentStages = [
  {
    stage: "Stage 01: MVP",
    timeline: "0–2 месяца",
    title: "Проверить, что людям это нужно",
    done: "✅ Готово в этом проекте",
    items: ["3D карта с вращением (PointerEvents, rotateX/rotateY)", "Выбор звезды и просмотр метаданных", "Mint консоль с EVM-адресом", "PostgreSQL реестр через Drizzle ORM", "Коллекция из 50 реальных звёзд"],
    nextText: "Добавить: waitlist, email-регистрацию, простую аналитику кто смотрел карту",
  },
  {
    stage: "Stage 02: Web3 Alpha",
    timeline: "2–4 месяца",
    title: "Перенести mint на настоящий blockchain",
    done: "",
    items: ["Solidity-контракт (ERC-721) с функциями mint, tokenURI", "WalletConnect / MetaMask-логин", "Перевод реестра активов в on-chain metadata", "Блокчейн-эксплорер активов", "Лендинг с интеграцией Web3"],
    nextText: "Убрать серверный mint, заменить на contract-вызов. Все записи об активах и их держателях переезжают в Ethereum (или L2).",
  },
  {
    stage: "Stage 03: Экономика",
    timeline: "4–7 месяцев",
    title: "Создать marketplace и рынок",
    done: "",
    items: ["Торговля активами (list, buy, cancel)", "Royalty 5–10% для ParagonSpace + 1% для создателя", "Сезонные дропы (новые сектора)", "Фильтры по редкости, созвездию, цене", "Система рейтинга активов"],
    nextText: "Вы начинаете зарабатывать на комиссиях, а не только на первичной продаже.",
  },
  {
    stage: "Stage 04: Сеть и DAO",
    timeline: "7–12 месяцев",
    title: "Масштабировать и дать управление комьюнити",
    done: "",
    items: ["DAO: держатели активов голосуют за развитие", "Staking: блокировка редких активов под бонусы", "Архитектура AR/VR-карты для мобильных устройств", "Публичный API для сторонних интеграций", "Брендовые созвездия как B2B-продукт"],
    nextText: "Проект становится платформой, а не просто коллекцией. Сообщество управляет и развивает продукт.",
  },
];

export default async function HomePage() {
  const [stars, stats] = await Promise.all([getParagonStars(), getParagonStats()]);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(34,211,238,0.18),transparent_26%),radial-gradient(circle_at_78%_18%,rgba(168,85,247,0.15),transparent_24%),radial-gradient(circle_at_48%_86%,rgba(251,191,36,0.1),transparent_30%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.28] [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:64px_64px]" />

      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-8 sm:px-8 lg:py-12">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-cyan-200 to-fuchsia-300 text-xl font-black text-slate-950 shadow-lg shadow-cyan-950/40">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-100">ParagonSpace</p>
                <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-200 border border-cyan-400/30 animate-pulse">
                  Alpha MVP
                </span>
              </div>
              <p className="text-xs text-slate-400">Стенд демонстрации технологий и GameFi симуляции</p>
            </div>
          </div>
          <nav className="hidden items-center gap-5 text-sm text-slate-300 md:flex">
            <a className="transition hover:text-cyan-100" href="#catalog">Каталог</a>
            <a className="transition hover:text-cyan-100" href="#concept">Концепция</a>
            <a className="transition hover:text-cyan-100" href="#how-it-works">Как работает</a>
            <a className="transition hover:text-cyan-100" href="#monetization">Монетизация</a>
            <a className="transition hover:text-cyan-100" href="#gamefi">GameFi</a>
            <a className="transition hover:text-green-100" href="#science">Наука</a>
            <a className="transition hover:text-amber-100" href="/paragonspace-impl.html" target="_blank" rel="noopener">📋 Реализация</a>
            <a className="transition hover:text-cyan-100" href="#investors">Инвесторам</a>
            <a className="transition hover:text-cyan-100" href="#stages">Этапы</a>
          </nav>
          <div className="flex items-center gap-3">
            <a className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10" href="/paragonspace-pitch.html" target="_blank" rel="noopener">
              📥 Скачать PDF
            </a>
            <a className="rounded-full border border-cyan-200/30 bg-cyan-200/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-200/20" href="#mint">
              Mint asset
            </a>
          </div>
        </header>

        {/* ─── HERO ─── */}
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-7">
            <div className="inline-flex rounded-full border border-fuchsia-200/20 bg-fuchsia-200/10 px-4 py-2 text-sm text-fuchsia-100">
              Genesis collection · Цифровые активы на данных звезд · investor-ready MVP
            </div>
            <div className="space-y-5">
              <h1 className="max-w-5xl text-[clamp(3rem,8vw,7rem)] font-black leading-[0.9] tracking-[-0.08em]">
                ParagonSpace: цифровые активы на основе данных звезд
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Каждый NFT — это цифровой актив, основанный на реальных астрономических данных звезд, и к реальному владению небесными телами отношения не имеет. Весь каталог виден на 3D-карте звездного неба.
              </p>
              <p className="max-w-2xl text-base leading-7 text-slate-400">
                Проект демонстрирует работающий MVP: лендинг, база данных с 50 реальными активами из астрономических каталогов, интерактивная 3D-карта и консоль для выпуска NFT. Ниже — полный разбор архитектуры, монетизации, плана разработки и упаковки для инвесторов.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a className="rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:scale-105" href="#how-it-works">
                Как это работает
              </a>
              <a className="rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10" href="#investors">
                Для инвесторов
              </a>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur">
            <div className="rounded-[1.5rem] bg-slate-950/70 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">Live registry</p>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-white/5 p-3">
                  <p className="text-3xl font-black text-white">{stats.total}</p>
                  <p className="text-xs text-slate-400">звезд в базе</p>
                </div>
                <div className="rounded-2xl bg-emerald-300/10 p-3">
                  <p className="text-3xl font-black text-emerald-100">{stats.minted}</p>
                  <p className="text-xs text-emerald-200/70">выпущено NFT</p>
                </div>
                <div className="rounded-2xl bg-cyan-300/10 p-3">
                  <p className="text-3xl font-black text-cyan-100">{stats.available}</p>
                  <p className="text-xs text-cyan-200/70">свободно</p>
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-cyan-200/15 bg-cyan-200/10 p-4">
                <p className="text-sm leading-6 text-cyan-50/90">
                  Реестр хранится в PostgreSQL через Drizzle ORM. Mint-операция назначает звезду на адрес EVM-кошелька, генерирует тестовый tx hash и выдает метаданные.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ─── 3D MAP + CATALOG (связаны общим выбором звезды) ─── */}
      <StarExperience stars={stars} />

      {/* ─── CONCEPT ─── */}
      <section id="concept" className="relative mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8">
        <div className="mb-6 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-fuchsia-200/70">Концепция</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">Что такое ParagonSpace</h2>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            ParagonSpace — это проект, в котором каждый NFT-токен является цифровым активом, привязанным к научным параметрам звезды на 3D-карте.
            Это не случайный дженератив-арт. Это реестр цифровых активов, построенный на реальных астрономических данных — без какого-либо отношения к физическому владению небесными телами.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {conceptPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article key={pillar.title} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                <div className="flex items-start gap-4">
                  <div className="mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cyan-200/10">
                    <Icon className="h-6 w-6 text-cyan-200" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{pillar.title}</h3>
                    <p className="mt-3 leading-7 text-slate-300">{pillar.text}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ─── HOW IT WORKS (DEEP DIVE) ─── */}
      <section id="how-it-works" className="relative mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-8 backdrop-blur">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/70">Глубокое погружение</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">Как это работает под капотом</h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              Разберем каждый технический слой — от базы данных до клиентской карты — так, чтобы было понятно и разработчику, и инвестору.
            </p>
          </div>
          <div className="mt-8 grid gap-6">
            {devDeepDive.map((item) => (
              <details key={item.subject} className="group rounded-2xl border border-white/10 bg-slate-950/50 transition hover:border-white/20">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-5 text-lg font-semibold text-white transition group-open:pb-2 group-hover:text-cyan-100">
                  <span>{item.subject}</span>
                  <span className="shrink-0 text-sm text-slate-500 group-open:text-cyan-100">[развернуть]</span>
                </summary>
                <div className="px-5 pb-5">
                  <div className="mt-2 space-y-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.15em] text-fuchsia-200/70">Зачем это нужно</p>
                      <p className="mt-1 leading-7 text-slate-300">{item.forWhat}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-200/70">Как работает</p>
                      <p className="mt-1 leading-7 text-slate-300">{item.howWorks}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-200/70">Код</p>
                      <pre className="mt-2 overflow-x-auto rounded-2xl bg-slate-950 p-5 font-mono text-xs leading-6 text-cyan-50/80">
                        {item.exampleCode}
                      </pre>
                    </div>
                    <div className="rounded-2xl border border-amber-200/15 bg-amber-200/10 p-4">
                      <p className="text-sm font-semibold text-amber-100">Почему это важно</p>
                      <p className="mt-2 leading-7 text-amber-50/85">{item.whyImportant}</p>
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MONETIZATION ─── */}
      <section id="monetization" className="relative mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8">
        <div className="mb-6 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-200/70">Монетизация</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">Как ParagonSpace зарабатывает</h2>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            6 источников дохода. Первые дают быстрые деньги. Последние строят долгосрочную устойчивую экономику.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {monetizationStreams.map((stream) => (
            <article key={stream.name} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.24em] text-amber-200/70">{stream.name}</p>
              <h3 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-white">{stream.model}</h3>
              <p className="mt-3 leading-7 text-slate-300">{stream.detail}</p>
              <div className="mt-5 rounded-2xl border border-amber-200/15 bg-amber-200/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-100">Почему это работает</p>
                <p className="mt-2 text-sm leading-6 text-amber-50/85">{stream.why}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <GamefiSection />

      <ScienceSection />

      {/* ─── INVESTORS ─── */}
      <section id="investors" className="relative mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8">
        <div className="mb-6 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-fuchsia-200/70">Инвесторам</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">Как привлекать капитал</h2>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Чтобы убедить инвестора, нужно показать не идею, а траекторию: что уже работает, какие метрики и куда пойдут деньги.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {investorSections.map((section) => {
            const Icon = section.icon;
            return (
              <article key={section.title} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                <div className="flex items-start gap-4">
                  {section.title === "Куда пойдут деньги pre-seed ($150k–$300k)" && (
                    <div className="mb-2 mt-2 flex w-full gap-2">
                      <a href="/paragonspace-pitch.html" target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-300 px-5 py-2 text-sm font-bold text-slate-950 transition hover:scale-105">
                        📥 Питч-дек (PDF)
                      </a>
                      <a href="/paragonspace-impl.html" target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-200 to-cyan-200 px-5 py-2 text-sm font-bold text-slate-950 transition hover:scale-105">
                        📋 План реализации (PDF)
                      </a>
                    </div>
                  )}
                  <div className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-fuchsia-200/10">
                    <Icon className="h-5 w-5 text-fuchsia-200" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{section.title}</h3>
                    <ul className="mt-4 space-y-3">
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-200" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ─── STAGES ─── */}
      <section id="stages" className="relative mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-8 backdrop-blur">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/70">Поэтапная разработка</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">План развития</h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              Четыре этапа — от MVP до платформы с DAO и AR/VR. Каждый этап имеет конкретные deliverables и точки проверки для инвестора.
            </p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            {developmentStages.map((phase) => (
              <article key={phase.stage} className="rounded-3xl border border-white/10 bg-slate-950/55 p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-cyan-100">{phase.stage}</p>
                  <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">{phase.timeline}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-white">{phase.title}</h3>
                {phase.done && <p className="mt-2 text-xs font-semibold text-green-300">{phase.done}</p>}
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {phase.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-200" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 rounded-2xl border border-cyan-200/15 bg-cyan-200/10 p-3">
                  <p className="text-xs leading-5 text-cyan-50/85">{phase.nextText}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative mx-auto w-full max-w-7xl px-5 pb-8 sm:px-8">
        <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] px-5 py-6 text-center text-sm text-slate-500 backdrop-blur">
          <span className="font-semibold text-cyan-100/80">ParagonSpace</span>
          <span className="mx-3">·</span>
          Цифровые активы на основе данных звезд через NFT
          <span className="mx-3">·</span>
          MVP на Next.js + PostgreSQL + Drizzle ORM
        </div>
      </footer>
    </main>
  );
}
