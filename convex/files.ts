import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserByClerkId } from "./users";

async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  clerkId: string,
  orgId: string
) {
  const user = await getUserByClerkId(ctx, clerkId);
  const hasAccess =
    user?.orgIds.some((item) => item.orgId === orgId) ||
    user?.clerkId === orgId;
  return hasAccess;
}

export const createFile = mutation({
  args: {
    name: v.string(),
    fileId: v.id("_storage"),
    orgId: v.string(),
    type: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const hasAccess = await hasAccessToOrg(ctx, identity.subject, args.orgId);
    if (!hasAccess) {
      throw new Error("You are not authorized to perform this action");
    }
    const id = await ctx.db.insert("files", {
      name: args.name,
      fileId: args.fileId,
      orgId: args.orgId,
      type: args.type,
    });
    return id;
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const hasAccess = await hasAccessToOrg(ctx, identity.subject, args.orgId);
    if (!hasAccess) {
      return [];
    }
    return ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized");
  }
  return await ctx.storage.generateUploadUrl();
});

export const deleteById = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.delete(args.storageId);
  },
});

export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }
    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new ConvexError("File does not exist");
    }
    const hasAccess = await hasAccessToOrg(ctx, identity.subject, file.orgId);
    if (!hasAccess) {
      throw new ConvexError("You are not authorized to delete this file");
    }
    await deleteById(ctx, { storageId: file.fileId });
    return await ctx.db.delete(args.fileId);
  },
});

export const getFileUrl = query({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    if (!file) {
      return null;
    }
    return await ctx.storage.getUrl(file.fileId);
  },
});
