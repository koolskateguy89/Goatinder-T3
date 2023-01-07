"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export interface AuthContextProps {
  children: React.ReactNode;
  session: Session | null;
}

// https://github.com/nextauthjs/next-auth/issues/5647#issuecomment-1291898265
export default function AuthContext({ children, session }: AuthContextProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
