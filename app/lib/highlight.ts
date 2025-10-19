export type HighlightArea = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label: string;
  type: 'good' | 'improve';
};

export const createHighlightedCanvas = (
  imageElement: HTMLImageElement,
  highlights: HighlightArea[]
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = imageElement.naturalWidth;
  canvas.height = imageElement.naturalHeight;

  ctx.drawImage(imageElement, 0, 0);

  highlights.forEach((highlight) => {
    ctx.fillStyle = highlight.color;
    ctx.fillRect(highlight.x, highlight.y, highlight.width, highlight.height);

    ctx.strokeStyle = highlight.type === 'good' ? '#10b981' : '#f59e0b';
    ctx.lineWidth = 3;
    ctx.strokeRect(highlight.x, highlight.y, highlight.width, highlight.height);
  });

  return canvas;
};

export const downloadHighlightedResume = async (
  imageUrl: string,
  highlights: HighlightArea[],
  filename: string = 'highlighted-resume.png'
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = createHighlightedCanvas(img, highlights);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          resolve();
        }, 'image/png');
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
};
