import Image from "next/image";
import MakeCombine from "../ui/svg/makeCombine";

export function MarqueeLogos() {
  return (
    <div className="flex items-center gap-16 shrink-0">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-16">
          <Image
            src="/notion-svgrepo-com.svg"
            alt="Notion"
            width={35}
            height={35}
          />
          <MakeCombine />
          <Image src="/coffee.svg" alt="Coffee" width={220} height={40} />
          <Image src="/rakuten.svg" alt="Rakuten" width={90} height={40} />
        </div>
      ))}
    </div>
  );
}
