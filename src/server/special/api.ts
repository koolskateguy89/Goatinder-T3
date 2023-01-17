/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  type AxiosRequestConfig,
  type Method as AxiosMethod,
} from "axios";
import type { Includes, IsEqual } from "type-fest";

type Method = Uppercase<AxiosMethod>;

export type ApiRoute<TInput, TResponse, TMethods extends Method[]> = {
  input: TInput;
  response: TResponse;
  methods: TMethods;
};

// tried to implement a type error helper similar to prisma
type Url<TMethod extends Method, TRoute> = TRoute extends ApiRoute<
  unknown,
  unknown,
  infer TMethods
>
  ? Includes<TMethods, TMethod> extends true
    ? string
    : `Route does not support ${TMethod} requests.`
  : `Route does not support ${TMethod} requests.`;

type ApiReturnType<TMethod extends Method, TRoute> = Promise<
  TRoute extends ApiRoute<unknown, infer TResponse, infer TMethods>
    ? Includes<TMethods, TMethod> extends true
      ? TResponse
      : never
    : never
>;

export default api;

/**
 * Wrapper around `axios` that enforces the types of the API routes.
 * Tried to implement similar functionality to tRPC./
 */
export const api = {
  async get<TRoute extends ApiRoute<unknown, unknown, any>>(
    url: Url<"GET", TRoute>,
    config?: AxiosRequestConfig
  ): ApiReturnType<"GET", TRoute> {
    const { data } = await axios.get<TRoute["response"]>(url, config);

    // @ts-expect-error We know this is the right type
    return data;
  },

  async post<TRoute extends ApiRoute<unknown, unknown, any>>(
    url: Url<"POST", TRoute>,
    input: TRoute["input"],
    config?: AxiosRequestConfig
  ): ApiReturnType<"POST", TRoute> {
    const { data } = await axios.post<TRoute["response"]>(url, input, config);

    // @ts-expect-error We know this is the right type
    return data;
  },

  async request() {
    throw new Error("Not implemented");
  },
};

/* eslint-disable @typescript-eslint/no-unused-vars */

// type helper to give an error if 2 types are not equal
function ExpectEqual<TExpected, TTest>(
  testValue: IsEqual<TExpected, TTest> extends true
    ? TTest
    : "Types do not match."
) {}

async function typeTest() {
  // helper type
  type AlwaysFails = ApiRoute<any, any, []>;

  // type Ok = Expect<number, string>;

  type GetTest = ApiRoute<
    never,
    {
      users: {
        name: string;
      }[];
    },
    ["GET"]
  >;

  type GetWithMultipleMethods = ApiRoute<
    never,
    {
      users: {
        id: number;
        name: string;
      }[];
    },
    ["GET", "OPTIONS"]
  >;

  const getShouldWork = await api.get<GetTest>("/api/test");
  ExpectEqual<GetTest["response"], typeof getShouldWork>(getShouldWork);

  const getWithMultipleMethodsShouldWork =
    await api.get<GetWithMultipleMethods>("/api/test");
  ExpectEqual<
    GetWithMultipleMethods["response"],
    typeof getWithMultipleMethodsShouldWork
  >(getWithMultipleMethodsShouldWork);

  // @ts-expect-error Invalid route method
  const getShouldFail = await api.get<AlwaysFails>("/api/test");

  type PostTest = ApiRoute<
    { size: number },
    {
      users: {
        name: string;
      }[];
    },
    ["POST"]
  >;

  type PostWithMultipleMethods = ApiRoute<
    { size: number },
    {
      users: {
        id: string;
        name: string;
      }[];
    },
    ["POST", "OPTIONS"]
  >;

  const postShouldWork = await api.post<PostTest>("/api/test", { size: 9 });
  ExpectEqual<PostTest["response"], typeof postShouldWork>(postShouldWork);

  const postWithMultipleMethodsShouldWork =
    await api.post<PostWithMultipleMethods>("/api/test", { size: 9 });
  ExpectEqual<
    PostWithMultipleMethods["response"],
    typeof postWithMultipleMethodsShouldWork
  >(postWithMultipleMethodsShouldWork);

  // @ts-expect-error Invalid route method
  const postShouldFail = await api.post<AlwaysFails>("/api/test", { size: 9 });

  type GetAndPost = ApiRoute<
    { name: string },
    {
      users: {
        name: string;
      }[];
    },
    ["GET", "POST"]
  >;

  const getAndPostShouldWork = await api.get<GetAndPost>("/api/test");
  const getAndPostShouldWork1 = await api.post<GetAndPost>("/api/test", {
    name: "Bob",
  });
}
/* eslint-enable @typescript-eslint/no-unused-vars */
