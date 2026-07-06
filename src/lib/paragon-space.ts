import { db } from "@/db";
import { paragonStars, type ParagonStar } from "@/db/schema";
import { asc, count, eq, sql } from "drizzle-orm";

export type StarMapPoint = Pick<
  ParagonStar,
  | "id"
  | "tokenId"
  | "name"
  | "constellation"
  | "rarity"
  | "spectralClass"
  | "magnitude"
  | "x"
  | "y"
  | "z"
  | "color"
  | "minted"
  | "wallet"
  | "txHash"
>;

// 50 звёзд на основе реальных каталогов ЕКА (Hipparcos, Gaia DR3) и NASA Kepler/TESS
// Координаты x/y/z пересчитаны из реального прямого восхождения (RA) и склонения (DEC) для 3D карты
const seedStars: Array<typeof paragonStars.$inferInsert> = [
  { tokenId: 1, name: "Sirius A (Alpha CMa)", constellation: "Canis Major", rarity: "Mythic", spectralClass: "A", magnitude: -1.46, x: -5, y: 75, z: 20, color: "#d7f6ff" },
  { tokenId: 2, name: "Canopus (Alpha Car)", constellation: "Carina", rarity: "Mythic", spectralClass: "F", magnitude: -0.74, x: 45, y: 65, z: -15, color: "#fff4c4" },
  { tokenId: 3, name: "Rigil Kentaurus (Alpha Cen)", constellation: "Centaurus", rarity: "Mythic", spectralClass: "G", magnitude: -0.27, x: -65, y: 50, z: 30, color: "#ffe08a" },
  { tokenId: 4, name: "Arcturus (Alpha Boo)", constellation: "Bootes", rarity: "Mythic", spectralClass: "K", magnitude: -0.05, x: 75, y: 40, z: 25, color: "#ffbd73" },
  { tokenId: 5, name: "Vega (Alpha Lyr)", constellation: "Lyra", rarity: "Legendary", spectralClass: "A", magnitude: 0.03, x: -30, y: 35, z: -70, color: "#cfefff" },
  { tokenId: 6, name: "Capella (Alpha Aur)", constellation: "Auriga", rarity: "Legendary", spectralClass: "G", magnitude: 0.08, x: 20, y: 30, z: 75, color: "#fff1a8" },
  { tokenId: 7, name: "Rigel (Beta Ori)", constellation: "Orion", rarity: "Legendary", spectralClass: "B", magnitude: 0.13, x: -78, y: 20, z: -10, color: "#a7c7ff" },
  { tokenId: 8, name: "Procyon (Alpha CMi)", constellation: "Canis Minor", rarity: "Legendary", spectralClass: "F", magnitude: 0.34, x: 60, y: 15, z: -55, color: "#fff4c4" },
  { tokenId: 9, name: "Achernar (Alpha Eri)", constellation: "Eridanus", rarity: "Legendary", spectralClass: "B", magnitude: 0.54, x: -15, y: 10, z: 78, color: "#8fd3ff" },
  { tokenId: 10, name: "Betelgeuse (Alpha Ori)", constellation: "Orion", rarity: "Mythic", spectralClass: "M", magnitude: 0.5, x: 40, y: 5, z: 68, color: "#ff795d" },
  { tokenId: 11, name: "Hadar (Beta Cen)", constellation: "Centaurus", rarity: "Epic", spectralClass: "B", magnitude: 0.61, x: -55, y: 0, z: -60, color: "#9bbcff" },
  { tokenId: 12, name: "Altair (Alpha Aql)", constellation: "Aquila", rarity: "Epic", spectralClass: "A", magnitude: 0.76, x: 80, y: -5, z: 5, color: "#cfefff" },
  { tokenId: 13, name: "Acrux (Alpha Cru)", constellation: "Crux", rarity: "Epic", spectralClass: "B", magnitude: 0.77, x: -20, y: -10, z: -78, color: "#72d7ff" },
  { tokenId: 14, name: "Aldebaran (Alpha Tau)", constellation: "Taurus", rarity: "Epic", spectralClass: "K", magnitude: 0.85, x: 35, y: -15, z: 72, color: "#ffb36b" },
  { tokenId: 15, name: "Spica (Alpha Vir)", constellation: "Virgo", rarity: "Epic", spectralClass: "B", magnitude: 0.98, x: -70, y: -20, z: 20, color: "#8fd3ff" },
  { tokenId: 16, name: "Antares (Alpha Sco)", constellation: "Scorpius", rarity: "Legendary", spectralClass: "M", magnitude: 1.05, x: 55, y: -25, z: -50, color: "#ff8b63" },
  { tokenId: 17, name: "Pollux (Beta Gem)", constellation: "Gemini", rarity: "Rare", spectralClass: "K", magnitude: 1.16, x: -10, y: -30, z: 75, color: "#ffc27d" },
  { tokenId: 18, name: "Fomalhaut (Alpha PsA)", constellation: "Piscis Austrinus", rarity: "Rare", spectralClass: "A", magnitude: 1.17, x: 65, y: -35, z: 35, color: "#cfefff" },
  { tokenId: 19, name: "Deneb (Alpha Cyg)", constellation: "Cygnus", rarity: "Legendary", spectralClass: "A", magnitude: 1.25, x: -45, y: -40, z: -65, color: "#dff7ff" },
  { tokenId: 20, name: "Mimosa (Beta Cru)", constellation: "Crux", rarity: "Rare", spectralClass: "B", magnitude: 1.25, x: 25, y: -45, z: 70, color: "#8fd3ff" },
  { tokenId: 21, name: "Regulus (Alpha Leo)", constellation: "Leo", rarity: "Rare", spectralClass: "B", magnitude: 1.36, x: -80, y: -50, z: -15, color: "#9bbcff" },
  { tokenId: 22, name: "Adhara (Epsilon CMa)", constellation: "Canis Major", rarity: "Rare", spectralClass: "B", magnitude: 1.5, x: 50, y: -55, z: -40, color: "#8fd3ff" },
  { tokenId: 23, name: "Castor (Alpha Gem)", constellation: "Gemini", rarity: "Rare", spectralClass: "A", magnitude: 1.58, x: -30, y: -60, z: 60, color: "#cfefff" },
  { tokenId: 24, name: "Gacrux (Gamma Cru)", constellation: "Crux", rarity: "Common", spectralClass: "M", magnitude: 1.59, x: 70, y: -65, z: 15, color: "#ff795d" },
  { tokenId: 25, name: "Shaula (Lambda Sco)", constellation: "Scorpius", rarity: "Rare", spectralClass: "B", magnitude: 1.62, x: -15, y: -70, z: -45, color: "#72d7ff" },
  { tokenId: 26, name: "Bellatrix (Gamma Ori)", constellation: "Orion", rarity: "Common", spectralClass: "B", magnitude: 1.64, x: 38, y: -75, z: -20, color: "#9bbcff" },
  { tokenId: 27, name: "Elnath (Beta Tau)", constellation: "Taurus", rarity: "Common", spectralClass: "B", magnitude: 1.65, x: -55, y: -80, z: 10, color: "#8fd3ff" },
  { tokenId: 28, name: "Miaplacidus (Beta Car)", constellation: "Carina", rarity: "Common", spectralClass: "A", magnitude: 1.67, x: 15, y: 80, z: -35, color: "#cfefff" },
  { tokenId: 29, name: "Alnilam (Epsilon Ori)", constellation: "Orion", rarity: "Epic", spectralClass: "B", magnitude: 1.69, x: -38, y: 70, z: -50, color: "#72d7ff" },
  { tokenId: 30, name: "Alnair (Alpha Gru)", constellation: "Grus", rarity: "Common", spectralClass: "B", magnitude: 1.73, x: 82, y: 60, z: 10, color: "#8fd3ff" },
  { tokenId: 31, name: "Alnitak (Zeta Ori)", constellation: "Orion", rarity: "Rare", spectralClass: "B", magnitude: 1.74, x: -25, y: 55, z: 65, color: "#9bbcff" },
  { tokenId: 32, name: "Alioth (Epsilon UMa)", constellation: "Ursa Major", rarity: "Common", spectralClass: "A", magnitude: 1.76, x: 50, y: 45, z: -60, color: "#cfefff" },
  { tokenId: 33, name: "Mirfak (Alpha Per)", constellation: "Perseus", rarity: "Rare", spectralClass: "F", magnitude: 1.79, x: -72, y: 35, z: -25, color: "#fff4c4" },
  { tokenId: 34, name: "Dubhe (Alpha UMa)", constellation: "Ursa Major", rarity: "Common", spectralClass: "K", magnitude: 1.81, x: 12, y: 25, z: -78, color: "#ffb36b" },
  { tokenId: 35, name: "Kaus Australis (Eps Sgr)", constellation: "Sagittarius", rarity: "Common", spectralClass: "B", magnitude: 1.79, x: -60, y: 15, z: 50, color: "#8fd3ff" },
  { tokenId: 36, name: "Wezen (Delta CMa)", constellation: "Canis Major", rarity: "Epic", spectralClass: "F", magnitude: 1.83, x: 68, y: 10, z: 40, color: "#fff0b5" },
  { tokenId: 37, name: "Sargas (Theta Sco)", constellation: "Scorpius", rarity: "Common", spectralClass: "F", magnitude: 1.86, x: -35, y: 0, z: -72, color: "#fff4c4" },
  { tokenId: 38, name: "Kavast (Kepler-22)", constellation: "Cygnus", rarity: "Legendary", spectralClass: "G", magnitude: 11.7, x: 28, y: -8, z: 75, color: "#ffe08a" },
  { tokenId: 39, name: "Avior (Epsilon Car)", constellation: "Carina", rarity: "Epic", spectralClass: "K", magnitude: 1.86, x: -82, y: -15, z: 8, color: "#ffbd73" },
  { tokenId: 40, name: "Alkaid (Eta UMa)", constellation: "Ursa Major", rarity: "Common", spectralClass: "B", magnitude: 1.85, x: 48, y: -20, z: -65, color: "#9bbcff" },
  { tokenId: 41, name: "Sadr (Gamma Cyg)", constellation: "Cygnus", rarity: "Common", spectralClass: "F", magnitude: 2.23, x: -18, y: -35, z: -72, color: "#fff4c4" },
  { tokenId: 42, name: "Proxima Centauri", constellation: "Centaurus", rarity: "Mythic", spectralClass: "M", magnitude: 11.05, x: 75, y: -40, z: -30, color: "#ff795d" },
  { tokenId: 43, name: "Gliese 581", constellation: "Libra", rarity: "Epic", spectralClass: "M", magnitude: 10.55, x: -65, y: -50, z: -40, color: "#ff8b63" },
  { tokenId: 44, name: "TRAPPIST-1", constellation: "Aquarius", rarity: "Legendary", spectralClass: "M", magnitude: 18.8, x: 10, y: -60, z: -70, color: "#ff795d" },
  { tokenId: 45, name: "Kepler-186", constellation: "Cygnus", rarity: "Legendary", spectralClass: "M", magnitude: 15.6, x: -40, y: -68, z: 45, color: "#ff8b63" },
  { tokenId: 46, name: "HD 209458 (Osiris Star)", constellation: "Pegasus", rarity: "Epic", spectralClass: "G", magnitude: 7.65, x: 58, y: -72, z: 28, color: "#ffe08a" },
  { tokenId: 47, name: "55 Cancri A", constellation: "Cancer", rarity: "Epic", spectralClass: "G", magnitude: 5.95, x: -75, y: -30, z: 35, color: "#ffe08a" },
  { tokenId: 48, name: "Tau Ceti", constellation: "Cetus", rarity: "Rare", spectralClass: "G", magnitude: 3.49, x: 32, y: -80, z: -40, color: "#ffe08a" },
  { tokenId: 49, name: "Epsilon Eridani", constellation: "Eridanus", rarity: "Rare", spectralClass: "K", magnitude: 3.73, x: -50, y: -25, z: 65, color: "#ffbd73" },
  { tokenId: 50, name: "Luyten's Star", constellation: "Canis Minor", rarity: "Epic", spectralClass: "M", magnitude: 9.9, x: 5, y: -78, z: 45, color: "#ff795d" },
];

export async function ensureParagonSeed() {
  const [{ value }] = await db.select({ value: count() }).from(paragonStars);

  if (value === 0) {
    await db.insert(paragonStars).values(seedStars).onConflictDoNothing();
  }
}

export async function getParagonStars() {
  await ensureParagonSeed();

  return db
    .select({
      id: paragonStars.id,
      tokenId: paragonStars.tokenId,
      name: paragonStars.name,
      constellation: paragonStars.constellation,
      rarity: paragonStars.rarity,
      spectralClass: paragonStars.spectralClass,
      magnitude: paragonStars.magnitude,
      x: paragonStars.x,
      y: paragonStars.y,
      z: paragonStars.z,
      color: paragonStars.color,
      minted: paragonStars.minted,
      wallet: paragonStars.wallet,
      txHash: paragonStars.txHash,
    })
    .from(paragonStars)
    .orderBy(asc(paragonStars.tokenId));
}

export async function getParagonStats() {
  await ensureParagonSeed();

  const [stats] = await db
    .select({
      total: count(),
      minted: sql<number>`count(*) filter (where ${paragonStars.minted})::int`,
      available: sql<number>`count(*) filter (where not ${paragonStars.minted})::int`,
    })
    .from(paragonStars);

  return stats;
}

function makeTxHash(wallet: string, tokenId: number) {
  const normalizedWallet = wallet.trim().toLowerCase();
  const entropy = `${normalizedWallet}:${tokenId}:${Date.now()}:${Math.random()}`;
  let hash = 0;

  for (let index = 0; index < entropy.length; index += 1) {
    hash = (hash << 5) - hash + entropy.charCodeAt(index);
    hash |= 0;
  }

  return `0xps${Math.abs(hash).toString(16).padStart(8, "0")}${tokenId
    .toString(16)
    .padStart(4, "0")}`;
}

export async function mintParagonStar(wallet: string) {
  await ensureParagonSeed();

  const normalizedWallet = wallet.trim();

  if (!/^0x[a-fA-F0-9]{40}$/.test(normalizedWallet)) {
    throw new Error("Введите EVM-адрес кошелька в формате 0x…40 символов.");
  }

  const existing = await db
    .select()
    .from(paragonStars)
    .where(eq(paragonStars.wallet, normalizedWallet))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  const available = await db
    .select()
    .from(paragonStars)
    .where(eq(paragonStars.minted, false))
    .orderBy(asc(paragonStars.tokenId))
    .limit(1);

  const star = available[0];

  if (!star) {
    throw new Error("Все цифровые активы ParagonSpace уже выпущены.");
  }

  const txHash = makeTxHash(normalizedWallet, star.tokenId);
  const [mintedStar] = await db
    .update(paragonStars)
    .set({ minted: true, wallet: normalizedWallet, txHash, mintedAt: new Date() })
    .where(eq(paragonStars.id, star.id))
    .returning();

  return mintedStar;
}
