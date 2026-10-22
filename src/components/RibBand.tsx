import type { CSSProperties } from 'react';
import { site } from '../content/site';
import './RibBand.css';

const RIBS = 40;

/**
 * Separador: una franja de chapa acanalada cuyas nervaduras se levantan en
 * cascada al entrar en pantalla, con una placa de señalética encima.
 */
export function RibBand() {
  return (
    <div className="rib-band" data-reveal="ribs" aria-hidden="true">
      <div className="rib-band__ribs">
        {Array.from({ length: RIBS }, (_, i) => (
          <span key={i} style={{ '--i': i } as CSSProperties} />
        ))}
      </div>
      <p className="rib-band__plate mono">
        {site.address.locality} <span>·</span> {site.address.region} <span>·</span> {site.address.country}
      </p>
    </div>
  );
}
