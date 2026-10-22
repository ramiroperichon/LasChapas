import { Fragment, type CSSProperties, type ElementType, type ReactNode } from 'react';

type Part = string | { em: string };

type Props = {
  as?: ElementType;
  parts: Part[];
  className?: string;
  delay?: number;
  id?: string;
};

/**
 * Titular que entra palabra por palabra (data-reveal="words").
 * `parts` permite marcar fragmentos en itálica: ['Llegar y ', { em: 'quedarse' }].
 */
export function Words({ as: Tag = 'h2', parts, className, delay = 0, id }: Props) {
  let i = 0;
  const words = (text: string, wrap?: (n: ReactNode) => ReactNode) =>
    text
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => {
        const index = i++;
        const inner = (
          <span className="w" key={index}>
            <span style={{ '--i': index } as CSSProperties}>{word}</span>
          </span>
        );
        return (
          <Fragment key={index}>
            {wrap ? wrap(inner) : inner}{' '}
          </Fragment>
        );
      });

  return (
    <Tag className={className} id={id} data-reveal="words" style={{ '--d': delay } as CSSProperties}>
      {parts.map((part) => (typeof part === 'string' ? words(part) : words(part.em, (n) => <em>{n}</em>)))}
    </Tag>
  );
}
