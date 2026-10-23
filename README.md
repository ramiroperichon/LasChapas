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
- **Tipografía**: EB Garamond (serif clásica, con itálicas reales) para títulos y Jost (sans geométrica) para
  texto y etiquetas en mayúsculas espaciadas. Autoalojadas, con alternativas de sistema.
- **Fotos en color** con la saturación apenas suavizada. Con `MONOCHROME = true` en
  `scripts/build-images.mjs` todas pasan a blanco y negro.
- **Recursos de plano**: reglas finas, fichas técnicas y un esquema de manzanas en la sección de ubicación.
- **Nervaduras**: la franja separadora, el pie, el favicon y la cortina de las animaciones.

### Lenguaje de movimiento

Cada tipo de elemento tiene su propia entrada (`src/styles/motion.css`):

| Nombre    | Dónde                          | Movimiento                                              |
|-----------|--------------------------------|---------------------------------------------------------|
| telón     | Hero                           | una línea se traza, el telón se abre, la imagen se asienta, se dibuja el marco y el nombre se enfoca letra por letra |
| persiana  | Imágenes de "El espacio"       | una cortina de chapa sube y descubre la foto            |
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

## Fotos

Las fotos del lugar están en `images/source/` y su ubicación se define en `src/content/images.ts`:

- **Hero**: tríptico en escritorio (`fogon-atardecer` · `galeria-otono` · `galeria-noche`); en móvil, solo
  `galeria-otono` a pantalla completa.
- **El espacio**: `sendero-naranjo` y `entrada-noche`.
- **Galería**: diez fotos, del día a la noche.
- **Imagen para compartir** (`public/og.jpg`): `galeria-otono`.

Las fotos actuales tienen 720 px de ancho. Si conseguís los originales del teléfono (más resolución), al
reemplazarlos con el mismo nombre se ven más nítidas en pantallas grandes, sin tocar código.

Para agregar o cambiar una foto:

1. Copiá la foto original (lo más grande posible, jpg/png/webp) a `images/source/`, por ejemplo
   `images/source/fachada.jpg`.
2. En `src/content/images.ts`, cambiá el `file` correspondiente por `'fachada'` y escribí un `alt` que describa
   la foto. Opcional: `focus: '50% 70%'` para elegir el punto de recorte.
3. Corré `npm run images` (o `npm run build`, que lo incluye). Se generan las variantes y el manifiesto con las
   dimensiones, así que no hay saltos de diseño.

La galería acepta cualquier cantidad de fotos: el patrón de composición se repite solo. Si alguna vez usás una
imagen que no es del lugar, marcala con `provisional: true`: la página la rotula como ilustrativa.

## Publicación en GitHub Pages

El workflow `.github/workflows/deploy.yml` compila y publica el sitio en cada push a `main`. Una sola vez, en
GitHub: **Settings → Pages → Build and deployment → Source: "GitHub Actions"**. (Con la opción "Deploy from a
branch", Pages publica el código fuente sin compilar y la página queda en blanco.)

El sitio queda en `https://ramiroperichon.github.io/LasChapas/`. El workflow define `BASE_PATH` con el nombre
del repositorio para que todas las rutas apunten a esa subcarpeta.

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

- Fotos de interiores (habitaciones, baño, cocina si la hay) y los originales en alta resolución.
- Logo: la foto de la entrada (`entrada-noche`) se puede reemplazar cuando el cartel esté colocado.
- Dominio definitivo.
- Número de calle exacto (hoy se muestra "Avenida San Martín"), si se quiere publicar.
- URL de inserción del mapa.

## Imagen para compartir

`public/og.jpg` es tipográfica (no depende de las fotos). Para regenerarla tras cambiar `images/brand/og.html`:
`npm i --no-save playwright && npx playwright install chromium && node scripts/build-og.mjs`.
