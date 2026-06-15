import { useState } from 'react';

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const gallery = images.length > 0 ? images : ['/logo192.png'];
  const [active, setActive] = useState(0);
  const current = gallery[Math.min(active, gallery.length - 1)];

  return (
    <div className="space-y-4">
      <div className="flex min-h-[280px] items-center justify-center rounded-xl bg-porcelain p-8 dark:bg-night-900">
        <img src={current} alt={alt} className="max-h-80 w-full object-contain" />
      </div>
      {gallery.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {gallery.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`h-16 w-16 overflow-hidden rounded-lg border-2 p-1 transition-colors ${
                active === index
                  ? 'border-marrGold bg-gold-50 dark:bg-night-700'
                  : 'border-gold-200/60 bg-white dark:border-gold-500/30 dark:bg-night-800'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <img src={src} alt="" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
