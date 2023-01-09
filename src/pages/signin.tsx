import type {
  InferGetServerSidePropsType,
  GetServerSideProps,
  NextPage,
} from "next";
import Head from "next/head";
import { getProviders, signIn } from "next-auth/react";

const SignInPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ providers }) => {
  return (
    <>
      <Head>
        <title>Sign in to goaTinder</title>
      </Head>
      <div className="flex items-center justify-center">
        <div className="rounded-box flex flex-col items-center gap-3 border-2 border-red-300 p-8">
          <span>Sign in with</span>
          <div className="grid grid-cols-2 gap-2">
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  key={provider.name}
                  type="button"
                  onClick={() =>
                    signIn(provider.id, { callbackUrl: "/welcome" })
                  }
                  className="btn-outline btn gap-2"
                >
                  Sign in with {provider.name}
                  {/* src="https://authjs.dev/img/providers/discord-dark.svg" */}
                </button>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInPage;

export const getServerSideProps = (async () => {
  const providers = await getProviders();

  providers!.apple = {
    id: "",
    callbackUrl: "",
    name: "aplpe",
    signinUrl: "",
    type: "credentials",
  };

  providers!.google = {
    id: "",
    callbackUrl: "",
    name: "gogole",
    signinUrl: "",
    type: "credentials",
  };

  return {
    props: {
      providers,
    },
  };
}) satisfies GetServerSideProps;
