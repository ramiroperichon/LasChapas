import { useRef, useState, type CSSProperties } from 'react';
import { galleryImages } from '../content/images';
import { Lightbox } from './Lightbox';
import { Picture, ProvisionalTag } from './Picture';
import { SectionLabel } from './SectionLabel';
import { Words } from './Words';
import './Gallery.css';

/** Proporciones de cada casillero; el patrón se repite si hay más fotos. */
const SLOT_RATIOS = ['4 / 3', '4 / 5', '3 / 4', '16 / 10', '4 / 5', '3 / 2', '4 / 5', '16 / 11'];
/** Tamaños aproximados (para sizes) según el casillero en escritorio. */
const SLOT_SIZES = ['58vw', '40vw', '33vw', '66vw', '40vw', '58vw', '33vw', '50vw'];

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const total = galleryImages.length;
  const anyProvisional = galleryImages.some((img) => img.provisional);

  return (
    <section className="gallery section on-dark" id="galeria" aria-labelledby="galeria-titulo">
      <div className="wrap">
        <SectionLabel num="03">Galería</SectionLabel>
        <div className="gallery__head">
          <Words id="galeria-titulo" className="h2" parts={['Un recorrido', { em: 'antes de llegar.' }]} />
          <p className="gallery__note" data-reveal="up" style={{ '--d': 200 } as CSSProperties}>
            Tocá cualquier imagen para verla en grande.
            {anyProvisional && (
              <>
                {' '}
                <span className="gallery__notice">
                  Por ahora mostramos ilustraciones de referencia; muy pronto, fotografías reales de Las Chapas.
                </span>
              </>
            )}
          </p>
        </div>

        <ul className="gallery__grid" role="list">
          {galleryImages.map((image, i) => {
            const slot = i % SLOT_RATIOS.length;
            return (
              <li className={`gallery__item gallery__item--${slot + 1}`} key={`${image.file}-${i}`}>
                <button
                  ref={(el) => {
                    triggers.current[i] = el;
                  }}
                  type="button"
                  className="gallery__trigger"
                  onClick={() => setOpen(i)}
                  aria-label={`Ampliar imagen ${i + 1} de ${total}: ${image.caption ?? image.alt}`}
                >
                  <span className="gallery__frame" data-reveal="scale" style={{ '--d': (i % 2) * 120 } as CSSProperties}>
                    <Picture
                      image={image}
                      ratio={SLOT_RATIOS[slot]}
                      sizes={`(min-width: 900px) ${SLOT_SIZES[slot]}, ${slot % 3 === 0 ? '92vw' : '46vw'}`}
                    />
                    {image.provisional && <ProvisionalTag />}
                    <span className="gallery__zoom" aria-hidden="true">
                      Ver
                    </span>
                  </span>
                  <span className="gallery__caption mono" aria-hidden="true">
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {image.caption}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <Lightbox
        images={galleryImages}
        index={open}
        onChange={setOpen}
        onClose={() => {
          const i = open;
          setOpen(null);
          if (i !== null) triggers.current[i]?.focus();
        }}
      />
    </section>
  );
}
