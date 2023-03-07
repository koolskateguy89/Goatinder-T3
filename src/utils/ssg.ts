import type { Session } from "next-auth";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";

import { appRouter } from "server/api/root";
import { createInnerTRPCContext } from "server/api/trpc";

/**
 *
 * @see https://trpc.io/docs/ssg-helpers
 */
export const createSSGHelpers = async (session: Session | null) =>
  createProxySSGHelpers({
    router: appRouter,
    ctx: await createInnerTRPCContext({ session }),
    transformer: superjson,
  });
