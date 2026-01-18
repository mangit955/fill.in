"use client";
import { motion,  } from "framer-motion";
import { BlockButton } from "../ui/blockButton";
import { CircleCheckBig, PanelsTopLeft, Rows2, Rows3 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";

type Props = {
  onAddShortText: () => void;
  onAddLongText: () => void;
  onAddMultipleChoice: () => void;
};

export default function AddBlockPanel({
  onAddLongText,
  onAddShortText,
  onAddMultipleChoice,
}: Props) {

  return (
    <div className="rounded-md p-6 space-y-2">
      {/* Toggle & rotation animation*/}
      <Popover>
        <PopoverTrigger asChild>
          <motion.button
        className="text-lg text-gray-400 font-medium  flex items-center gap-2"
      >
        <motion.span
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.3 }}
          className="inline-block text-3xl text-pink-400 cursor-pointer"
        >
          +
        </motion.span>
        <span>Press to start from scratch</span>
          </motion.button>
       </PopoverTrigger>
       
      <PopoverContent className="w-fit p-2">
          <ScrollArea className="h-24 pr-1">
            <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden "
          >
            
            <div className=" rounded-md">
              <BlockButton onClick={onAddShortText}>
                <Rows2 />
                Short text
              </BlockButton>
              <BlockButton onClick={onAddLongText}>
                <Rows3 />
                Long text
              </BlockButton>
              <BlockButton onClick={onAddMultipleChoice}>
                <CircleCheckBig />
                Multiple choice
              </BlockButton>
              <BlockButton onClick={onAddShortText}>
                <Rows2 />
                Short text
              </BlockButton>
              <BlockButton onClick={onAddLongText}>
                <Rows3 />
                Long text
              </BlockButton>
              <BlockButton onClick={onAddMultipleChoice}>
                <CircleCheckBig />
                Multiple choice
              </BlockButton>
            </div>
            
          </motion.div>
          </ScrollArea>
        </PopoverContent>
        </Popover>
      <div className="w-fit items-center flex gap-2 cursor-pointer text-neutral-400 rounded-sm hover:text-neutral-600 hover:bg-gray-100 p-1">
        <PanelsTopLeft size={18} />
        <span className="font-semibold">Use this templet</span>
      </div>  
    </div>
  );
}
