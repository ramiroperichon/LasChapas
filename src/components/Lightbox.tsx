import { useEffect, useRef, useState } from 'react';
import type { ImageEntry } from '../content/images';
import { ChevronIcon, CloseIcon } from './Icons';
import { Picture } from './Picture';
import './Lightbox.css';

type Props = {
  images: ImageEntry[];
  index: number | null;
  onChange: (i: number) => void;
  onClose: () => void;
};

/**
 * Visor a pantalla completa sobre <dialog> nativo: foco atrapado, Escape
 * para cerrar, flechas del teclado y deslizamiento táctil.
 */
export function Lightbox({ images, index, onChange, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const total = images.length;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
    }
    if (index === null && dialog.open) {
      dialog.close();
    }
  }, [index]);

  const go = (step: 1 | -1) => {
    if (index === null) return;
    setDir(step);
    onChange((index + step + total) % total);
  };

  const requestClose = () => {
    const dialog = ref.current;
    document.documentElement.style.overflow = '';
    if (!dialog || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return onClose();
    dialog.dataset.closing = '';
    setTimeout(() => {
      delete dialog.dataset.closing;
      onClose();
    }, 320);
  };

  const image = index !== null ? images[index] : null;

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label="Visor de imágenes"
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1);
        else if (e.key === 'ArrowLeft') go(-1);
        else if (e.key === 'Home' && index !== null) onChange(0);
        else if (e.key === 'End' && index !== null) onChange(total - 1);
      }}
      onClick={(e) => {
        // Clic en el fondo (fuera de la imagen y controles) cierra el visor
        if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('lightbox__stage')) requestClose();
      }}
    >
      {image && index !== null && (
        <>
          <div className="lightbox__top">
            <p className="mono" aria-live="polite">
              <span className="lightbox__count">
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              {image.caption && <span>{image.caption}</span>}
              {image.provisional && <span className="lightbox__tag">Ilustración provisional</span>}
            </p>
            <button type="button" className="lightbox__btn" onClick={requestClose} autoFocus>
              <CloseIcon />
              <span className="sr-only">Cerrar visor</span>
            </button>
          </div>

          <div
            className="lightbox__stage"
            onTouchStart={(e) => {
              const t = e.touches[0];
              touch.current = { x: t.clientX, y: t.clientY };
            }}
            onTouchEnd={(e) => {
              const start = touch.current;
              touch.current = null;
              if (!start) return;
              const t = e.changedTouches[0];
              const dx = t.clientX - start.x;
              const dy = t.clientY - start.y;
              if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
              else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) requestClose();
            }}
          >
            <figure className="lightbox__figure" key={index} data-dir={dir}>
              <Picture image={image} sizes="100vw" className="lightbox__picture" />
              <figcaption className="sr-only">{image.alt}</figcaption>
            </figure>
          </div>

          <div className="lightbox__nav">
            <button type="button" className="lightbox__btn" onClick={() => go(-1)}>
              <ChevronIcon dir="left" />
              <span className="sr-only">Imagen anterior</span>
            </button>
            <div className="lightbox__dots" aria-hidden="true">
              {images.map((_, i) => (
                <span key={i} data-active={i === index || undefined} />
              ))}
            </div>
            <button type="button" className="lightbox__btn" onClick={() => go(1)}>
              <ChevronIcon />
              <span className="sr-only">Imagen siguiente</span>
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}
