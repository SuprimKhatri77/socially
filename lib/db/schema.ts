import {
  InferInsertModel,
  InferSelectModel,
  relations,
  sql,
} from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";

export const friendRequestStatusEnum = pgEnum("friendRequestStatus", [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const friendshipTable = pgTable(
  "friendship",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    friendId: text("friend_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    status: friendRequestStatusEnum("friendRequestStatus")
      .default("PENDING")
      .notNull(),
    created_at: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    uniqueFriendship: unique().on(table.userId, table.friendId),
    noSelfFriendship: {
      check: sql`user_id <> friend_id`,
    },
  })
);

export const postTable = pgTable("post", {
  id: uuid("id").primaryKey().notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),

  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const likeTable = pgTable(
  "like",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    postId: uuid("post_id")
      .references(() => postTable.id, { onDelete: "cascade" })
      .notNull(),
    created_at: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    uniqueLike: unique().on(table.userId, table.postId),
  })
);

export const commentTable = pgTable("comment", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  postId: uuid("post_id")
    .references(() => postTable.id, { onDelete: "cascade" })
    .notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const userRelation = relations(user, ({ many }) => ({
  postTable: many(postTable),
}));

export const postRelation = relations(postTable, ({ one, many }) => ({
  user: one(user, {
    fields: [postTable.userId],
    references: [user.id],
  }),
  likeTable: many(likeTable),
  commentTable: many(commentTable),
}));

export const likeRelation = relations(likeTable, ({ one }) => ({
  postTable: one(postTable, {
    fields: [likeTable.postId],
    references: [postTable.id],
  }),
}));

export const commentRelation = relations(commentTable, ({ one }) => ({
  postTable: one(postTable, {
    fields: [commentTable.postId],
    references: [postTable.id],
  }),
}));

// type exports
export type userSelectType = InferSelectModel<typeof user>;
export type userInserType = InferInsertModel<typeof user>;

export type postSelectType = InferSelectModel<typeof postTable>;
export type postInsertType = InferInsertModel<typeof postTable>;
