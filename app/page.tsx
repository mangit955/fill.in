import Footer from "@/components/landing-page/footer";
import { Herosection } from "@/components/landing-page/herosection";
import { Navbar } from "@/components/navbar/navbar";
import Head from "next/head";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Head>
        <link rel="icon" href="/public/s-logo.png" />
      </Head>
      <Navbar />
      <Herosection />
      <Footer />
      {/* other content */}
    </div>
  );
}
