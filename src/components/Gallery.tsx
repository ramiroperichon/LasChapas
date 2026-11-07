import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { galleryImages } from '../content/images';
import { ArrowIcon } from './Icons';
import { Lightbox } from './Lightbox';
import { StringLights } from './StringLights';
import { Picture, ProvisionalTag } from './Picture';
import { SectionLabel } from './SectionLabel';
import { Words } from './Words';
import './Gallery.css';

/** Proporciones de cada casillero (pensadas para fotos verticales); el patrón se repite. */
const SLOT_RATIOS = ['4 / 5', '2 / 3', '3 / 4', '2 / 3', '4 / 5', '3 / 4'];

/** Inclina la foto en 3D siguiendo al mouse (solo con mouse, no en pantallas táctiles). */
function tilt(e: PointerEvent<HTMLButtonElement>) {
  if (e.pointerType !== 'mouse') return;
  const frame = e.currentTarget.querySelector<HTMLElement>('.gallery__frame');
  if (!frame) return;
  const r = frame.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  frame.style.setProperty('--ry', `${((x - 0.5) * 9).toFixed(2)}deg`);
  frame.style.setProperty('--rx', `${((0.5 - y) * 7).toFixed(2)}deg`);
  frame.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
  frame.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
}

function untilt(e: PointerEvent<HTMLButtonElement>) {
  const frame = e.currentTarget.querySelector<HTMLElement>('.gallery__frame');
  frame?.style.removeProperty('--rx');
  frame?.style.removeProperty('--ry');
}

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const total = galleryImages.length;
  const anyProvisional = galleryImages.some((img) => img.provisional);

  return (
    <section className="gallery section on-dark" data-tone="night" id="galeria" aria-labelledby="galeria-titulo">
      <StringLights className="gallery__lights" swags={4} bulbs={6} />
      <div className="wrap">
        <SectionLabel num="04">Galería</SectionLabel>
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
                  onPointerMove={tilt}
                  onPointerLeave={untilt}
                  aria-label={`Ampliar imagen ${i + 1} de ${total}: ${image.caption ?? image.alt}`}
                >
                  <span className="gallery__frame" data-reveal="scale" style={{ '--d': (i % 2) * 120 } as CSSProperties}>
                    <Picture
                      image={image}
                      ratio={SLOT_RATIOS[slot]}
                      sizes={`(min-width: 900px) 31vw, ${slot % 3 === 0 ? '92vw' : '46vw'}`}
                    />
                    {image.provisional && <ProvisionalTag />}
                    <span className="gallery__zoom" aria-hidden="true">
                      Ver
                    </span>
                  </span>
                  <span className="gallery__caption label" aria-hidden="true">
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {image.caption}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="gallery__swipe label" aria-hidden="true">
          Deslizá para recorrer <ArrowIcon className="gallery__swipe-icon" />
        </p>
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
