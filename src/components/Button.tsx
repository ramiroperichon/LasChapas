import type { AnchorHTMLAttributes, ReactNode } from 'react';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: 'solid' | 'accent' | 'ghost' | 'ghost-light' | 'light';
  icon?: ReactNode;
  block?: boolean;
  children: string;
};

/** Enlace con estilo de botón. La etiqueta duplicada (oculta) produce el efecto de rodar. */
export function ButtonLink({ variant = 'solid', icon, block, className = '', children, ...rest }: Props) {
  const external = rest.href?.startsWith('http');
  const classes = ['btn', variant !== 'solid' && `btn--${variant}`, block && 'btn--block', className]
    .filter(Boolean)
    .join(' ');
  return (
    <a className={classes} {...(external && { target: '_blank', rel: 'noopener noreferrer' })} {...rest}>
      <ButtonInner icon={icon}>{children}</ButtonInner>
    </a>
  );
}

export function ButtonInner({ icon, children }: { icon?: ReactNode; children: string }) {
  return (
    <>
      <span className="btn__label">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      {icon}
    </>
  );
}
