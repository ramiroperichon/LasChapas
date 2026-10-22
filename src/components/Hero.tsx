import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { heroImage } from '../content/images';
import { site, whatsappUrl } from '../content/site';
import { ButtonLink } from './Button';
import { ArrowIcon, WhatsAppIcon } from './Icons';
import { Picture } from './Picture';
import './Hero.css';

const WORDS = ['Las', 'Chapas'];
/** Duración mínima del telón de apertura, aunque la imagen ya esté en caché. */
const MIN_INTRO_MS = 900;
/** Si la imagen tarda más que esto, la secuencia arranca igual. */
const MAX_WAIT_MS = 2600;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  // La secuencia de entrada arranca cuando la imagen está lista (o al vencer
  // el tiempo máximo). Con movimiento reducido, todo aparece de inmediato.
  useEffect(() => {
    const root = document.documentElement;
    const start = () => {
      setReady(true);
      root.dataset.heroReady = '';
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return start();

    const img = ref.current?.querySelector('img');
    const loaded = new Promise<void>((resolve) => {
      if (!img || img.complete) return resolve();
      img.addEventListener('load', () => resolve(), { once: true });
      img.addEventListener('error', () => resolve(), { once: true });
    });
    const minDelay = new Promise((r) => setTimeout(r, MIN_INTRO_MS));
    const maxWait = new Promise((r) => setTimeout(r, MAX_WAIT_MS));
    let cancelled = false;
    Promise.race([Promise.all([loaded, minDelay]), maxWait]).then(() => !cancelled && start());
    return () => {
      cancelled = true;
    };
  }, []);

  // Leve desplazamiento de la imagen siguiendo el puntero (solo escritorio).
  useEffect(() => {
    const el = ref.current;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    if (!el || !mq.matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        el.style.setProperty('--mx', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
        el.style.setProperty('--my', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      });
    };
    el.addEventListener('pointermove', onMove);
    return () => {
      el.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  let letter = 0;
  return (
    <section ref={ref} className="hero on-dark" id="inicio" aria-labelledby="hero-title" data-ready={ready || undefined}>
      <div className="hero__media">
        <div className="hero__parallax" data-parallax="-0.2">
          <div className="hero__drift">
            <Picture image={heroImage} sizes="100vw" priority className="hero__picture" />
          </div>
        </div>
        <div className="hero__shade" aria-hidden="true" />
      </div>

      {/* Telón de apertura: una línea se traza y las dos mitades se abren */}
      <div className="hero__curtain" aria-hidden="true">
        <span className="hero__curtain-panel hero__curtain-panel--top" />
        <span className="hero__curtain-panel hero__curtain-panel--bottom" />
        <span className="hero__curtain-line" />
      </div>

      {/* Marco fino que se dibuja alrededor de la imagen */}
      <div className="hero__frame" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="hero__content wrap">
        <h1 className="hero__title" id="hero-title">
          <span className="hero__eyebrow label">
            <span>{site.category}</span>
            <span className="hero__eyebrow-sep"> · </span>
            <span>
              {site.address.locality}, {site.address.region}
            </span>
          </span>
          <span className="sr-only">{site.name}</span>
          <span className="hero__wordmark display" aria-hidden="true">
            {WORDS.map((word) => (
              <span className="hero__word" key={word}>
                {[...word].map((ch) => (
                  <span className="hero__char" key={letter} style={{ '--i': letter++ } as CSSProperties}>
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </span>
        </h1>

        <span className="hero__rule" aria-hidden="true" />

        <p className="hero__tagline">
          Una pausa, <em>bajo techo.</em>
        </p>

        <div className="hero__actions">
          <ButtonLink href={whatsappUrl()} variant="light" icon={<WhatsAppIcon className="btn__icon" />}>
            Consultar disponibilidad
          </ButtonLink>
          <ButtonLink href="#espacio" variant="ghost-light" icon={<ArrowIcon className="btn__icon btn__icon--arrow" />}>
            Conocer el espacio
          </ButtonLink>
        </div>
      </div>

      <div className="hero__bottom wrap">
        <p className="label">{site.address.street}</p>
        <a className="hero__scroll label" href="#espacio">
          <span className="hero__scroll-track" aria-hidden="true">
            <span />
          </span>
          Descubrir
        </a>
        <p className="label hero__bottom-right">
          {site.address.region} · {site.address.country}
        </p>
      </div>
    </section>
  );
}
