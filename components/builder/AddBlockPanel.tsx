import { Button } from "../ui/button";

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
    <div className="border space-y-2 rounded-md p-4">
      <p className="text-sm font-medium"> Add a question</p>
      <div className="space-y-1">
        <Button
          variant="ghost"
          onClick={onAddShortText}
          className="text-left block text-sm cursor-pointer"
        >
          Short text
        </Button>
        <Button
          variant="ghost"
          onClick={onAddLongText}
          className="text-left block text-sm cursor-pointer"
        >
          Long text
        </Button>
        <Button
          variant="ghost"
          onClick={onAddMultipleChoice}
          className="text-left block text-sm cursor-pointer"
        >
          Multiple choice
        </Button>
      </div>
    </div>
  );
}
