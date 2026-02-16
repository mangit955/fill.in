import {
  CircleQuestionMark,
  Navigation,
  PanelsTopLeft,
  PanelTop,
  Zap,
} from "lucide-react";
import { BlockButton } from "../ui/blockButton";

type Props = {
  onAddShortText?: () => void;
};

export default function EmptyState({ onAddShortText }: Props) {
  const handleAction = onAddShortText ?? (() => {});

  return (
    <div className="p-6">
      <p className="text-lg text-gray-600 mb-1 ">
        Fill.in is a form builder that{" "}
        <span className="text-pink-400 font-bold px-1  rounded bg-pink-100">
          works like a doc
        </span>
        .
      </p>
      <p className="text-lg text-gray-600 ">
        Just type{" "}
        <span className="text-pink-400 font-bold px-1 rounded bg-pink-100">
          /
        </span>{" "}
        to insert form blocks and start asking questions !
      </p>
      <div className="mt-12 gap-2 w-full flex flex-col items-start ">
        <p className=" font-bold text-sm">Get started</p>
        <BlockButton
          onClick={handleAction}
          className="border-none cursor-not-allowed!"
        >
          <Navigation />
          Create your first form
        </BlockButton>
        <BlockButton
          onClick={handleAction}
          className="border-none cursor-not-allowed!"
        >
          <PanelsTopLeft />
          Get started with templates
        </BlockButton>
        <BlockButton
          onClick={handleAction}
          className="border-none cursor-not-allowed! "
        >
          <PanelTop />
          Embed your form
        </BlockButton>
        <BlockButton
          onClick={handleAction}
          className="border-none cursor-not-allowed!"
        >
          <CircleQuestionMark />
          Help center
        </BlockButton>
        <BlockButton
          onClick={handleAction}
          className="border-none cursor-not-allowed!"
        >
          <Zap />
          Learn about fill.in Pro
        </BlockButton>
      </div>
    </div>
  );
}
