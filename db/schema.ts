import {
  bigint,
  boolean,
  pgTable,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const teams = pgTable("teams", {
  id: bigint("id", { mode: "number" }).generatedByDefaultAsIdentity().primaryKey(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  name: text("name"),
  description: text("description"),
  achievements: text("achievements"),
  specialty: text("specialty"),
  image: text("image"),
  isFeatured: boolean("isFeatured").default(false),
});

export const profiles = pgTable("profiles", {
  id: text("id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name"),
  phone: text("phone"),
  nationalId: text("nationalId"),
  avatarImage: text("avatarImage"),
  isGraduated: boolean("isGraduated").default(false),
  about: text("about"),
  specialization: text("specialization"),
  role: text("role"),
  team: bigint("team", { mode: "number" }).references(() => teams.id, {
    onDelete: "set null",
  }),
  skills: text("skills"),
});

export const projects = pgTable("projects", {
  id: bigint("id", { mode: "number" }).generatedByDefaultAsIdentity().primaryKey(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  title: text("title"),
  description: text("description"),
  image: text("image"),
  link: text("link"),
  period: text("period"),
  tags: text("tags").array(),
  teamId: bigint("teamId", { mode: "number" }).references(() => teams.id, {
    onDelete: "set null",
  }),
  isFeatured: boolean("isFeatured").default(false),
});
