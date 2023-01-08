import { type AppType } from "next/app";
import { Inter } from "@next/font/google";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import { api } from "utils/api";
import Container from "components/Container";

import "styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <div className={inter.className}>
      <SessionProvider session={session}>
        <ThemeProvider attribute="class">
          <Container>
            <Component {...pageProps} />
          </Container>
        </ThemeProvider>
      </SessionProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
