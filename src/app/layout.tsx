import AuthContext from "app/AuthContext";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";

import "styles/globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await unstable_getServerSession(authOptions);

  return (
    <AuthContext session={session}>
      <html lang="en">
        <head />
        <body>{children}</body>
      </html>
    </AuthContext>
  );
}
