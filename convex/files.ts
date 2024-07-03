import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
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
    orgId: v.string(),
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
    await ctx.db.insert("files", {
      name: args.name,
      orgId: args.orgId,
    });
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
