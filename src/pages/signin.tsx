import { useEffect } from "react";
import type {
  InferGetServerSidePropsType,
  GetServerSideProps,
  NextPage,
} from "next";
import Head from "next/head";
import { unstable_getServerSession } from "next-auth";
import { getProviders, signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { authOptions } from "pages/api/auth/[...nextauth]";

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

const SignInPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ providers, errorType, callbackUrl }) => {
  const error = errorType && (errors[errorType] ?? errors.default);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        id: "signInError",
        duration: Infinity,
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
      <main className="flex flex-grow items-center justify-center">
        <div className="rounded-box flex flex-col items-center gap-3 border-2 border-primary p-8">
          <span>Sign in with</span>
          <div className="grid grid-cols-2 gap-2">
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  key={provider.name}
                  type="button"
                  onClick={() => signIn(provider.id, { callbackUrl })}
                  className="btn-outline btn gap-2"
                >
                  Sign in with {provider.name}
                  {/* src="https://authjs.dev/img/providers/discord-dark.svg" */}
                </button>
              ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default SignInPage;

export const getServerSideProps = (async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

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

  const callbackUrl =
    (context.query.callbackUrl as string | undefined) ?? "/welcome";

  return {
    props: {
      session: null,
      providers,
      errorType,
      callbackUrl,
    },
  };
}) satisfies GetServerSideProps;
