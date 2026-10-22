import type { CSSProperties } from 'react';
import { heroImage } from '../content/images';
import { site, whatsappUrl } from '../content/site';
import { ButtonLink } from './Button';
import { ArrowIcon, WhatsAppIcon } from './Icons';
import { Picture } from './Picture';
import './Hero.css';

const WORDMARK = ['Las', 'Chapas'];

export function Hero() {
  let letterIndex = 0;
  return (
    <section className="hero on-dark" id="inicio" aria-labelledby="hero-title">
      <div className="hero__media">
        <div className="hero__parallax" data-parallax="-0.18">
          <Picture image={heroImage} sizes="100vw" priority className="hero__picture" />
        </div>
        <div className="hero__shade" aria-hidden="true" />
        {/* Cortina de chapa que sube en la secuencia de entrada */}
        <div className="hero__shutter" aria-hidden="true" />
      </div>

      <div className="hero__layout wrap">
        <h1 className="hero__title" id="hero-title">
          <span className="hero__kicker mono">
            <span className="hero__kicker-num" aria-hidden="true">
              N.º 01
            </span>
            {site.category} en {site.address.locality}, {site.address.region}
          </span>
          <span className="sr-only">{site.name}</span>
          <span className="hero__wordmark display" aria-hidden="true">
            {WORDMARK.map((word) => (
              <span className="hero__word" key={word}>
                {[...word].map((ch) => (
                  <span className="hero__char" key={letterIndex} style={{ '--i': letterIndex++ } as CSSProperties}>
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </span>
        </h1>

        <div className="hero__aside">
          <p className="hero__tagline">
            Una pausa, <em>bajo techo.</em>
          </p>
          <p className="hero__desc">
            Hospedaje temporario sobre la avenida San Martín, en {site.address.locality}. Escribinos y coordinamos tu
            estadía directamente con el propietario.
          </p>
          <div className="hero__actions">
            <ButtonLink href={whatsappUrl()} variant="accent" icon={<WhatsAppIcon className="btn__icon" />}>
              Consultar por WhatsApp
            </ButtonLink>
            <ButtonLink href="#espacio" variant="ghost-light" icon={<ArrowIcon className="btn__icon btn__icon--arrow" />}>
              Conocer el espacio
            </ButtonLink>
          </div>
        </div>

        {/* Cota de plano: ubica el lugar como en un dibujo técnico */}
        <div className="hero__dimension mono" aria-hidden="true">
          <span className="hero__dimension-line" />
          <span>Av. San Martín</span>
          <span className="hero__dimension-line" />
        </div>

        <a className="hero__scroll mono" href="#espacio">
          <span className="hero__scroll-track" aria-hidden="true">
            <span />
          </span>
          Explorá
        </a>
      </div>
    </section>
  );
}
