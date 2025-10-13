import { Link, useNavigate, useParams } from "react-router";
import type { Route } from "./+types/resume";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export function meta({ params }: Route.MetaArgs) {
  const resumeId = (params as any).id || "Unknown";
  return [
    { title: `Resumind | Resume ${resumeId}` },
    {
      name: "description",
      content: "View and analyze your resume with AI-powered insights",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated)
      navigate(`/auth/?next=/resume/${id}`);
  }, [isLoading]);

  // Load resume and feedback
  useEffect(() => {
    const loadResume = async () => {
      const resumeData = await kv.get(`resume:${id}`);
      if (!resumeData) return;

      const data = JSON.parse(resumeData);

      // PDF
      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;
      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      setResumeUrl(URL.createObjectURL(pdfBlob));

      // Preview image
      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;
      setImageUrl(URL.createObjectURL(imageBlob));

      // Feedback
      setFeedback(typeof data.feedback === "string" ? JSON.parse(data.feedback) : data.feedback);
    };

    loadResume();
  }, [id]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 px-6 py-8">
      {/* Back Navigation */}
      <nav className="mb-8 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
          <img src="/icons/back.svg" alt="back" className="w-4 h-4" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </nav>

      <div className="flex gap-12 max-lg:flex-col">
        {/* Resume Preview */}
        <section className="flex-1 sticky top-20 max-lg:w-full">
          {imageUrl && resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full max-w-md mx-auto gradient-border rounded-2xl overflow-hidden shadow-lg"
            >
              <img
                src={imageUrl}
                alt="Resume Preview"
                className="w-full h-auto object-contain"
              />
            </a>
          ) : (
            <div className="flex justify-center items-center h-80">
              <img src="/images/resume-scan-2.gif" alt="loading" className="w-40" />
            </div>
          )}
        </section>

        {/* Feedback & Analysis */}
        <section className="flex-1 flex flex-col gap-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Resume Review</h2>

          {feedback ? (
            <div className="flex flex-col gap-8">
              <Summary feedback={feedback} />
              <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
              <Details feedback={feedback} />
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <img src="/images/resume-scan-2.gif" alt="loading" className="w-40" />
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
