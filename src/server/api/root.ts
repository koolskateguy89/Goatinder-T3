import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { shoesRouter } from "./routers/shoes";
import { commentsRouter } from "./routers/comments";
import { userRouter } from "./routers/user";
import { chatRouter } from "./routers/chat";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  shoes: shoesRouter,
  comments: commentsRouter,
  user: userRouter,
  chat: chatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
