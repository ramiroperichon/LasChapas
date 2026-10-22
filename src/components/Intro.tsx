import type { CSSProperties } from 'react';
import { introImages } from '../content/images';
import { pending, site } from '../content/site';
import { Picture, ProvisionalTag } from './Picture';
import { SectionLabel } from './SectionLabel';
import { Words } from './Words';
import './Intro.css';

/** Ficha técnica: solo datos confirmados (y los pendientes, cuando se completen). */
const facts = [
  { term: 'Dónde', value: `${site.address.street}, ${site.address.locality}, ${site.address.region}` },
  { term: 'Qué', value: site.category },
  { term: 'Cómo', value: 'Consultas y coordinación directa con el propietario, por WhatsApp o teléfono' },
  pending.capacity && { term: 'Capacidad', value: pending.capacity },
  pending.checkInOut && { term: 'Horarios', value: pending.checkInOut },
  pending.amenities.length > 0 && { term: 'Incluye', value: pending.amenities.join(' · ') },
].filter((f): f is { term: string; value: string } => Boolean(f));

export function Intro() {
  const [tall, small] = introImages;
  return (
    <section className="intro section" id="espacio" aria-labelledby="espacio-titulo">
      <div className="wrap">
        <SectionLabel num="02">El espacio</SectionLabel>

        <div className="intro__grid">
          <Words
            id="espacio-titulo"
            className="intro__title h2"
            parts={['Llegar, dejar el bolso y', { em: 'bajar el ritmo.' }]}
          />

          <div className="intro__text">
            <p className="lead" data-reveal="up">
              Las Chapas es un hospedaje temporario sobre la avenida San Martín, en {site.address.locality}, Corrientes.
            </p>
            <p data-reveal="up" style={{ '--d': 120 } as CSSProperties}>
              Un lugar para quedarse unos días, con trato directo con quien te recibe: escribís, preguntás lo que
              necesites y coordinás tu llegada sin intermediarios.
            </p>

            <dl className="facts">
              {facts.map(({ term, value }, i) => (
                <div className="facts__row" key={term} data-reveal="up" style={{ '--d': 100 + i * 90 } as CSSProperties}>
                  <dt className="mono">
                    <span className="facts__num">{String(i + 1).padStart(2, '0')}</span>
                    {term}
                  </dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <figure className="intro__figure intro__figure--tall">
            <div className="shutter-frame" data-reveal="shutter">
              <div className="shutter__media">
                <div className="intro__parallax" data-parallax="0.08">
                  <Picture image={tall} sizes="(min-width: 1024px) 40vw, 92vw" ratio="4 / 5" />
                </div>
              </div>
              <div className="shutter" aria-hidden="true" />
              {tall.provisional && <ProvisionalTag />}
            </div>
            <figcaption className="mono" data-reveal="sign" style={{ '--d': 500 } as CSSProperties}>
              Fig. 01 — Luz de tarde
            </figcaption>
          </figure>

          <figure className="intro__figure intro__figure--small">
            <div className="shutter-frame shutter-frame--light" data-reveal="shutter" style={{ '--d': 250 } as CSSProperties}>
              <div className="shutter__media">
                <Picture image={small} sizes="(min-width: 1024px) 24vw, 60vw" ratio="1 / 1" />
              </div>
              <div className="shutter" aria-hidden="true" />
              {small.provisional && <ProvisionalTag />}
            </div>
            <figcaption className="mono" data-reveal="sign" style={{ '--d': 700 } as CSSProperties}>
              Fig. 02 — Chapa
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
