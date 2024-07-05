import {
  internalMutation,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { Id } from "./_generated/dataModel";

async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  clerkId: string,
  orgId: string
) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
    .first();
  if (!user) {
    throw new ConvexError("User does not exist");
  }
  const hasAccess =
    user?.orgIds.some((item) => item.orgId === orgId) ||
    user?.clerkId === orgId;
  return { hasAccess, user };
}

export const createFile = mutation({
  args: {
    name: v.string(),
    fileId: v.id("_storage"),
    orgId: v.string(),
    type: v.string(),
    fileUrl: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const { hasAccess, user } = await hasAccessToOrg(
      ctx,
      identity.subject,
      args.orgId
    );
    if (!hasAccess) {
      throw new Error("You are not authorized to perform this action");
    }
    const id = await ctx.db.insert("files", {
      name: args.name,
      fileId: args.fileId,
      orgId: args.orgId,
      userId: user._id,
      type: args.type,
      fileUrl: args.fileUrl,
      isFav: false,
      isDelete: false,
    });
    return id;
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
    favourites: v.optional(v.boolean()),
    delete: v.optional(v.boolean()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const { hasAccess } = await hasAccessToOrg(
      ctx,
      identity.subject,
      args.orgId
    );
    if (!hasAccess) {
      return [];
    }
    let files;
    if (args.favourites) {
      files = await ctx.db
        .query("files")
        .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
        .filter((q) => q.eq(q.field("isFav"), true))
        .filter((q) => q.eq(q.field("isDelete"), false))
        .collect();
    } else if (args.delete) {
      files = await ctx.db
        .query("files")
        .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
        .filter((q) => q.eq(q.field("isDelete"), true))
        .collect();
    } else {
      files = await ctx.db
        .query("files")
        .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
        .filter((q) => q.eq(q.field("isDelete"), false))
        .collect();
    }
    const query = args.query;
    if (query) {
      return files.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    return files;
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
    const { hasAccess } = await hasAccessToOrg(
      ctx,
      identity.subject,
      file.orgId
    );
    if (!hasAccess) {
      throw new ConvexError("You are not authorized to delete this file");
    }
    await deleteById(ctx, { storageId: file.fileId });
    return await ctx.db.delete(args.fileId);
  },
});

export const getFileUrl = mutation({
  args: { fileId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.fileId);
  },
});

export const toggleFavourite = mutation({
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

    const { hasAccess } = await hasAccessToOrg(
      ctx,
      identity.subject,
      file.orgId
    );

    if (!hasAccess) {
      throw new ConvexError("You are not authorized to delete this file");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new ConvexError("User does not exist");
    }

    const favourite = await ctx.db
      .query("favourites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q.eq("userId", user._id).eq("orgId", file.orgId).eq("fileId", file._id)
      )
      .first();

    if (!favourite) {
      await ctx.db.insert("favourites", {
        fileId: file._id,
        orgId: file.orgId,
        userId: user._id,
      });
      await ctx.db.patch(file._id, { isFav: true });
    } else {
      await ctx.db.delete(favourite._id);
      await ctx.db.patch(file._id, { isFav: false });
    }
  },
});

async function hasAccessToFile(
  ctx: QueryCtx | MutationCtx,
  fileId: Id<"files">
) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Unauthorized");
  }
  const file = await ctx.db.get(fileId);
  if (!file) {
    throw new ConvexError("File does not exist");
  }
  const { hasAccess } = await hasAccessToOrg(ctx, identity.subject, file.orgId);
  if (!hasAccess) {
    throw new ConvexError("You are not authorized to delete this file");
  }
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
    .first();
  if (!user) {
    throw new ConvexError("User does not exist");
  }
  return user;
}

export const markAsDelete = mutation({
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

    const { hasAccess } = await hasAccessToOrg(
      ctx,
      identity.subject,
      file.orgId
    );

    if (!hasAccess) {
      throw new ConvexError("You are not authorized to delete this file");
    }
    await ctx.db.patch(args.fileId, { isDelete: true });
  },
});

export const restoreFile = mutation({
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

    const { hasAccess } = await hasAccessToOrg(
      ctx,
      identity.subject,
      file.orgId
    );

    if (!hasAccess) {
      throw new ConvexError("You are not authorized to delete this file");
    }

    await ctx.db.patch(args.fileId, { isDelete: false });
  },
});

export const deleteAllFilesByCrons = internalMutation({
  args: {},
  handler: async (ctx, args) => {
    const files = await ctx.db
      .query("files")
      .filter((q) => q.eq(q.field("isDelete"), true))
      .collect();
    await Promise.all(
      files.map(async (file) => {
        await ctx.storage.delete(file.fileId);
        await ctx.db.delete(file._id);
      })
    );
  },
});
