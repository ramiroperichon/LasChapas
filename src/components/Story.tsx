import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { storySteps } from '../content/story';
import { Picture } from './Picture';
import { SectionLabel } from './SectionLabel';
import { Words } from './Words';
import './Story.css';

/**
 * "Un día en Las Chapas": un mazo de fotos en 3D que queda fijo mientras los
 * textos pasan al costado (abajo, en móvil). Cada momento que llega al
 * centro de la pantalla levanta la foto de arriba y trae la siguiente.
 * Usa el scroll nativo: no hay desplazamiento forzado.
 */
export function Story() {
  const [active, setActive] = useState(0);
  const steps = useRef<(HTMLElement | null)[]>([]);
  const total = storySteps.length;

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      // Activa el momento cuando su texto cruza la franja media-baja de la pantalla
      { rootMargin: '-55% 0px -35% 0px' },
    );
    steps.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="story section" id="recorrido" aria-labelledby="recorrido-titulo">
      <div className="wrap">
        <SectionLabel num="03">Recorrido</SectionLabel>
        <Words
          id="recorrido-titulo"
          className="story__title h2"
          parts={['Un día en', { em: 'Las Chapas.' }]}
        />
      </div>

      <div className="story__body wrap">
        <div className="story__stage">
          <div className="deck" aria-hidden="true">
            {storySteps.map((step, i) => {
              const d = i - active;
              return (
                <figure
                  key={step.image.file}
                  className="deck__card"
                  data-state={d < 0 ? 'past' : d === 0 ? 'current' : 'next'}
                  style={{ '--d': Math.max(d, 0), zIndex: total - i } as CSSProperties}
                >
                  <Picture image={step.image} sizes="(min-width: 900px) 40vw, 80vw" ratio="4 / 5" />
                  <figcaption className="deck__caption label">
                    {String(i + 1).padStart(2, '0')} · {step.moment}
                  </figcaption>
                </figure>
              );
            })}
          </div>
          <div className="story__progress label" aria-hidden="true">
            <span className="story__count">{String(active + 1).padStart(2, '0')}</span>
            <span className="story__ticks">
              {storySteps.map((step, i) => (
                <span key={step.moment} data-on={i <= active || undefined} />
              ))}
            </span>
            <span>{String(total).padStart(2, '0')}</span>
          </div>
        </div>

        <ol className="story__steps" role="list">
          {storySteps.map((step, i) => (
            <li
              key={step.moment}
              ref={(el) => {
                steps.current[i] = el;
              }}
              className="story__step"
              data-index={i}
              data-active={i === active || undefined}
            >
              <div className="story__text">
                <p className="story__moment label">
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {step.moment}
                </p>
                <h3 className="story__step-title">{step.title}</h3>
                <p className="story__step-text">{step.text}</p>
                {/* Para lectores de pantalla, la foto de cada momento va con su texto */}
                <span className="sr-only">Foto: {step.image.alt}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
