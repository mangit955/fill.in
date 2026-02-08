"use client";
import { motion } from "framer-motion";
import { BlockButton } from "../ui/blockButton";
import {
  AtSign,
  Calendar,
  CircleCheckBig,
  Hash,
  Link,
  Phone,
  Rows2,
  Rows3,
  Star,
  Upload,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";

type Props = {
  onAddShortText: () => void;
  onAddLongText: () => void;
  onAddMultipleChoice: () => void;
  onAddEmail: () => void;
  onAddPhone: () => void;
  onAddDate: () => void;
  onAddLink: () => void;
  onAddNumber: () => void;
  onAddRating: () => void;
  onAddFileUpload: () => void;
};

export default function AddBlockPanel({
  onAddLongText,
  onAddShortText,
  onAddMultipleChoice,
  onAddEmail,
  onAddPhone,
  onAddDate,
  onAddLink,
  onAddNumber,
  onAddRating,
  onAddFileUpload,
}: Props) {
  return (
    <div className="rounded-md p-6 space-y-2">
      {/* Toggle & rotation animation*/}
      <motion.div
        whileHover="hover"
        whileFocus="hover"
        className="inline-block"
      >
        <Popover>
          <PopoverTrigger asChild>
            <motion.button className=" text-lg text-gray-400 hover: hover:text-gray-600 font-medium  flex items-center gap-2 hover:bg-neutral-100 rounded-md px-1 cursor-pointer">
              <motion.span
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3 }}
                className="inline-block text-3xl text-pink-400 hover:text-pink-500 "
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
                  <BlockButton onClick={onAddEmail}>
                    <AtSign />
                    Email
                  </BlockButton>
                  <BlockButton onClick={onAddPhone}>
                    <Phone />
                    Phone
                  </BlockButton>
                  <BlockButton onClick={onAddDate}>
                    <Calendar />
                    Date
                  </BlockButton>
                  <BlockButton onClick={onAddLink}>
                    <Link />
                    Link
                  </BlockButton>
                  <BlockButton onClick={onAddNumber}>
                    <Hash />
                    Number
                  </BlockButton>
                  <BlockButton onClick={onAddRating}>
                    <Star />
                    Rating
                  </BlockButton>
                  <BlockButton onClick={onAddFileUpload}>
                    <Upload />
                    File upload
                  </BlockButton>
                </div>
              </motion.div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </motion.div>
    </div>
  );
}
