import type { CSSProperties } from 'react';
import { site, whatsappUrl } from '../content/site';
import { ButtonLink } from './Button';
import { ArrowUpRightIcon, WhatsAppIcon } from './Icons';
import { SectionLabel } from './SectionLabel';
import './Location.css';

export function Location() {
  return (
    <section className="location section" id="ubicacion" aria-labelledby="ubicacion-titulo">
      <div className="wrap">
        <SectionLabel num="05">Ubicación</SectionLabel>

        <div className="location__grid">
          <div className="location__info">
            <h2 className="location__address h2" id="ubicacion-titulo" data-reveal="words">
              <span className="w">
                <span style={{ '--i': 0 } as CSSProperties}>Avenida</span>
              </span>{' '}
              <span className="w">
                <span style={{ '--i': 1 } as CSSProperties}>
                  <em>San Martín</em>
                </span>
              </span>
            </h2>
            <address className="location__place" data-reveal="sign" style={{ '--d': 200 } as CSSProperties}>
              <span className="mono">{site.address.locality}</span>
              <span className="mono">{site.address.region}</span>
              <span className="mono">{site.address.country}</span>
            </address>
            <p className="location__text" data-reveal="up" style={{ '--d': 300 } as CSSProperties}>
              Abrí la ubicación exacta en Google Maps para ver cómo llegar. Si tenés dudas sobre el acceso, escribinos.
            </p>
            <div className="location__actions" data-reveal="up" style={{ '--d': 400 } as CSSProperties}>
              <ButtonLink href={site.mapsUrl} icon={<ArrowUpRightIcon className="btn__icon btn__icon--arrow" />}>
                Abrir en Google Maps
              </ButtonLink>
              <ButtonLink href={whatsappUrl('Hola, quisiera consultar cómo llegar a Las Chapas.')} variant="ghost" icon={<WhatsAppIcon className="btn__icon" />}>
                Preguntar cómo llegar
              </ButtonLink>
            </div>
          </div>

          <div className="location__map">
            {site.mapEmbedUrl ? (
              <iframe
                className="location__iframe"
                src={site.mapEmbedUrl}
                title={`Mapa de ubicación de ${site.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <PlanSketch />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Esquema gráfico (no a escala, no es un mapa real): una trama de manzanas
 * atravesada por la avenida. Las líneas se dibujan al entrar en pantalla.
 */
function PlanSketch() {
  const blocks: [number, number][] = [];
  for (let c = 0; c < 6; c++) for (let r = 0; r < 5; r++) if (r !== 2) blocks.push([c, r]);
  return (
    <a
      className="plan"
      href={site.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-reveal="plan"
      aria-label="Abrir la ubicación en Google Maps"
    >
      <svg viewBox="0 0 600 500" aria-hidden="true">
        <g className="plan__blocks">
          {blocks.map(([c, r], i) => (
            <rect
              key={i}
              x={20 + c * 96}
              y={20 + r * 92 + (r > 2 ? 22 : 0)}
              width="80"
              height={r === 1 || r === 3 ? 62 : 76}
              pathLength="1"
              style={{ '--i': i } as CSSProperties}
            />
          ))}
        </g>
        <g className="plan__avenue">
          <line x1="0" y1="212" x2="600" y2="212" pathLength="1" />
          <line x1="0" y1="262" x2="600" y2="262" pathLength="1" />
          <line className="plan__axis" x1="0" y1="237" x2="600" y2="237" pathLength="1" />
        </g>
        <text className="plan__label" x="30" y="242">
          AV. SAN MARTÍN
        </text>
        <g className="plan__pin" transform="translate(372 237)">
          <circle r="22" className="plan__halo" />
          <circle r="7" />
        </g>
        <g className="plan__north" transform="translate(556 52)">
          <circle r="20" />
          <path d="M0 -13 L6 6 L0 2 L-6 6Z" />
          <text y="38" textAnchor="middle">
            N
          </text>
        </g>
      </svg>
      <span className="plan__legend mono">Esquema ilustrativo · no a escala</span>
      <span className="plan__cta mono">
        Ver en Google Maps <ArrowUpRightIcon className="plan__cta-icon" />
      </span>
    </a>
  );
}
