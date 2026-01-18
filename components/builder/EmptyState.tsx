import { CircleQuestionMark, Navigation, PanelsTopLeft, PanelTop, Zap } from "lucide-react";
import { BlockButton } from "../ui/blockButton";

type Props = {
  onAddShortText: () => void;
  onAddLongText: () => void;
  onAddMultipleChoice: () => void;
};

export default function EmptyState({
  onAddShortText,
}: Props) {
  return (
    <div className="p-6">
      <p className="text-lg text-gray-600 mb-1 ">Fill.in is a form builder that <span className="text-pink-400 font-bold px-1 py-1 rounded bg-pink-100">works like a doc</span>.</p>
      <p className="text-lg text-gray-600 ">Just type <span className="text-pink-400 font-bold px-1 py-1 rounded bg-pink-100">/</span> to insert form blocks and <span className="text-pink-400 font-bold px-1 py-1 rounded bg-pink-100">@</span> to mention question answers.</p>
      <div className="mt-12 gap-2 w-full flex flex-col items-start ">
        <p className=" font-bold text-sm">
          Get started
        </p>
      <BlockButton onClick={onAddShortText} className="border-none">
          <Navigation />
          Create your first form
      </BlockButton>
      <BlockButton onClick={onAddShortText} className="border-none">
          <PanelsTopLeft />
          Get started with templates
      </BlockButton>
      <BlockButton onClick={onAddShortText} className="border-none">
          <PanelTop />
          Embed your form
      </BlockButton>
      <BlockButton onClick={onAddShortText} className="border-none">
          <CircleQuestionMark />
          Help center
      </BlockButton>
      <BlockButton onClick={onAddShortText} className="border-none">
          <Zap/>
          Learn about fill.in Pro
      </BlockButton>
      </div>
    </div>
    
  );
}
