import { useRef } from "react";
import ScoreBadge from "./ScoreBadge";
import ScoreGauge from "./ScoreGauge";

const Category = ({ title, score }: { title: string; score: number }) => {
  const TextColor =
    score >= 80
      ? "text-green-600"
      : score >= 60
      ? "text-blue-600"
      : score >= 40
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="resume-summary">
      <div className="category">
        <div className="flex flex-row gap-2 items-center justify-center">
          <p className="text-2xl">{title}</p>
          <ScoreBadge score={score} />
        </div>
        <p className="text-2xl">
          <span className={TextColor}>{score}</span>/100
        </p>
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  const summaryRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div ref={summaryRef} className="bg-white rounded-2xl shadow-md w-full p-6">
        <div className="flex flex-row items-center p-4 gap-8">
          <ScoreGauge score={feedback.overallScore} />
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl !text-black font-bold">Your Resume score</h2>
          </div>
        </div>

        <Category title="Tone and Style" score={feedback.toneAndStyle.score} />
        <Category title="Skills" score={feedback.skills.score} />
        <Category title="Structure" score={feedback.structure.score} />
        <Category title="Content" score={feedback.content.score} />
      </div>
    </div>
  );
};

export default Summary;
