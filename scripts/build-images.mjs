/**
 * Optimiza las imágenes de `images/source/` y las publica en `public/images/`.
 *
 * Por cada archivo fuente (jpg, jpeg, png, webp, avif, tif o svg) genera:
 *   public/images/<nombre>-<ancho>.avif
 *   public/images/<nombre>-<ancho>.webp
 *   public/images/<nombre>-<ancho>.jpg   (respaldo para navegadores antiguos)
 * y escribe `src/content/images.manifest.json` con dimensiones y anchos
 * disponibles, que usa <Picture> para armar srcset y reservar espacio.
 *
 * Solo reprocesa los archivos cuyo contenido cambió (compara un hash).
 */
import { readdir, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'images/source');
const OUT = path.join(root, 'public/images');
const MANIFEST = path.join(root, 'src/content/images.manifest.json');
const WIDTHS = [640, 1024, 1600, 2400];
const EXT = /\.(jpe?g|png|webp|avif|tiff?|svg)$/i;
/**
 * Tratamiento en blanco y negro para todas las imágenes del sitio.
 * Poné `false` para publicar las fotos en color.
 */
const MONOCHROME = true;

await mkdir(OUT, { recursive: true });

const previous = existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, 'utf8')) : {};
const files = (await readdir(SRC)).filter((f) => EXT.test(f)).sort();
const manifest = {};

for (const file of files) {
  const name = file.replace(EXT, '');
  const input = path.join(SRC, file);
  const buffer = await readFile(input);
  const hash = createHash('sha1').update(buffer).update(`bn:${MONOCHROME}`).digest('hex').slice(0, 12);
  const isSvg = /\.svg$/i.test(file);

  // Dimensiones reales (para SVG, las declaradas en el archivo).
  const meta = await sharp(buffer).metadata();
  const portrait = (meta.orientation ?? 1) >= 5;
  const width = portrait ? meta.height : meta.width;
  const height = portrait ? meta.width : meta.height;
  const widths = [...new Set(WIDTHS.filter((w) => w < width).concat(Math.min(width, WIDTHS.at(-1))))];

  const prev = previous[name];
  const upToDate =
    prev?.hash === hash && widths.every((w) => existsSync(path.join(OUT, `${name}-${w}.webp`)));

  if (!upToDate) {
    for (const f of await readdir(OUT)) {
      if (f.startsWith(`${name}-`)) await rm(path.join(OUT, f));
    }
    // Se rasteriza una sola vez al ancho máximo y se reduce desde ahí.
    let pipeline = sharp(buffer, isSvg ? { density: (72 * widths.at(-1)) / width } : {})
      .rotate()
      .resize({ width: widths.at(-1), withoutEnlargement: true });
    // Blanco y negro con un poco más de contraste, que conserva los grises medios.
    if (MONOCHROME) pipeline = pipeline.grayscale().linear(1.12, -14);
    const master = await pipeline.toColourspace('srgb').png().toBuffer();
    for (const w of widths) {
      const base = sharp(master).resize({ width: w });
      await Promise.all([
        base.clone().avif({ quality: 52, effort: 4 }).toFile(path.join(OUT, `${name}-${w}.avif`)),
        base.clone().webp({ quality: 72 }).toFile(path.join(OUT, `${name}-${w}.webp`)),
        base.clone().jpeg({ quality: 76, mozjpeg: true }).toFile(path.join(OUT, `${name}-${w}.jpg`)),
      ]);
    }
    console.log(`✓ ${file} → ${widths.join(', ')} px`);
  }

  // Color dominante: fondo mientras la imagen carga.
  const { dominant } = await sharp(path.join(OUT, `${name}-${widths[0]}.jpg`)).stats();
  const color = `rgb(${dominant.r} ${dominant.g} ${dominant.b})`;

  manifest[name] = { width, height, widths, color, hash };
}

// Borra variantes de imágenes fuente que ya no existen.
for (const f of await readdir(OUT)) {
  const base = f.replace(/-\d+\.(avif|webp|jpg)$/, '');
  if (base !== f && !(base in manifest)) await rm(path.join(OUT, f));
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Manifest: ${Object.keys(manifest).length} imágenes.`);
