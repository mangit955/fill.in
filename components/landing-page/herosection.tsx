import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export const Herosection = () => {
  return (
    <section className=" flex flex-col justify-center items-center text-center px-6 pt-20">
      <div className="justify-center item-center flex-col flex">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4 leading-tight text-black">
          The{" "}
          <span className="relative inline-block">
            simplest
            <span className="absolute left-0 right-0 -bottom-2 w-full h-[18px] pointer-events-none select-none">
              {/* Inline SVG below */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 160 20"
                className="w-full h-[20px]"
              >
                <path
                  d="M4 16 Q 12 12, 18 16 Q 28 20, 34 14 Q 38 10, 48 15 Q 58 20, 64 13 Q 68 10, 76 15 Q 86 20, 92 14 Q 96 10, 104 17 Q 110 20, 120 13 Q 126 8, 132 16 Q 138 20, 146 12 Q 151 7, 156 15"
                  fill="none"
                  stroke="#FF1AB3"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </span>{" "}
          way to create forms
        </h1>

        <h2 className="font-medium text-lg sm:text-xl text-[rgb(55, 53, 47)] max-w-xl mx-auto pt-5">
          Say goodbye to boring forms. Meet Tally — the free, intuitive form
          builder you’ve been looking for.
        </h2>
      </div>
      <div className="pt-20">
        <Button variant="default" className="px-3 py-2 font-semibold gap-2">
          Create a free form
          <ArrowRight className="size-4 translate-y-2px font-bold" />
        </Button>
        <h3 className="text-sm text-gray-700 pt-2">No signup required</h3>
      </div>
      <div className="mt-16 w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg">
        <video
          src="/demo.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-auto rounded-xl border border-gray-200 shadow-md"
        />
      </div>
      <h3 className="text-md text-gray pt-15">
        Powering 500,000+ teams at the world’s best companies
      </h3>
    </section>
  );
};
