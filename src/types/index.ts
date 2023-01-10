import type { NextPage } from "next";

// eslint-disable-next-line @typescript-eslint/ban-types
export type AppPage<P = {}, IP = P> = NextPage<P, IP> & {
  /**
   * If `false`, doesn't use the `Container`
   */
  noContainer?: boolean;
};
