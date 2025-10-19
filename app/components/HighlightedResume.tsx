import { useEffect, useRef, useState } from 'react';
import { createHighlightedCanvas, downloadHighlightedResume } from '~/lib/highlight';
import type { HighlightArea } from '~/lib/highlight';

interface HighlightedResumeProps {
  imageUrl: string;
  highlights: HighlightArea[];
  onDownload?: () => void;
}

const HighlightedResume: React.FC<HighlightedResumeProps> = ({
  imageUrl,
  highlights,
  onDownload,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (canvasRef.current) {
        try {
          const canvas = createHighlightedCanvas(img, highlights);
          const ctx = canvasRef.current.getContext('2d');

          if (ctx) {
            canvasRef.current.width = canvas.width;
            canvasRef.current.height = canvas.height;
            ctx.drawImage(canvas, 0, 0);
          }

          setIsLoading(false);
        } catch (err) {
          setError('Failed to render highlights');
          setIsLoading(false);
        }
      }
    };

    img.onerror = () => {
      setError('Failed to load image');
      setIsLoading(false);
    };

    img.src = imageUrl;
  }, [imageUrl, highlights]);

  const handleDownload = async () => {
    try {
      await downloadHighlightedResume(imageUrl, highlights, 'resume-with-highlights.png');
      onDownload?.();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-80">
        <img src="/images/resume-scan-2.gif" alt="loading" className="w-40" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-80 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <canvas
        ref={canvasRef}
        className="w-full h-auto object-contain gradient-border rounded-2xl overflow-hidden shadow-lg"
      />
      <button
        onClick={handleDownload}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        Download Highlighted Resume
      </button>
    </div>
  );
};

export default HighlightedResume;
