import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
    <div
      className={cn(
        "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
        score >= 80
          ? "bg-badge-green"
          : score >= 60
            ? "bg-blue-100"
            : score >= 40
              ? "bg-badge-yellow"
              : "bg-badge-red"
      )}
    >
      <img
        src={
          score >= 80
            ? "/icons/check.svg"
            : score >= 60
              ? "/icons/check.svg"
              : score >= 40
                ? "/icons/warning.svg"
                : "/icons/warning.svg"
        }
        alt="score"
        className="size-4"
      />
      <p
        className={cn(
          "text-sm font-medium",
          score >= 80
            ? "text-badge-green-text"
            : score >= 60
              ? "text-badge-green-text"
              : score >= 40
                ? "text-badge-yellow-text"
                : "text-badge-red-text"
        )}
      >
        {score}/100
      </p>
    </div>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div className="flex flex-row gap-4 items-center py-2">
      <p className="text-2xl font-semibold">{title}</p>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

const CategoryContent = ({
  tips,
  onTipClick,
  selectedTips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  onTipClick?: (index: number) => void;
  selectedTips?: Set<number>;
}) => {
  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <div className="bg-gray-50 w-full rounded-lg px-5 py-4 grid grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div className="flex flex-row gap-2 items-center" key={index}>
            <img
              src={
                tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"
              }
              alt="score"
              className="size-5"
            />
            <p className="text-xl text-gray-500 ">{tip.tip}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 w-full">
        {tips.map((tip, index) => (
          <div
            key={index + tip.tip}
            onClick={() => onTipClick?.(index)}
            className={cn(
              "flex flex-col gap-2 rounded-2xl p-4 transition-all",
              tip.type === "good"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-yellow-50 border border-yellow-200 text-yellow-700",
              onTipClick && "cursor-pointer hover:shadow-lg",
              selectedTips?.has(index) && "ring-2 ring-blue-500"
            )}
          >
            <div className="flex flex-row gap-2 items-center justify-between">
              <div className="flex flex-row gap-2 items-center">
                <img
                  src={
                    tip.type === "good"
                      ? "/icons/check.svg"
                      : "/icons/warning.svg"
                  }
                  alt="score"
                  className="size-5"
                />
                <p className="text-xl font-semibold">{tip.tip}</p>
              </div>
              {onTipClick && selectedTips?.has(index) && (
                <img src="/icons/pin.svg" alt="pinned" className="size-5" />
              )}
            </div>
            <p>{tip.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Details = ({
  feedback,
  onTipClick,
  selectedTips,
}: {
  feedback: Feedback;
  onTipClick?: (category: string, index: number) => void;
  selectedTips?: Map<string, Set<number>>;
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Accordion>
        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader
              title="Tone & Style"
              categoryScore={feedback.toneAndStyle.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <CategoryContent
              tips={feedback.toneAndStyle.tips}
              onTipClick={onTipClick ? (index) => onTipClick('toneAndStyle', index) : undefined}
              selectedTips={selectedTips?.get('toneAndStyle')}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <CategoryHeader
              title="Content"
              categoryScore={feedback.content.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent
              tips={feedback.content.tips}
              onTipClick={onTipClick ? (index) => onTipClick('content', index) : undefined}
              selectedTips={selectedTips?.get('content')}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="structure">
          <AccordionHeader itemId="structure">
            <CategoryHeader
              title="Structure"
              categoryScore={feedback.structure.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent
              tips={feedback.structure.tips}
              onTipClick={onTipClick ? (index) => onTipClick('structure', index) : undefined}
              selectedTips={selectedTips?.get('structure')}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <CategoryHeader
              title="Skills"
              categoryScore={feedback.skills.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent
              tips={feedback.skills.tips}
              onTipClick={onTipClick ? (index) => onTipClick('skills', index) : undefined}
              selectedTips={selectedTips?.get('skills')}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;
