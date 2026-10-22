# Las Chapas — sitio web

Sitio estático de **Las Chapas**, hospedaje temporario sobre la avenida San Martín, en Mariano I. Loza, Corrientes.
Hecho con Vite + React + TypeScript, sin backend. Se despliega en cualquier hosting estático (Netlify, Vercel,
Cloudflare Pages, GitHub Pages, un hosting compartido…).

```bash
npm install
npm run dev       # desarrollo en http://localhost:5173
npm run build     # optimiza imágenes + compila a dist/
npm run preview   # sirve dist/ para revisar el build
```

## Concepto visual: "bajo techo"

El nombre del lugar es el punto de partida: la **chapa acanalada** se convierte en sistema gráfico.

- **Materiales como paleta**: carbón, marfil, arena, terracota y zinc (`src/styles/tokens.css`).
- **Tipografía**: Fraunces (serif expresiva, con itálicas para los acentos), Instrument Sans para lectura y
  JetBrains Mono para la señalética (etiquetas numeradas, cotas, datos). Todas autoalojadas, con alternativas
  de sistema.
- **Recursos de plano**: reglas finas, cotas ("Av. San Martín" en el hero), fichas técnicas y un esquema de
  manzanas en la sección de ubicación.
- **Nervaduras**: la franja separadora, el pie, el favicon y la cortina de las animaciones.

### Lenguaje de movimiento

Cada tipo de elemento tiene su propia entrada (`src/styles/motion.css`):

| Nombre    | Dónde                          | Movimiento                                              |
|-----------|--------------------------------|---------------------------------------------------------|
| persiana  | Hero e imágenes de "El espacio"| una cortina de chapa sube y descubre la foto            |
| palabras  | Titulares                      | cada palabra sube desde una máscara, escalonada         |
| señal     | Etiquetas y datos              | se "escriben" de izquierda a derecha (clip-path)         |
| regla     | Líneas de sección              | se dibujan                                              |
| subir     | Párrafos y bloques             | desplazamiento corto + opacidad                         |
| escala    | Galería                        | la foto se asienta desde un leve zoom dentro de su marco|
| plano     | Esquema de ubicación           | las manzanas se trazan y cae el marcador                |

Además: parallax moderado (solo escritorio), cabecera que se vuelve sólida y se esconde al bajar, barra de
progreso de lectura (CSS nativo, sin JS) y botones con relleno tipo cortina. Todo respeta
`prefers-reduced-motion` y sin JavaScript el contenido se ve completo. No hay bibliotecas de animación.

## Estructura

```
images/source/          Originales de las imágenes (no se publican tal cual)
images/brand/og.html    Fuente de la imagen para compartir (og.jpg)
public/images/          Variantes optimizadas AVIF/WebP/JPG (generadas)
public/                 favicon, og.jpg, manifest
scripts/build-images.mjs  Optimiza images/source → public/images + manifest
src/content/site.ts     Datos del negocio (fuente única: nombre, dirección, teléfono, enlaces)
src/content/images.ts   Qué imagen va en cada lugar (hero, presentación, galería)
src/components/         Secciones: Header, Hero, Intro, RibBand, Gallery + Lightbox, Contact, Location, Closing
src/styles/             Tokens, base, botones y lenguaje de movimiento
```

## Reemplazar las imágenes provisionales

Las imágenes actuales (`images/source/provisional-*.svg`) son **ilustraciones creadas para este diseño**, no
fotos de Las Chapas. En la página aparecen marcadas como "Ilustración provisional" y la galería lo aclara.

Para poner una foto real:

1. Copiá la foto original (lo más grande posible, jpg/png/webp) a `images/source/`, por ejemplo
   `images/source/fachada.jpg`.
2. En `src/content/images.ts`, cambiá el `file` correspondiente por `'fachada'`, escribí un `alt` que describa
   la foto y poné `provisional: false`. Opcional: `focus: '50% 70%'` para elegir el punto de recorte.
3. Corré `npm run images` (o `npm run build`, que lo incluye). Se generan las variantes y el manifiesto con las
   dimensiones, así que no hay saltos de diseño.

La galería acepta cualquier cantidad de fotos: el patrón de composición se repite solo. Cuando ninguna imagen
sea provisional, el aviso de la galería desaparece automáticamente. Podés borrar los `provisional-*.svg`
que ya no uses.

## Dominio propio

Copiá `.env.example` a `.env` y completá `VITE_SITE_URL` (por ejemplo `https://www.laschapas.com.ar`).
Al compilar se agregan `canonical`, `og:url`, URLs absolutas para Open Graph y `sitemap.xml`; `robots.txt` pasa
a apuntar al sitemap. En hostings como Netlify o Vercel, la variable se configura en el panel del proyecto.

## Mapa incrustado

El enlace corto de Google Maps no sirve como mapa embebido. Mientras tanto se muestra un esquema ilustrativo
(rotulado "no a escala") que abre Google Maps. Para un mapa real: Google Maps → Compartir → Insertar un mapa →
copiar el valor de `src` del iframe y pegarlo en `mapEmbedUrl` de `src/content/site.ts`.

## Datos pendientes de confirmar

En `src/content/site.ts` (objeto `pending`) hay lugar para datos que solo se muestran cuando se completan:

- Servicios / comodidades reales (Wi-Fi, estacionamiento, aire acondicionado, etc.).
- Capacidad o tipos de unidad.
- Horarios de ingreso y salida.

También falta:

- Fotografías reales: fachada, habitaciones, baño, espacios comunes y alrededores.
- Dominio definitivo.
- Número de calle exacto (hoy se muestra "Avenida San Martín"), si se quiere publicar.
- URL de inserción del mapa.

## Imagen para compartir

`public/og.jpg` es tipográfica (no depende de las fotos). Para regenerarla tras cambiar `images/brand/og.html`:
`npm i --no-save playwright && npx playwright install chromium && node scripts/build-og.mjs`.
