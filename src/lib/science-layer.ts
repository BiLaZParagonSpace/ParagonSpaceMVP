/*
  ═══════════════════════════════════════════════════════════════════
  SCIENCE LAYER — ParagonSpace & The Real Space Industry

  Как NFT-проект становится мостом между цифровыми активами
  и реальными космическими миссиями, данными и сообществом.

  🔭  КОНЦЕПЦИЯ:
      Каждая NFT-звезда в ParagonSpace может быть связана с
      реальным небесным объектом из каталогов Hipparcos, TESS,
      Gaia DR3 и других научных источников.

  🚀  ПАРТНЕРСТВА:
      - Данные NASA Exoplanet Archive / MAST
      - SpaceX Transporter missions (названия миссий)
      - Blue Origin / New Shepard
      - ESA / Hubble / James Webb
      - Университетские астрономические программы
  ═══════════════════════════════════════════════════════════════════
*/

// ─── НАУЧНЫЕ КАТАЛОГИ ───

export interface ScienceCatalog {
  id: string;
  name: string;
  description: string;
  source: string;
  totalObjects: number;
  type: "star" | "exoplanet" | "galaxy" | "nebula" | "constellation";
  imageCredit?: string;
}

export const SCIENCE_CATALOGS: ScienceCatalog[] = [
  {
    id: "hipparcos",
    name: "Hipparcos Catalogue",
    description: "Каталог 118 218 звезд с точными координатами, собранный спутником ESA Hipparcos. Основной источник привязки NFT-звезд к реальным объектам.",
    source: "European Space Agency (ESA)",
    totalObjects: 118218,
    type: "star",
  },
  {
    id: "gaia_dr3",
    name: "Gaia DR3",
    description: "Третий релиз данных миссии Gaia. 1.8 миллиарда звезд с беспрецедентной точностью положений, параллаксов и спектральных данных.",
    source: "ESA / DPAC",
    totalObjects: 1800000000,
    type: "star",
  },
  {
    id: "tess",
    name: "TESS (Transiting Exoplanet Survey Satellite)",
    description: "Миссия NASA по поиску экзопланет. Данные о переменности звезд, кривых блеска и кандидатах в экзопланеты.",
    source: "NASA / MIT",
    totalObjects: 350000,
    type: "star",
  },
  {
    id: "nasa_exoplanet",
    name: "NASA Exoplanet Archive",
    description: "Официальный каталог подтвержденных экзопланет и их звезд-хозяев. Более 5 500 подтвержденных планет.",
    source: "NASA / Caltech / IPAC",
    totalObjects: 5500,
    type: "exoplanet",
  },
  {
    id: "jwst_images",
    name: "James Webb Space Telescope (JWST)",
    description: "Изображения и спектроскопия глубокого космоса. Возможность привязывать NFT к реальным областям, снятым JWST.",
    source: "NASA / ESA / CSA / STScI",
    totalObjects: 100000,
    type: "galaxy",
  },
  {
    id: "messier",
    name: "Messier Catalogue",
    description: "Исторический каталог 110 туманностей, галактик и звездных скоплений. Популярные астрономические объекты.",
    source: "Charles Messier (1771) / IAU",
    totalObjects: 110,
    type: "nebula",
  },
];

// ─── КОСМИЧЕСКИЕ МИССИИ ДЛЯ NFT-ПРИВЯЗКИ ───

export interface SpaceMission {
  id: number;
  name: string;
  organization: string;
  type: "launch" | "telescope" | "station" | "probe" | "landing" | "sample_return";
  date: string;
  description: string;
  nftConnection: string;
  targetConstellation?: string;
}

export const SPACE_MISSIONS: SpaceMission[] = [
  {
    id: 1,
    name: "Starlink Mission Group 12-3",
    organization: "SpaceX",
    type: "launch",
    date: "2026-03-15",
    description: "Очередная партия спутников Starlink. Каждая звезда в созвездии 'Starlink Belt' может быть привязана к реальному спутнику на орбите.",
    nftConnection: "Владельцы звезд в созвездии Starlink Belt получают реальные TLE-данные спутников и возможность отслеживать 'свою' звезду на небе через приложение.",
  },
  {
    id: 2,
    name: "James Webb Space Telescope",
    organization: "NASA / ESA / CSA",
    type: "telescope",
    date: "2021-12-25",
    description: "Космический телескоп JWST — самый мощный телескоп человечества. Снимает глубокий космос в инфракрасном диапазоне.",
    nftConnection: "NFT звезды, попадающие в область съемки JWST, получают 'JWST Certified' бейдж и привязку к реальному научному изображению.",
  },
  {
    id: 3,
    name: "Artemis III — Возвращение на Луну",
    organization: "NASA",
    type: "landing",
    date: "2027 (planned)",
    description: "Первая пилотируемая миссия на Луну с 1972 года. Высадка на южном полюсе Луны.",
    nftConnection: "Genesis-звезды, видимые с места посадки Artemis III, получают эксклюзивный 'Artemis Landing' бейдж и координаты видимости с Луны.",
  },
  {
    id: 4,
    name: "Transporter-15 (Rideshare)",
    organization: "SpaceX",
    type: "launch",
    date: "2026-Q3 (planned)",
    description: "Регулярная миссия SpaceX Transporter — вывод на орбиту десятков малых спутников и кубсатов.",
    nftConnection: "Владельцы NFT могут отправить название своей звезды на борту кубсата в рамках программы 'Star Name to Orbit' — цифровой сертификат полета.",
  },
  {
    id: 5,
    name: "New Shepard NS-30",
    organization: "Blue Origin",
    type: "launch",
    date: "2026-Q2 (planned)",
    description: "Суборбитальный туристический полет New Shepard. Граница космоса (линия Кармана).",
    nftConnection: "Владельцы Mythic-звезд получают приоритетный доступ к лотерее билетов на суборбитальный полет с Blue Origin.",
  },
  {
    id: 6,
    name: "International Space Station (ISS)",
    organization: "NASA / Roscosmos / ESA / JAXA / CSA",
    type: "station",
    date: "1998—present",
    description: "Международная космическая станция — крупнейший рукотворный объект на орбите.",
    nftConnection: "Звезды в зените над ISS в момент пролета получают 'ISS Flyover' ачивку. Данные с трекера ISS в реальном времени.",
  },
  {
    id: 7,
    name: "Mars Sample Return Mission",
    organization: "NASA / ESA",
    type: "sample_return",
    date: "2030 (planned)",
    description: "Миссия по доставке образцов марсианского грунта на Землю.",
    nftConnection: "Genesis-звезды, находящиеся в созвездиях, видимых с Марса, получают 'Mars Visible' статус. Данные с марсоходов Perseverance.",
  },
];

// ─── НАУЧНЫЕ ДАННЫЕ ДЛЯ NFT ───

export interface ScientificDataPoint {
  starName: string;
  catalogId: string;
  ra: number;  // Right Ascension (J2000)
  dec: number; // Declination (J2000)
  magnitude: number;
  spectralType: string;
  distanceLy: number;
  exoplanets: number;
  variableType?: string;
  messierId?: string;
  hdId?: number;
  hipparcosId?: number;
  gaiaId?: string;
  tessId?: string;
  knownExoplanets?: string[];
  jwstObserved?: boolean;
  hasProximaCentauri?: boolean;
  isInJWSTCalendar?: boolean;
}

// ─── ПАРТНЕРСКАЯ ПРОГРАММА ───

export interface PartnershipTier {
  level: string;
  price: string;
  benefits: string[];
}

export const PARTNERSHIP_TIERS: PartnershipTier[] = [
  {
    level: "Star Mapper",
    price: "Бесплатно",
    benefits: [
      "Доступ к открытым данным Hipparcos и TESS",
      "Базовый API для интеграции звездной карты",
      "Упоминание в списке партнеров проекта",
    ],
  },
  {
    level: "Constellation Partner",
    price: "$5,000–$25,000",
    benefits: [
      "Возможность назвать созвездие в честь университета/лаборатории",
      "Приоритетный доступ к научным данным Gaia DR3",
      "Совместные NFT-дропы для студентов и аспирантов",
      "Научный бейдж на всех звездах созвездия",
    ],
  },
  {
    level: "Galaxy Partner",
    price: "$50,000–$250,000",
    benefits: [
      "Выделенная галактика/сектор карты для данных миссии",
      "Прямая интеграция телеметрии миссии в ParagonSpace",
      "Совместный маркетинг и PR-кампании",
      "Доход от продажи NFT-звезд в секторе (до 50%)",
      "Приоритетный доступ к программе 'Star Name to Orbit'",
    ],
  },
  {
    level: "Mission Partner",
    price: "$500,000+",
    benefits: [
      "Эксклюзивный сектор под вашу космическую миссию",
      "Все NFT-доходы с сектора направляются на финансирование миссии",
      "Возможность разместить научные данные в метаданных NFT",
      "Совместные пресс-релизы, AMA и образовательные программы",
      "Пожизненный статус Founding Partner проекта",
    ],
  },
];

// ─── НАУЧНЫЕ ДОСТИЖЕНИЯ (ACHIEVEMENTS) ───

export interface ScienceAchievement {
  id: string;
  name: string;
  description: string;
  condition: string;
  reward: string;
  icon: string;
}

export const SCIENCE_ACHIEVEMENTS: ScienceAchievement[] = [
  {
    id: "first_star",
    name: "Первый свет",
    description: "Купить свою первую звезду в ParagonSpace.",
    condition: "1 mint-транзакция",
    reward: "Бейдж 'Первый свет' + 50 ✨ Star Dust",
    icon: "🌟",
  },
  {
    id: "constellation_builder",
    name: "Создатель созвездия",
    description: "Объединить 5+ звезд в одно созвездие.",
    condition: "Собрать созвездие из 5 звезд",
    reward: "Бейдж 'Создатель созвездий' + именная запись в реестре",
    icon: "🔯",
  },
  {
    id: "jwst_match",
    name: "JWST Certified",
    description: "Владеть звездой, которая была снята телескопом James Webb.",
    condition: "Наличие звезды из календаря наблюдений JWST",
    reward: "JWST-бейдж + научное изображение в метаданных NFT",
    icon: "🔭",
  },
  {
    id: "iss_tracker",
    name: "ISS Flyover",
    description: "Быть онлайн, когда ISS пролетает над 'вашей' звездой.",
    condition: "Застать ISS в зените над координатами звезды",
    reward: "ISS-ачивка + приоритет на следующий дроп",
    icon: "🛸",
  },
  {
    id: "exoplanet_hunter",
    name: "Охотник за планетами",
    description: "Владеть звездой, у которой есть подтвержденные экзопланеты.",
    condition: "Купить звезду с exoplanets > 0",
    reward: "Бейдж 'Охотник за планетами' + данные экзопланеты в метаданных",
    icon: "🪐",
  },
  {
    id: "mars_visible",
    name: "Mars Visible",
    description: "Владеть звездой, видимой с поверхности Марса.",
    condition: "Звезда в созвездии, видимом с Марса в текущую дату",
    reward: "'Mars Visible' статус + данные с Perseverance",
    icon: "🔴",
  },
  {
    id: "tess_variable",
    name: "Переменная звезда",
    description: "Купить звезду, классифицированную TESS как переменную.",
    condition: "Звезда с variableType !== null",
    reward: "Бейдж 'Переменная звезда' + кривая блеска TESS в NFT",
    icon: "📊",
  },
  {
    id: "galactic_collector",
    name: "Галактический коллекционер",
    description: "Собрать звезды из всех 88 официальных созвездий.",
    condition: "88 уникальных созвездий в коллекции",
    reward: "Бейдж 'Галактический коллекционер' + Mythic-дроп",
    icon: "🏆",
  },
  {
    id: "dao_member",
    name: "Голос галактики",
    description: "Проголосовать в DAO за научное направление.",
    condition: "1 голос в DAO",
    reward: "Право предложить название следующего созвездия",
    icon: "🗳️",
  },
  {
    id: "star_name_to_orbit",
    name: "Имя на орбите",
    description: "Отправить название звезды на орбиту с миссией SpaceX.",
    condition: "Участие в программе 'Star Name to Orbit'",
    reward: "Сертификат полета + GPS-координаты спутника в момент запуска",
    icon: "🚀",
  },
];
