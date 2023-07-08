import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Mitr } from "next/font/google";

const mitr = Mitr({
  subsets: ["thai"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <main className={mitr.className}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </main>
  );
}
