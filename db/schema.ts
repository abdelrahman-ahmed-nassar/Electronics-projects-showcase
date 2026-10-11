import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  pgTable,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

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

export const user = pgTable(
  "user",
  {
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
    phone: text("phone"),
    nationalId: text("nationalId"),
    isGraduated: boolean("isGraduated").default(false).notNull(),
    about: text("about"),
    specialization: text("specialization"),
    role: text("role"),
    skills: text("skills"),
    teamId: bigint("teamId", { mode: "number" }).references(() => teams.id, {
      onDelete: "set null",
    }),
  },
  (table) => [index("user_teamId_idx").on(table.teamId)]
);

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

// --- DRIZZLE RELATIONS (Relational Query API) ---

export const userRelations = relations(user, ({ one, many }) => ({
  team: one(teams, {
    fields: [user.teamId],
    references: [teams.id],
  }),
  accounts: many(account),
  sessions: many(session),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  members: many(user),
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  team: one(teams, {
    fields: [projects.teamId],
    references: [teams.id],
  }),
}));
