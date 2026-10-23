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
 * Si alguna vez se usa una imagen que no es del lugar, marcala con
 * `provisional: true`: la página la rotula como ilustrativa.
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

/**
 * Hero. En escritorio se arma un tríptico (izquierda · principal · derecha);
 * en móvil se ve solo la principal, a pantalla completa. Las fotos verticales
 * funcionan mejor acá.
 */
export const heroImage: ImageEntry = {
  file: 'galeria-otono',
  alt: 'Galería de Las Chapas en otoño, con el parque cubierto de hojas doradas',
  focus: '50% 55%',
  provisional: false,
};

/** Ancho que ocupa la imagen principal del hero (también se usa para el preload). */
export const heroSizes = '(min-width: 900px) 34vw, 100vw';

export const heroSideImages: [ImageEntry, ImageEntry] = [
  {
    file: 'fogon-atardecer',
    alt: 'Fogón con asientos de troncos al atardecer, con luces cálidas sobre el cerco de cañas',
    focus: '50% 45%',
    provisional: false,
  },
  {
    file: 'galeria-noche',
    alt: 'Galería iluminada de noche y el parque con luces al fondo',
    focus: '55% 50%',
    provisional: false,
  },
];

export const introImages: [ImageEntry, ImageEntry] = [
  {
    file: 'sendero-naranjo',
    alt: 'Sendero de ladrillo bajo un naranjo cargado de frutos que lleva a la galería',
    focus: '50% 45%',
    provisional: false,
  },
  {
    file: 'entrada-noche',
    alt: 'Entrada de Las Chapas de noche, con alero de chapa y apliques encendidos',
    focus: '50% 40%',
    provisional: false,
  },
];

/**
 * Galería. El orden define la composición: el layout alterna tamaños
 * automáticamente, así que se pueden agregar o quitar fotos libremente.
 */
export const galleryImages: ImageEntry[] = [
  { file: 'galeria-dia', alt: 'Galería con columnas blancas junto al parque arbolado en un día de sol', caption: 'La galería', provisional: false },
  { file: 'pileta', alt: 'Pileta con borde de ladrillo y una flor blanca en primer plano', caption: 'Pileta', provisional: false },
  { file: 'naranja-noche', alt: 'Naranjas en la rama de noche, con las luces del parque desenfocadas', caption: 'Naranjos', provisional: false },
  { file: 'galeria-otono', alt: 'Galería en otoño con el parque cubierto de hojas doradas', caption: 'Otoño', focus: '50% 60%', provisional: false },
  { file: 'santa-rita', alt: 'Santa Rita roja junto a una columna, con el parque y luces al fondo', caption: 'Santa Rita', provisional: false },
  { file: 'fogon-atardecer', alt: 'Fogón con asientos de troncos al atardecer y luces sobre el cerco', caption: 'Fogón', provisional: false },
  { file: 'parque-arboles', alt: 'Parque con árboles grandes, bancos de piedra y monstera en primer plano', caption: 'El parque', focus: '50% 40%', provisional: false },
  { file: 'galeria-noche', alt: 'Galería iluminada de noche', caption: 'De noche', provisional: false },
  { file: 'farol-fogon', alt: 'Farol junto al cerco de cañas y el fogón, con la pileta al fondo', caption: 'Farol', provisional: false },
  { file: 'naranjo-noche', alt: 'Tronco de un naranjo iluminado de noche junto al sendero de ladrillo', caption: 'Noche en el parque', provisional: false },
];

export type ImageMeta = (typeof manifest)[keyof typeof manifest];

export function imageMeta(file: ImageEntry['file']): ImageMeta {
  return manifest[file];
}

export function imageUrl(file: ImageEntry['file'], width: number, ext: 'jpg' | 'webp' | 'avif' = 'jpg') {
  return `${import.meta.env.BASE_URL}images/${file}-${width}.${ext}`;
}
