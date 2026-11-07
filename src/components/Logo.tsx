import { site } from '../content/site';
import './Logo.css';

/*
 * Logo PROVISIONAL, dibujado a partir de la descripción del logo real:
 * un círculo con "Las Chapas" en el centro y, más chico debajo,
 * "Suite de huéspedes". Cuando exista el archivo definitivo, reemplazá el
 * contenido de <Seal> por ese SVG; el resto del sitio no cambia.
 */

type SealProps = { className?: string; title?: string };

/** Sello completo. Hereda el color del texto (currentColor). */
export function Seal({ className = '', title }: SealProps) {
  return (
    <svg
      className={`seal ${className}`}
      viewBox="0 0 200 200"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable={false}
    >
      <circle className="seal__ring" cx="100" cy="100" r="95" pathLength="1" />
      <circle className="seal__ring seal__ring--inner" cx="100" cy="100" r="88" pathLength="1" />
      <text className="seal__name" x="100" y="108" textAnchor="middle">
        Las <tspan className="seal__italic">Chapas</tspan>
      </text>
      <line className="seal__rule" x1="86" x2="114" y1="122" y2="122" />
      <text className="seal__sub" x="100" y="138" textAnchor="middle">
        {site.tagline.toUpperCase()}
      </text>
    </svg>
  );
}

/** Versión horizontal para la cabecera: monograma en círculo + nombre. */
export function Lockup() {
  return (
    <span className="lockup">
      <svg className="lockup__mark" viewBox="0 0 40 40" aria-hidden="true" focusable={false}>
        <circle cx="20" cy="20" r="18.5" />
        <text x="20" y="25.5" textAnchor="middle">
          LC
        </text>
      </svg>
      <span className="lockup__text">
        <span className="lockup__name">{site.name}</span>
        <span className="lockup__sub">{site.tagline}</span>
      </span>
    </span>
  );
}
