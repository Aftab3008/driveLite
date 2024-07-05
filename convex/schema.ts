import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const roles = v.union(v.literal("admin"), v.literal("member"));

export default defineSchema({
  files: defineTable({
    name: v.string(),
    fileId: v.id("_storage"),
    type: v.string(),
    orgId: v.string(),
    fileUrl: v.string(),
    isFav: v.boolean(),
  }).index("by_orgId", ["orgId"]),

  users: defineTable({
    clerkId: v.string(),
    name: v.optional(v.string()),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    orgIds: v.array(
      v.object({
        orgId: v.string(),
        role: roles,
      })
    ),
  }).index("by_clerkId", ["clerkId"]),

  favourites: defineTable({
    fileId: v.id("files"),
    orgId: v.string(),
    userId: v.id("users"),
  }).index("by_userId_orgId_fileId", ["userId", "orgId", "fileId"]),
});
