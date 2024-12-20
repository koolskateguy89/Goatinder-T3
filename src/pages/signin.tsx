import { useEffect } from "react";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { getProviders, signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { FaDiscord, FaGithub } from "react-icons/fa";

import { authOptions } from "pages/api/auth/[...nextauth]";
import type { AppPage } from "types";
import Brand from "components/Brand";

/**
 * The following errors are passed as error query parameters to the default or overridden sign-in page.
 *
 * [Documentation](https://next-auth.js.org/configuration/pages#sign-in-page)
 * @see https://github.com/nextauthjs/next-auth/blob/c05951f0f958fef3a57c521218c7437afa308c97/packages/next-auth/src/core/pages/signin.tsx
 */
type SignInErrorTypes =
  | "Signin"
  | "OAuthSignin"
  | "OAuthCallback"
  | "OAuthCreateAccount"
  | "EmailCreateAccount"
  | "Callback"
  | "OAuthAccountNotLinked"
  | "EmailSignin"
  | "CredentialsSignin"
  | "SessionRequired"
  | "default";

/**
 * @see https://github.com/nextauthjs/next-auth/blob/c05951f0f958fef3a57c521218c7437afa308c97/packages/next-auth/src/core/pages/signin.tsx
 */
const errors: Record<SignInErrorTypes, string> = {
  Signin: "Try signing in with a different account.",
  OAuthSignin: "Try signing in with a different account.",
  OAuthCallback: "Try signing in with a different account.",
  OAuthCreateAccount: "Try signing in with a different account.",
  EmailCreateAccount: "Try signing in with a different account.",
  Callback: "Try signing in with a different account.",
  OAuthAccountNotLinked:
    "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "The e-mail could not be sent.",
  CredentialsSignin:
    "Sign in failed. Check the details you provided are correct.",
  SessionRequired: "Please sign in to access this page.",
  default: "Unable to sign in.",
};

const icons: Record<string, JSX.Element> = {
  discord: <FaDiscord />,
  github: <FaGithub />,
};

/**
 * @see https://next-auth.js.org/configuration/pages#sign-in-page
 */
const SignInPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ providers, errorType, callbackUrl }) => {
  const error = errorType && (errors[errorType] ?? errors.default);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        id: "signInError",
        // duration: Infinity,
      });
    }
    return () => {
      toast.dismiss("signInError");
    };
  }, [error]);

  return (
    <>
      <Head>
        <title>Sign in to goaTinder</title>
      </Head>
      <main className="flex h-dvh flex-col items-center justify-center gap-y-8">
        <Link
          href="/"
          className="btn btn-ghost text-3xl normal-case md:btn-lg md:-mt-10 md:!text-4xl"
        >
          <Brand />
        </Link>

        <section className="flex w-full flex-col items-center gap-3 border-y-2 border-primary py-8 sm:rounded-box dark:bg-base-200 sm:mx-auto sm:max-w-md sm:border-2 sm:border-x-2 sm:px-8">
          <h1 className="text-sm">Sign in with</h1>
          <div className="grid w-full grid-cols-2 gap-3 max-sm:px-6">
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  key={provider.name}
                  type="button"
                  onClick={() => signIn(provider.id, { callbackUrl })}
                  // gradient border effect: https://www.youtube.com/shorts/qzZ0iQKoUQ0
                  className="btn btn-outline relative text-base normal-case before:absolute before:-inset-[1px] before:bg-gradient-to-br before:from-primary/40 before:via-transparent before:to-primary/40 before:opacity-0 before:[border-radius:inherit] hover:before:opacity-100 dark:hover:bg-white/5 dark:hover:text-base-content"
                >
                  <div className="absolute inset-[1px] flex items-center justify-center gap-3 bg-inherit [border-radius:inherit]">
                    {icons[provider.id] && (
                      <span className="text-2xl">{icons[provider.id]}</span>
                    )}
                    {provider.name}
                  </div>
                </button>
              ))}
          </div>
        </section>
      </main>
    </>
  );
};

SignInPage.noLayout = true;

export default SignInPage;

export const getServerSideProps = (async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const providers = await getProviders();

  const errorType =
    (context.query.error as SignInErrorTypes | undefined) ?? null;

  // /welcome will handle redirecting to the callbackUrl
  const callbackUrl = `/welcome${
    context.query.callbackUrl
      ? `?callbackUrl=${encodeURIComponent(
          context.query.callbackUrl as string,
        )}`
      : ""
  }`;

  return {
    props: {
      session: null,
      providers,
      errorType,
      callbackUrl,
    },
  };
}) satisfies GetServerSideProps;
