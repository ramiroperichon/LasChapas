import { useEffect } from 'react';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Activa las animaciones de entrada: observa todos los [data-reveal] y les
 * agrega data-visible cuando entran en pantalla (una sola vez).
 */
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (reducedMotion() || !('IntersectionObserver' in window)) {
      els.forEach((el) => (el.dataset.visible = ''));
      return;
    }
    // Los elementos que se recortan a sí mismos (clip-path) no "intersectan"
    // mientras están ocultos, así que para ellos se observa el contenedor.
    const groups = new Map<Element, HTMLElement[]>();
    els.forEach((el) => {
      const clipsItself = el.dataset.reveal === 'sign' || el.dataset.reveal === 'scale';
      const target = clipsItself && el.parentElement ? el.parentElement : el;
      groups.set(target, [...(groups.get(target) ?? []), el]);
    });
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          groups.get(entry.target)?.forEach((el) => (el.dataset.visible = ''));
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0 },
    );
    groups.forEach((_, target) => io.observe(target));
    return () => io.disconnect();
  }, []);
}

/**
 * Parallax moderado: desplaza verticalmente los [data-parallax="velocidad"]
 * según su posición respecto del centro de la pantalla. Solo en pantallas
 * grandes y sin preferencia de movimiento reducido.
 */
export function useParallax() {
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)');
    let els: { el: HTMLElement; speed: number }[] = [];
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const { el, speed } of els) {
        const parent = el.parentElement!;
        const rect = parent.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > vh + 100) continue;
        const offset = (rect.top + rect.height / 2 - vh / 2) * speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const setup = () => {
      window.removeEventListener('scroll', onScroll);
      els.forEach(({ el }) => (el.style.transform = ''));
      els = [];
      if (!mq.matches) return;
      els = [...document.querySelectorAll<HTMLElement>('[data-parallax]')].map((el) => ({
        el,
        speed: Number(el.dataset.parallax) || 0.1,
      }));
      window.addEventListener('scroll', onScroll, { passive: true });
      update();
    };

    setup();
    mq.addEventListener('change', setup);
    window.addEventListener('resize', onScroll);
    return () => {
      mq.removeEventListener('change', setup);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
}
