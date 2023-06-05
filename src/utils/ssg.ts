import type { Session } from "next-auth";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";

import { appRouter } from "server/api/root";
import { createInnerTRPCContext } from "server/api/trpc";

/**
 *
 * @see https://trpc.io/docs/ssg-helpers
 */
export const createSSGHelpers = async (session: Session | null) =>
  createServerSideHelpers({
    router: appRouter,
    ctx: await createInnerTRPCContext({ session }),
    transformer: superjson,
  });
