import { ConvexError, v } from "convex/values";
import { internalMutation, MutationCtx, QueryCtx } from "./_generated/server";
import { roles } from "./schema";

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert("users", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      imageUrl: args.imageUrl,
      orgIds: [],
    });
  },
});

export const updateUser = internalMutation({
  args: {
    clerkId: v.string(),
    imageUrl: v.string(),
    email: v.string(),
    name: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      imageUrl: args.imageUrl,
      email: args.email,
      name: args.name,
    });
  },
});

export const addOrgIdToUser = internalMutation({
  args: {
    clerkId: v.string(),
    orgId: v.string(),
    role: roles,
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      orgIds: [...user.orgIds, { orgId: args.orgId, role: args.role }],
    });
  },
});

export const UpdateOrgIdToUser = internalMutation({
  args: {
    clerkId: v.string(),
    orgId: v.string(),
    role: roles,
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const orgIds = user.orgIds.map((item) =>
      item.orgId === args.orgId ? { orgId: args.orgId, role: args.role } : item
    );

    await ctx.db.patch(user._id, {
      orgIds,
    });
  },
});

export const DeleteUserFromOrg = internalMutation({
  args: {
    clerkId: v.string(),
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const orgIds = user.orgIds.filter((item) => item.orgId !== args.orgId);

    await ctx.db.patch(user._id, {
      orgIds,
    });
  },
});

export async function getUserByClerkId(
  ctx: QueryCtx | MutationCtx,
  clerkId: string
) {
  const user = ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
    .first();
  if (!user) {
    throw new ConvexError("User not defined");
  }
  return user;
}
