import type { AppProps } from "next/app";
import Head from "next/head";
import { Inter } from "@next/font/google";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster, ToastBar } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

import { api } from "utils/api";
import type { AppPage } from "types";
import Container from "components/Container";

import "styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

interface MyAppProps extends AppProps<{ session: Session | null }> {
  Component: AppProps["Component"] & AppPage;
}

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: MyAppProps) {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <ThemeProvider attribute="class">
          <div className={inter.className}>
            <Toaster>
              {(t) => (
                <span className="dark:[&>*]:!bg-base-200 dark:[&>*]:text-base-content">
                  <ToastBar style={t.style} toast={t} />
                </span>
              )}
            </Toaster>

            {Component.noContainer ? (
              <Component {...pageProps} />
            ) : (
              <Container>
                <Component {...pageProps} />
              </Container>
            )}
          </div>
        </ThemeProvider>
      </SessionProvider>
      <Analytics />
    </>
  );
}

export default api.withTRPC(MyApp);
