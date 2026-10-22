import { useEffect, useState, type CSSProperties } from 'react';
import { site, telUrl, whatsappUrl, fullAddress } from '../content/site';
import { ButtonLink } from './Button';
import { Mark, WhatsAppIcon } from './Icons';
import { Words } from './Words';
import './Closing.css';

export function Closing() {
  const year = new Date().getFullYear();
  return (
    <footer className="closing on-dark" id="pie">
      <div className="closing__ribs" aria-hidden="true" />
      <div className="wrap closing__inner">
        <div className="closing__cta">
          <p className="mono closing__kicker" data-reveal="sign">
            {site.name} — {site.address.locality}
          </p>
          <Words as="p" className="closing__title display" parts={['Te esperamos', { em: 'bajo techo.' }]} />
          <div className="closing__actions" data-reveal="up" style={{ '--d': 300 } as CSSProperties}>
            <ButtonLink href={whatsappUrl()} variant="accent" icon={<WhatsAppIcon className="btn__icon" />}>
              Consultar disponibilidad
            </ButtonLink>
            <ButtonLink href={telUrl} variant="ghost-light">
              {`Llamar al ${site.phone.display}`}
            </ButtonLink>
          </div>
        </div>

        <div className="closing__cols">
          <div className="closing__brand">
            <Mark className="closing__mark" />
            <p className="closing__name">{site.name}</p>
            <p className="closing__cat">{site.category}</p>
          </div>
          <div>
            <h2 className="mono closing__h">Dirección</h2>
            <address>
              {site.address.street}
              <br />
              {site.address.locality}, {site.address.region}
              <br />
              {site.address.country}
            </address>
          </div>
          <div>
            <h2 className="mono closing__h">Contacto</h2>
            <ul role="list">
              <li>
                <a className="link" href={telUrl}>
                  Tel. {site.phone.display}
                </a>
              </li>
              <li>
                <a className="link" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mono closing__h">Cómo llegar</h2>
            <ul role="list">
              <li>
                <a className="link" href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
                  Ver en Google Maps
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="closing__bottom mono">
          <p>
            © {year} {site.name}. Todos los derechos reservados.
          </p>
          <p className="sr-only">{fullAddress}</p>
          <a className="link" href="#inicio">
            Volver arriba ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

/**
 * Acceso flotante a WhatsApp en móviles. Aparece después del hero y se
 * esconde al llegar a contacto y al pie, para no tapar otros controles.
 */
export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const inView = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) inView.set(e.target.id, e.isIntersecting);
        setVisible(![...inView.values()].some(Boolean));
      },
      { rootMargin: '0px 0px -20% 0px' },
    );
    for (const id of ['inicio', 'contacto', 'pie']) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <a
      className="fab"
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      data-visible={visible || undefined}
      aria-hidden={!visible || undefined}
      tabIndex={visible ? undefined : -1}
    >
      <WhatsAppIcon className="fab__icon" />
      <span className="fab__label">Consultar</span>
    </a>
  );
}
