"use client";

import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";

const TestPage: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Welcome - GoaTinder</title>
      </Head>
      <div>TEST</div>
      <div>session: {JSON.stringify(session)}</div>
    </>
  );
};

export default TestPage;
