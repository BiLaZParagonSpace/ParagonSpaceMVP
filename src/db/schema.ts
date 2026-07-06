import {
  boolean,
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const paragonStars = pgTable(
  "paragon_stars",
  {
    id: serial("id").primaryKey(),
    tokenId: integer("token_id").notNull(),
    name: text("name").notNull(),
    constellation: text("constellation").notNull(),
    rarity: text("rarity").notNull(),
    spectralClass: text("spectral_class").notNull(),
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
  },
  (table) => [uniqueIndex("paragon_stars_token_id_idx").on(table.tokenId)],
);

export type ParagonStar = typeof paragonStars.$inferSelect;
