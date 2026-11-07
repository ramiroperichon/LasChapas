import type { CSSProperties } from 'react';
import './StringLights.css';

type Props = {
  /** Cantidad de "comberas" (tramos de cable entre dos puntos de apoyo). */
  swags?: number;
  /** Lamparitas por tramo. */
  bulbs?: number;
  className?: string;
};

const W = 1200;
const H = 140;

/**
 * Guirnalda de luces, como la del cerco de cañas: un cable que cuelga en
 * curvas y lamparitas que se encienden de a una al entrar en pantalla.
 * El cable es SVG (se estira con el ancho); las lamparitas son círculos HTML
 * ubicados en porcentajes, así no se deforman en pantallas angostas.
 */
export function StringLights({ swags = 3, bulbs = 7, className = '' }: Props) {
  const span = W / swags;
  let path = `M 0 ${H * 0.14}`;
  const points: { x: number; y: number }[] = [];

  for (let s = 0; s < swags; s++) {
    const x0 = s * span;
    const x1 = x0 + span;
    const y0 = H * 0.14;
    // Cada combera cuelga un poco distinto, como una guirnalda real
    const sag = H * (0.82 + (s % 2) * 0.1);
    const cx = x0 + span / 2;
    path += ` Q ${cx} ${sag} ${x1} ${y0}`;
    for (let b = 1; b <= bulbs; b++) {
      const t = b / (bulbs + 1);
      const x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t ** 2 * x1;
      const y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * sag + t ** 2 * y0;
      points.push({ x, y });
    }
  }

  return (
    <div className={`lights ${className}`} data-reveal="lights" aria-hidden="true">
      <svg className="lights__wire" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <path d={path} vectorEffect="non-scaling-stroke" />
      </svg>
      {points.map((p, i) => (
        <span
          key={i}
          className="lights__bulb"
          style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%`, '--i': i } as CSSProperties}
        />
      ))}
    </div>
  );
}
