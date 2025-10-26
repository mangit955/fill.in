import { Herosection } from "@/components/landing-page/herosection";
import { Navbar } from "@/components/landing-page/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Navbar />
      <Herosection />
      {/* other content */}
    </div>
  );
}
