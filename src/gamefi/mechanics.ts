/*
  ═══════════════════════════════════════════════════════════════════
  GAMEFI MECHANICS — ParagonSpace

  Эта архитектура описывает, как NFT-звезды становятся игровыми
  активами с прокачкой, ресурсами, исследованиями и войнами.
  ───────────────────────────────────────────────────────────────────
  ПРИНЦИП: каждая звезда = живой объект, который может:
  - добывать ресурсы (Star Dust, Energy, Data Shards)
  - повышать уровень и редкость
  - объединяться в созвездия для бонусов
  - участвовать в экспедициях
  - сражаться за территории в PvP-секторах
  ═══════════════════════════════════════════════════════════════════
*/

// ─── ХАРАКТЕРИСТИКИ ЗВЕЗДЫ КАК ИГРОВОГО ЮНИТА ───

export interface StarStats {
  level: number;
  experience: number;
  experienceToNext: number;

  // Боевые характеристики
  attack: number;
  defense: number;
  speed: number;
  hp: number;
  maxHp: number;

  // Добывающие характеристики
  miningPower: number;
  miningSpeed: number;
  cargoCapacity: number;

  // Исследовательские
  scanRange: number;
  discoveryChance: number;

  // Энергия (восстанавливается со временем)
  energy: number;
  maxEnergy: number;
  energyRegenPerHour: number;
}

// ─── РЕСУРСЫ ───

export type ResourceType = "star_dust" | "energy_crystal" | "data_shard" | "void_essence" | "galactic_token";

export interface Resource {
  type: ResourceType;
  name: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "mythic";
  description: string;
  icon: string; // emoji
}

export const RESOURCES: Record<ResourceType, Resource> = {
  star_dust: {
    type: "star_dust",
    name: "Звездная пыль",
    rarity: "common",
    description: "Базовый ресурс. Добывается любой звездой. Нужен для апгрейда уровней.",
    icon: "✨",
  },
  energy_crystal: {
    type: "energy_crystal",
    name: "Кристалл энергии",
    rarity: "uncommon",
    description: "Ускоряет восстановление энергии звезды. Нужен для исследований.",
    icon: "💎",
  },
  data_shard: {
    type: "data_shard",
    name: "Осколок данных",
    rarity: "rare",
    description: "Содержит информацию о древних цивилизациях. Нужен для открытия новых созвездий.",
    icon: "🔷",
  },
  void_essence: {
    type: "void_essence",
    name: "Эссенция пустоты",
    rarity: "epic",
    description: "Редкая субстанция из черных дыр. Позволяет повысить редкость звезды.",
    icon: "🟣",
  },
  galactic_token: {
    type: "galactic_token",
    name: "Галактический токен",
    rarity: "mythic",
    description: "Управляющий токен экосистемы. Дает право голоса в DAO и доступ к эксклюзивным событиям.",
    icon: "🌌",
  },
};

// ─── РЕДКОСТЬ И ПРОКАЧКА ───

export type StarRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";

export interface RarityConfig {
  level: number;
  name: string;
  color: string;
  maxLevel: number;
  upgradeCost: Record<ResourceType, number>;
  statMultiplier: number;
}

export const RARITY_TREE: Record<StarRarity, RarityConfig> = {
  common: {
    level: 0, name: "Common", color: "#94a3b8", maxLevel: 10,
    upgradeCost: { star_dust: 100, energy_crystal: 0, data_shard: 0, void_essence: 0, galactic_token: 0 },
    statMultiplier: 1.0,
  },
  uncommon: {
    level: 1, name: "Uncommon", color: "#4ade80", maxLevel: 20,
    upgradeCost: { star_dust: 500, energy_crystal: 50, data_shard: 0, void_essence: 0, galactic_token: 0 },
    statMultiplier: 1.3,
  },
  rare: {
    level: 2, name: "Rare", color: "#60a5fa", maxLevel: 30,
    upgradeCost: { star_dust: 2000, energy_crystal: 200, data_shard: 50, void_essence: 0, galactic_token: 0 },
    statMultiplier: 1.7,
  },
  epic: {
    level: 3, name: "Epic", color: "#c084fc", maxLevel: 40,
    upgradeCost: { star_dust: 8000, energy_crystal: 800, data_shard: 200, void_essence: 5, galactic_token: 0 },
    statMultiplier: 2.2,
  },
  legendary: {
    level: 4, name: "Legendary", color: "#fbbf24", maxLevel: 50,
    upgradeCost: { star_dust: 25000, energy_crystal: 2500, data_shard: 800, void_essence: 25, galactic_token: 2 },
    statMultiplier: 3.0,
  },
  mythic: {
    level: 5, name: "Mythic", color: "#22d3ee", maxLevel: 99,
    upgradeCost: { star_dust: 100000, energy_crystal: 10000, data_shard: 4000, void_essence: 100, galactic_token: 10 },
    statMultiplier: 4.0,
  },
};

// ─── СОЗВЕЗДИЯ (АЛЬЯНСЫ ЗВЕЗД) ───

export interface Constellation {
  id: number;
  name: string;
  description: string;
  requiredStars: number;
  requiredRarity: StarRarity;
  bonusType: "attack" | "defense" | "mining" | "energy" | "discovery";
  bonusValue: number;
  bonusDescription: string;
}

export const CONSTELLATIONS: Constellation[] = [
  { id: 1, name: "Пояс Ориона", description: "Древнее созвездие охотника. Дает бонус к атаке.", requiredStars: 3, requiredRarity: "uncommon", bonusType: "attack", bonusValue: 15, bonusDescription: "+15% к атаке всех звезд в альянсе" },
  { id: 2, name: "Щит Геркулеса", description: "Защитное созвездие. Увеличивает защиту.", requiredStars: 3, requiredRarity: "uncommon", bonusType: "defense", bonusValue: 20, bonusDescription: "+20% к защите всех звезд в альянсе" },
  { id: 3, name: "Печь шахтера", description: "Созвездие добытчиков. Ускоряет майнинг.", requiredStars: 4, requiredRarity: "rare", bonusType: "mining", bonusValue: 25, bonusDescription: "+25% к скорости добычи ресурсов" },
  { id: 4, name: "Сердце галактики", description: "Мифическое созвездие в центре карты.", requiredStars: 5, requiredRarity: "epic", bonusType: "energy", bonusValue: 30, bonusDescription: "+30% к максимальной энергии всех звезд" },
  { id: 5, name: "Глаз вселенной", description: "Открывает скрытые сектора на карте.", requiredStars: 5, requiredRarity: "legendary", bonusType: "discovery", bonusValue: 40, bonusDescription: "+40% к шансу открытия редких ресурсов" },
];

// ─── ЭКСПЕДИЦИИ ───

export interface Expedition {
  id: number;
  name: string;
  description: string;
  durationHours: number;
  minLevel: number;
  requiredEnergy: number;
  rewards: Partial<Record<ResourceType, number>>;
  risk: "low" | "medium" | "high" | "extreme";
}

export const EXPEDITIONS: Expedition[] = [
  { id: 1, name: "Ближний сектор", description: "Разведка рядом с вашей звездой.", durationHours: 2, minLevel: 1, requiredEnergy: 20, rewards: { star_dust: 50, energy_crystal: 5 }, risk: "low" },
  { id: 2, name: "Туманность Андромеды", description: "Исследование газовых облаков.", durationHours: 6, minLevel: 5, requiredEnergy: 50, rewards: { star_dust: 200, energy_crystal: 25, data_shard: 5 }, risk: "medium" },
  { id: 3, name: "Поле астероидов", description: "Опасный пояс с редкими минералами.", durationHours: 12, minLevel: 10, requiredEnergy: 100, rewards: { star_dust: 500, energy_crystal: 80, data_shard: 20 }, risk: "high" },
  { id: 4, name: "Черная дыра", description: "Гравитационная аномалия. Шанс найти эссенцию пустоты.", durationHours: 24, minLevel: 20, requiredEnergy: 200, rewards: { star_dust: 1500, energy_crystal: 200, void_essence: 3, galactic_token: 1 }, risk: "extreme" },
  { id: 5, name: "Руины предтеч", description: "Древняя цивилизация. Главный источник осколков данных.", durationHours: 48, minLevel: 30, requiredEnergy: 400, rewards: { star_dust: 5000, data_shard: 150, void_essence: 10, galactic_token: 3 }, risk: "extreme" },
];

// ─── PVP-СЕКТОРА ───

export interface PvpSector {
  id: number;
  name: string;
  minLevel: number;
  description: string;
  rewardToken: number; // galactic tokens
  cooldownHours: number;
}

export const PVP_SECTORS: PvpSector[] = [
  { id: 1, name: "Арена новичков", minLevel: 1, description: "Битвы до 5 уровня.", rewardToken: 1, cooldownHours: 6 },
  { id: 2, name: "Сектор войны", minLevel: 10, description: "Сражения за ресурсные сектора.", rewardToken: 3, cooldownHours: 12 },
  { id: 3, name: "Зона хаоса", minLevel: 25, description: "Постоянная PvP-зона с высокими ставками.", rewardToken: 8, cooldownHours: 24 },
  { id: 4, name: "Галактический турнир", minLevel: 40, description: "Еженедельный турнир с эксклюзивными наградами.", rewardToken: 20, cooldownHours: 168 },
];

// ─── ФОРМУЛЫ РАСЧЕТА ───

export function calculateStarStats(
  baseAttack: number,
  baseDefense: number,
  baseHp: number,
  level: number,
  rarityMultiplier: number,
): StarStats {
  const levelFactor = 1 + (level - 1) * 0.12;

  return {
    level,
    experience: 0,
    experienceToNext: Math.round(100 * Math.pow(1.15, level - 1)),
    attack: Math.round(baseAttack * levelFactor * rarityMultiplier),
    defense: Math.round(baseDefense * levelFactor * rarityMultiplier),
    speed: Math.round(50 * levelFactor * rarityMultiplier),
    hp: Math.round(baseHp * levelFactor * rarityMultiplier),
    maxHp: Math.round(baseHp * levelFactor * rarityMultiplier),
    miningPower: Math.round(10 * levelFactor * rarityMultiplier),
    miningSpeed: Math.round(5 * levelFactor * rarityMultiplier),
    cargoCapacity: Math.round(100 * levelFactor * rarityMultiplier),
    scanRange: Math.round(20 * levelFactor * rarityMultiplier),
    discoveryChance: 0.01 * level * rarityMultiplier,
    energy: 100,
    maxEnergy: Math.round(100 * rarityMultiplier),
    energyRegenPerHour: Math.round(10 * rarityMultiplier),
  };
}

export function calculateMiningYield(
  miningPower: number,
  miningSpeed: number,
  durationHours: number,
): Partial<Record<ResourceType, number>> {
  const cycles = durationHours * miningSpeed;
  const baseDust = Math.round(miningPower * cycles * 0.1);
  const baseCrystals = Math.round(miningPower * cycles * 0.02);
  const shardChance = 0.05 * miningPower * cycles;

  const rewards: Partial<Record<ResourceType, number>> = {
    star_dust: baseDust,
    energy_crystal: baseCrystals,
  };

  if (Math.random() < Math.min(shardChance / 100, 1)) {
    rewards.data_shard = Math.round(shardChance * 0.1) + 1;
  }

  return rewards;
}

export function calculateBattleOutcome(
  attacker: StarStats,
  defender: StarStats,
): { attackerWins: boolean; attackerHpRemaining: number; defenderHpRemaining: number } {
  const attackPower = attacker.attack * (1 + attacker.speed / (attacker.speed + defender.speed));
  const defensePower = defender.defense * (1 + defender.speed / (attacker.speed + defender.speed));

  const damageToDefender = Math.max(1, attackPower - defensePower * 0.3);
  const damageToAttacker = Math.max(1, defensePower - attackPower * 0.3);

  const defenderHpRemaining = Math.max(0, defender.maxHp - damageToDefender);
  const attackerHpRemaining = Math.max(0, attacker.maxHp - damageToAttacker);

  return {
    attackerWins: defenderHpRemaining <= attackerHpRemaining,
    attackerHpRemaining,
    defenderHpRemaining,
  };
}
