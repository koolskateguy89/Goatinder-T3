/* eslint-disable import/first */
/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API
 *
 * These allow you to access things like the database, the session, etc, when
 * processing a request
 *
 */
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";

import { getServerAuthSession } from "server/auth";
import { prisma } from "server/db";

type CreateContextOptions = {
  session: Session | null;
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here
 *
 * Examples of things you may need it for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createInnerTRPCContext = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return await createInnerTRPCContext({
    session,
  });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
    transformer: superjson,
    errorFormatter({ shape }) {
      return shape;
    },
  });

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure;

/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Protected (authed) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use
 * this. It verifies the session is valid and guarantees ctx.session.user is not
 * null
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

/**
 * Reusable middleware that enforces users are the group chat's creator before running the
 * procedure.
 *
 * Though it increases the number of database queries, it's better to do this in middleware
 * than in the procedure. And it's likely the proecdure will make this same query anyway.
 *
 * TODO: try and enforce input type - not sure if possible
 */
const enforceUserIsCreator = enforceUserIsAuthed.unstable_pipe(
  async ({ ctx, next, rawInput }) => {
    const { id } = rawInput as { id: string };
    const userId = ctx.session.user.id;

    const groupChat = await ctx.prisma.groupChat.findUnique({
      where: {
        id,
      },
      select: {
        creatorId: true,
      },
    });

    if (!groupChat) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    if (groupChat.creatorId !== userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not the creator of this group chat",
      });
    }

    return next();
  },
);

/**
 * Group creator (authenticated) procedure
 *
 * If you want a procedure to ONLY be accessible to group chat creator, use this. It verifies
 * the user is the creator of the group chat.
 *
 * @note group chat ID has to be passed in as `id` in the input
 * @see https://trpc.io/docs/procedures
 */
export const groupChatCreatorProcedure = t.procedure.use(enforceUserIsCreator);

/**
 * Reusable middleware that enforces users have access to the group chat before running the procedure.
 * Specifically, they must be a member or the creator of the group chat.
 *
 * TODO: try and enforce input type - not sure if possible
 */
const enforceUserHasAccessToGroupChat = enforceUserIsAuthed.unstable_pipe(
  async ({ ctx, next, rawInput }) => {
    const { id } = rawInput as { id: string };
    const userId = ctx.session.user.id;

    const groupChat = await ctx.prisma.groupChat.findUnique({
      where: {
        id,
      },
      select: {
        creatorId: true,
        members: {
          select: {
            id: true,
          },
          where: {
            id: userId,
          },
        },
      },
    });

    if (!groupChat) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    if (groupChat.creatorId !== userId && groupChat.members.length === 0) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You do not have access to this group chat",
      });
    }

    return next();
  },
);

/**
 * Group member/creator (authenticated) procedure
 *
 * If you want a procedure to ONLY be accessible to people with access to a group chat, use this.
 * It verifies the user is has access to the group chat (creator/member).
 *
 * @note group chat ID has to be passed in as `id` in the input
 * @see https://trpc.io/docs/procedures
 */
export const groupChatProcedure = t.procedure.use(
  enforceUserHasAccessToGroupChat,
);
