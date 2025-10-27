import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import MakeCombine from "../ui/svg/makeCombine";

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 139 124"
          fill="currentColor"
          width="64"
          height="64"
        >
          <path
            d="M87.1075 118.636C105.56 95.4988 158.036 43.076 125.152 10.1915C106.196 -8.76381 86.8508 14.3552 77.1518 29.7471C72.7424 36.7446 69.1863 43.9006 65.5074 51.2582C64.2446 53.7836 62.7701 61.2503 61.5074 58.7249C59.5823 54.8748 60.515 47.2601 59.1075 42.7249C57.1604 36.4512 54.1693 30.8969 49.9518 25.836C42.3643 16.7309 24.211 0.533557 11.1075 10.7249C-5.78039 23.8594 7.63707 61.3541 16.0852 76.4138C23.2383 89.165 32.6688 102.597 43.0186 112.947C44.2495 114.178 52.5796 124.173 49.4185 116.947C46.8221 111.012 43.9075 103.8 43.9075 97.2138C43.9075 90.7739 49.5655 108.788 52.6186 114.458C58.6481 125.656 41.0468 118.636 34.3074 118.636"
            stroke="#B2BEB5"
            stroke-width="5"
            stroke-linecap="round"
            fill="#ffff"
          />
        </svg>
        <Button variant="default" className="px-3 py-2 font-semibold gap-2">
          Create a free form
          <ArrowRight className="size-4 translate-y-2px font-bold" />
        </Button>
        <h3 className="text-sm text-gray-700 pt-2">No signup required</h3>
      </div>
      <div>
        <div className="justify-between flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 246 345"
            fill="currentColor"
            width="100"
            height="100"
          >
            <path
              d="M231.654 338.871C226.62 328.369 215.525 326.434 199.105 326.459M231.654 338.871C225.998 327.972 228.442 313.96 239.986 304.673M231.654 338.871C230.13 339.104 224.107 318.996 210.59 297.968M199.326 279.195L187.311 259.67M176.046 242.774L165.908 227.004M155.62 210.859L143.605 192.461M133.535 178.327L121.895 160.68M112.283 146.111L100.268 129.214M89.0786 113.445L78.1898 97.2995M68.4273 83.4069L56.0365 67.6368M44.4719 53.3697C41.9687 49.615 35.9861 41.0541 32.0812 36.8487M22.3189 24.457L5.79785 6.05859"
              stroke="#FFAA33"
              stroke-width="11.3869"
              stroke-miterlimit="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="#000000"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 96 96"
            fill="currentColor"
            width="64"
            height="64"
          >
            <path
              d="M95.4 1L1 95.3"
              stroke="#B9BBB6"
              stroke-miterlimit="10"
              stroke-dasharray="13 13"
              fill="#000000"
            />
            <path
              d="M95.4 1L1 95.3"
              stroke="#000000"
              stroke-miterlimit="10"
              stroke-dasharray="13 13"
              fill="#000000"
            />
          </svg>
        </div>

        <div className=" relative mt-16 w-full max-w-4xl mx-auto">
          {/* === Left-side SVG === */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 86 94"
            fill="currentColor"
            width="64"
            height="64"
            className="absolute -left-30  "
          >
            <path
              d="M51.7507 89.3764C46.8423 66.4714 31.0526 25.5123 50.1502 3.05555C58.8532 -7.17824 59.7483 23.877 59.8718 28.7465C60.2341 43.0332 57.3781 58.0896 54.0402 71.9591C53.619 73.7096 50.1637 89.4389 53.567 83.552"
              stroke="#36454F"
              stroke-width="2"
              stroke-linecap="round"
              fill="#36454F"
            />
            <path
              d="M55.6964 89.94C47.8635 70.753 38.2096 40.9109 18.6681 29.7903C15.5318 28.0055 11.0088 25.8114 7.30074 27.0869C2.22045 28.8344 -1.14609 36.2692 2.59999 40.6874C9.04447 48.288 19.2442 53.6699 26.8448 60.0878C33.9423 66.0808 40.8449 72.4465 46.3646 79.9614C47.3542 81.3088 50.8939 89.7118 50.3729 88.0611"
              stroke="#36454F"
              stroke-width="2"
              stroke-linecap="round"
              fill="#36454F"
            />
            <path
              d="M58.4522 86.9339C53.3152 65.1436 55.5759 46.5023 64.0367 25.563C65.1417 22.8282 79.5285 -0.850586 81.8932 6.4026C92.3835 38.5792 61.9165 65.1202 51.8134 92.2571"
              stroke="#36454F"
              stroke-width="2"
              stroke-linecap="round"
              fill="#36454F"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 324 317"
            fill="currentColor"
            width="120"
            height="120"
            className="absolute -left-50 top-1/2 -translate-y-1/2  "
          >
            <path
              d="M59.5068 136.983L322.202 162.818"
              stroke="#FFAA33"
              strokeWidth="3"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="#36454F"
            />
            <path
              d="M1 153.981L263.696 179.816"
              stroke="#36454F"
              strokeWidth="3"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="#000000"
            />
          </svg>

          {/* === Right-side SVG === */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 92 47"
            fill="currentColor"
            width="80"
            height="80"
            className="absolute -right-40 top-1/2 -translate-y-1/2 opacity-80"
          >
            <path
              d="M2 45.0999L35.2 22.3999"
              stroke="#FF1AB3"
              strokeWidth="3"
              strokeMiterlimit="10"
              strokeLinecap="round"
              fill="#000000"
            />
            <path
              d="M35.2002 40.1L89.6002 2"
              stroke="#36454F"
              strokeWidth="3"
              strokeMiterlimit="10"
              strokeLinecap="round"
              fill="#000000"
            />
          </svg>
          <div className="relative mt-16 w-full max-w-4xl mx-auto">
            {/* === Decorative SVG: top-right of video === */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 69 108"
              fill="currentColor"
              width="80"
              height="80"
              className="absolute -top-10 -right-40 opacity-90"
            >
              <path
                d="M5.03278 52.8131C21.2369 42.8951 37.5408 30.93 55.3242 23.8507C58.6666 22.5202 61.8253 21.5107 65.3745 21.1413"
                stroke="#000000"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="#000000"
              />
              <path
                d="M2.74896 71.0228C18.3094 61.3239 33.7476 51.2604 49.7649 42.3159C55.2969 39.2267 60.988 36.1918 67.1175 34.4831"
                stroke="#000000"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="#000000"
              />
              <path
                d="M1.48685 83.403C22.9611 70.0363 44.2167 56.67 67.2376 46.1422"
                stroke="#000000"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="#000000"
              />
              <path
                d="M46.9234 2C40.2598 36.1161 35.4971 71.2339 34.0016 106"
                stroke="#FF1AB3"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="#000000"
              />
              <path
                d="M27.7211 7.34874C24.5074 29.1677 23.0639 50.8448 21.9814 72.8558"
                stroke="#FF1AB3"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="#000000"
              />
            </svg>

            {/* === Video === */}
            <video
              src="/demo.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto rounded-xl border border-gray-200 shadow-md"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 262 321"
            fill="currentColor"
            width="120"
            height="120"
            className=" ml-[-100px]"
          >
            <path
              d="M255.96 297.192C237.913 297.008 233.277 298.332 217.38 314.45M255.96 297.192C240.121 294.8 229.965 287.293 224.445 271.396M255.96 297.192C243.539 295.939 214.054 292.556 195.473 289.047M173.022 285.425L146.184 281.555M126.572 278.974C121.669 278.544 109.592 277.322 100.508 275.877M80.8961 274.844C74.0146 273.984 59.0645 272.264 54.3162 272.264M32.8975 269.94L6.05957 268.65L11.7368 233.812M16.1238 207.233L21.0269 175.75M23.8655 151.493L29.0266 120.01M32.1233 97.0437L36.2522 69.1735M40.8972 39.2393C42.0155 32.3578 44.4068 16.1174 45.0261 6.20801"
              stroke="#36454F"
              stroke-width="11.3869"
              stroke-miterlimit="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="#000000"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 82 84"
            fill="currentColor"
            width="100"
            height="100"
            className="mt-10"
          >
            <path
              d="M41.5816 1.21606C39.7862 5.82482 40.3852 10.0977 40.5593 14.9633C40.7854 21.2812 40.9774 27.5593 41.4363 33.8661"
              stroke="#000000"
              stroke-width="1.90596"
              stroke-linecap="round"
              fill="#000000"
            />
            <path
              d="M41.0651 45.1798C39.7505 51.5096 40.3418 57.6794 40.8893 64.0791C41.4093 70.1568 42.1389 76.2117 42.8566 82.2682"
              stroke="#000000"
              stroke-width="1.90596"
              stroke-linecap="round"
              fill="#000000"
            />
            <path
              d="M1.13413 46.6647C5.16696 44.8703 8.96881 44.7974 13.3092 44.5029C19.8761 44.0572 26.2025 43.2089 32.656 41.952"
              stroke="#000000"
              stroke-width="1.90596"
              stroke-linecap="round"
              fill="#000000"
            />
            <path
              d="M47.2629 40.0959C58.4139 39.3819 69.3895 37.5305 80.4472 35.9965"
              stroke="#000000"
              stroke-width="1.90596"
              stroke-linecap="round"
              fill="#000000"
            />
            <path
              d="M49.3429 34.6508L52.917 28.1667"
              stroke="#B2BEB5"
              stroke-width="1.90596"
              stroke-linecap="round"
              fill="#000000"
            />
            <path
              d="M32.9786 50.3504L28.6387 54.6391"
              stroke="#B2BEB5"
              stroke-width="1.90596"
              stroke-linecap="round"
              fill="#000000"
            />
            <path
              d="M52.6361 48.6656L56.9506 51.5758"
              stroke="#B2BEB5"
              stroke-width="1.90596"
              stroke-linecap="round"
              fill="#000000"
            />
            <path
              d="M31.549 30.8471C26.8741 29.4323 22.7143 27.3543 18.2738 25.3586"
              stroke="#B2BEB5"
              stroke-width="1.90596"
              stroke-linecap="round"
              fill="#000000"
            />
          </svg>
        </div>
      </div>
      <h3 className="text-md text-gray ">
        Powering 500,000+ teams at the world’s best companies
      </h3>
      <div className=" flex gap-6">
        <Image
          src="/notion-svgrepo-com.svg" // or /logo.png — put your file inside the public/ folder
          alt="notion logo"
          width={35} // adjust as needed
          height={35}
          className="rounded-sm" // optional: or remove
        />
        <MakeCombine />
        <Image
          src="/coffee.svg" // or /logo.png — put your file inside the public/ folder
          alt="notion logo"
          width={220} // adjust as needed
          height={220}
          className="rounded-sm" // optional: or remove
        />
        <Image
          src="/rakuten.svg" // or /logo.png — put your file inside the public/ folder
          alt="rakutenlogo"
          width={90} // adjust as needed
          height={90}
          className="rounded-sm" // optional: or remove
        />
      </div>
      <Image
        src="/kitty.png" //  — put your file inside the public/ folder
        alt="rakutenlogo"
        width={250} // adjust as needed
        height={250}
        className="rounded-md" // optional: or remove
      />
    </section>
  );
};
