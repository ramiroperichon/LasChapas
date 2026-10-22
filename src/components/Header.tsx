import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { site, whatsappUrl } from '../content/site';
import { ButtonInner } from './Button';
import { CloseIcon, Mark, WhatsAppIcon } from './Icons';
import './Header.css';

export const navItems = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'espacio', label: 'El espacio' },
  { id: 'galeria', label: 'Galería' },
  { id: 'ubicacion', label: 'Ubicación' },
] as const;

export function Header() {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string>('inicio');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Estado de la cabecera: transparente sobre el hero, sólida después;
  // se esconde al bajar y reaparece al subir.
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const heroEnd = window.innerHeight * 0.85;
        setSolid(y > heroEnd - 80);
        const header = document.querySelector('.site-header');
        const focusInside = header?.contains(document.activeElement);
        setHidden(y > heroEnd && y > lastY + 4 && !focusInside);
        if (y < lastY - 4 || y <= heroEnd) setHidden(false);
        lastY = y;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sección activa en la navegación
  useEffect(() => {
    const sections = navItems
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const openMenu = () => {
    menuRef.current?.showModal();
    setMenuOpen(true);
  };

  const closeMenu = () => {
    const dialog = menuRef.current;
    if (!dialog?.open) return;
    dialog.dataset.closing = '';
    const done = () => {
      delete dialog.dataset.closing;
      dialog.close();
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) done();
    else setTimeout(done, 420);
  };

  return (
    <header className="site-header" data-solid={solid || undefined} data-hidden={(hidden && !menuOpen) || undefined}>
      <div className="site-header__bar wrap">
        <a className="brand" href="#inicio" aria-label={`${site.name}, ir al inicio`}>
          <Mark className="brand__mark" />
          <span className="brand__name">{site.name}</span>
        </a>

        <nav className="site-nav" aria-label="Principal">
          <ul role="list">
            {navItems.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={active === id ? 'true' : undefined}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a className="btn btn--accent site-header__cta" href="#contacto">
          <ButtonInner>Consultar disponibilidad</ButtonInner>
        </a>

        <button
          ref={toggleRef}
          className="menu-toggle"
          type="button"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-controls="menu-movil"
          onClick={openMenu}
        >
          <span className="menu-toggle__lines" aria-hidden="true" />
          <span className="menu-toggle__label">Menú</span>
        </button>
      </div>
      <div className="site-header__progress" aria-hidden="true" />

      <dialog
        ref={menuRef}
        id="menu-movil"
        className="mobile-menu on-dark"
        aria-label="Menú"
        onClose={() => {
          setMenuOpen(false);
          toggleRef.current?.focus();
        }}
        onCancel={(e) => {
          e.preventDefault();
          closeMenu();
        }}
        onClick={(e) => {
          // Cierra al tocar un enlace del menú
          if ((e.target as HTMLElement).closest('a')) closeMenu();
        }}
      >
        <div className="mobile-menu__top wrap">
          <span className="brand">
            <Mark className="brand__mark" />
            <span className="brand__name">{site.name}</span>
          </span>
          <button type="button" className="mobile-menu__close" onClick={closeMenu}>
            <CloseIcon />
            <span className="sr-only">Cerrar menú</span>
          </button>
        </div>
        <nav className="mobile-menu__nav wrap" aria-label="Principal (móvil)">
          <ol role="list">
            {[...navItems, { id: 'contacto', label: 'Contacto' }].map(({ id, label }, i) => (
              <li key={id} style={{ '--i': i } as CSSProperties}>
                <a href={`#${id}`}>
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mobile-menu__foot wrap">
          <a className="btn btn--accent btn--block" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            <ButtonInner icon={<WhatsAppIcon className="btn__icon" />}>Consultar por WhatsApp</ButtonInner>
          </a>
          <p className="mono">
            {site.address.locality} · {site.address.region}
          </p>
        </div>
      </dialog>
    </header>
  );
}
