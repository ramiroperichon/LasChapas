import type { CSSProperties } from 'react';

type Props = { num: string; children: string; id?: string };

/** Señalética de sección: "02 — El espacio" seguido de una regla que se dibuja. */
export function SectionLabel({ num, children, id }: Props) {
  return (
    <div className="section-label label">
      <span data-reveal="sign" id={id}>
        {num} — {children}
      </span>
      <span className="section-label__rule" data-reveal="rule" style={{ '--d': 150 } as CSSProperties} aria-hidden="true" />
    </div>
  );
}
