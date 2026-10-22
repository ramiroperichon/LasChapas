import { useState, type CSSProperties } from 'react';
import { imageMeta, imageUrl, type ImageEntry } from '../content/images';
import './Picture.css';

type Props = {
  image: ImageEntry;
  /** Atributo sizes: cuánto ocupa la imagen en pantalla. */
  sizes: string;
  /** Imagen principal (hero): carga inmediata y prioridad alta. */
  priority?: boolean;
  className?: string;
  /** Recorta a una proporción fija (si no, usa la de la imagen). */
  ratio?: string;
};

/**
 * Imagen responsive con AVIF/WebP/JPG, espacio reservado (sin saltos de
 * diseño), color de fondo mientras carga y respaldo si falla la descarga.
 */
export function Picture({ image, sizes, priority, className = '', ratio }: Props) {
  const meta = imageMeta(image.file);
  const [failed, setFailed] = useState(false);
  const srcset = (ext: 'avif' | 'webp' | 'jpg') =>
    meta.widths.map((w) => `${imageUrl(image.file, w, ext)} ${w}w`).join(', ');
  const fallbackWidth = meta.widths.find((w) => w >= 1024) ?? meta.widths.at(-1)!;

  const style = {
    '--ratio': ratio ?? `${meta.width} / ${meta.height}`,
    '--placeholder': meta.color,
    '--ar': meta.width / meta.height,
    objectPosition: image.focus,
  } as CSSProperties;

  if (failed) {
    return (
      <div className={`picture picture--failed ${className}`} style={style} role="img" aria-label={image.alt}>
        <span className="label">Imagen no disponible</span>
      </div>
    );
  }

  return (
    <picture className={`picture ${className}`} style={style}>
      <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset('webp')} sizes={sizes} />
      <img
        src={imageUrl(image.file, fallbackWidth)}
        srcSet={srcset('jpg')}
        sizes={sizes}
        width={meta.width}
        height={meta.height}
        alt={image.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'auto' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        style={{ objectPosition: image.focus }}
        onError={() => setFailed(true)}
        draggable={false}
      />
    </picture>
  );
}

/** Marca visible de imagen de referencia (no es una foto de Las Chapas). */
export function ProvisionalTag() {
  return (
    <span className="provisional-tag">
      Ilustración<span className="provisional-tag__more"> provisional</span>
    </span>
  );
}
