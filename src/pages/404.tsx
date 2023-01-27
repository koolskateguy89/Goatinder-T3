import Link from "next/link";

export default function Custom404() {
  return (
    <main className="container flex flex-grow flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold">You seem to be lost</h1>

      <Link href="/" className="btn btn-primary mt-4">
        Go back home
      </Link>
    </main>
  );
}
