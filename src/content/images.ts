/**
 * Configuración de imágenes del sitio.
 *
 * Para reemplazar una imagen provisional por una fotografía real:
 *   1. Copiá la foto original a `images/source/` (jpg, png, webp…).
 *   2. Cambiá `file` acá abajo por el nombre del archivo sin extensión.
 *   3. Actualizá `alt` describiendo lo que realmente muestra la foto.
 *   4. Poné `provisional: false`.
 *   5. Corré `npm run images` (o directamente `npm run build`).
 * Las secciones y animaciones no necesitan cambios.
 *
 * Las imágenes con prefijo `provisional-` son ilustraciones de referencia
 * creadas para este diseño: NO muestran Las Chapas.
 */
import manifest from './images.manifest.json';

export type ImageEntry = {
  /** Nombre del archivo en images/source/, sin extensión. */
  file: keyof typeof manifest;
  alt: string;
  /** Punto focal para el recorte (CSS object-position). */
  focus?: string;
  /** true = imagen de referencia, no es del establecimiento. */
  provisional: boolean;
  /** Texto breve para la galería y el visor. */
  caption?: string;
};

export const heroImage: ImageEntry = {
  file: 'provisional-hero-fachada',
  alt: 'Ilustración provisional de una casa baja con techo de chapa al atardecer',
  focus: '55% 60%',
  provisional: true,
};

export const introImages: [ImageEntry, ImageEntry] = [
  {
    file: 'provisional-espacio-ventana',
    alt: 'Ilustración provisional de luz de tarde entrando por una ventana',
    focus: '40% 50%',
    provisional: true,
  },
  {
    file: 'provisional-espacio-chapa',
    alt: 'Ilustración provisional de una chapa acanalada iluminada de costado',
    provisional: true,
  },
];

/**
 * Galería. El orden define la composición: el layout alterna tamaños
 * automáticamente, así que se pueden agregar o quitar fotos libremente.
 */
export const galleryImages: ImageEntry[] = [
  { file: 'provisional-galeria-habitacion', alt: 'Ilustración provisional de un dormitorio con una ventana', caption: 'Dormitorio', provisional: true },
  { file: 'provisional-galeria-puerta', alt: 'Ilustración provisional de una puerta de madera', caption: 'Ingreso', provisional: true },
  { file: 'provisional-galeria-avenida', alt: 'Ilustración provisional de una avenida arbolada', caption: 'Alrededores', provisional: true },
  { file: 'provisional-galeria-textil', alt: 'Ilustración provisional de ropa de cama en tonos claros y terracota', caption: 'Detalle', provisional: true },
  { file: 'provisional-galeria-rincon', alt: 'Ilustración provisional de un rincón con silla y lámpara', caption: 'Rincón', provisional: true },
  { file: 'provisional-galeria-techo', alt: 'Ilustración provisional del borde de un techo de chapa contra el cielo', caption: 'Techo', provisional: true },
  { file: 'provisional-galeria-noche', alt: 'Ilustración provisional de una ventana iluminada de noche', caption: 'De noche', provisional: true },
  { file: 'provisional-espacio-ventana', alt: 'Ilustración provisional de luz de tarde entrando por una ventana', caption: 'Luz de tarde', provisional: true },
];

export type ImageMeta = (typeof manifest)[keyof typeof manifest];

export function imageMeta(file: ImageEntry['file']): ImageMeta {
  return manifest[file];
}

export function imageUrl(file: ImageEntry['file'], width: number, ext: 'jpg' | 'webp' | 'avif' = 'jpg') {
  return `${import.meta.env.BASE_URL}images/${file}-${width}.${ext}`;
}
