import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { site, fullAddress } from './src/content/site';
import { heroImage, imageMeta } from './src/content/images';

/**
 * SEO en build: datos estructurados, preload de la imagen del hero y,
 * si hay dominio definido (VITE_SITE_URL), canonical, og:url, URLs absolutas
 * y sitemap.xml. robots.txt se genera siempre.
 */
function seo(siteUrl: string, base: string): Plugin {
  const abs = (p: string) => (siteUrl ? `${siteUrl}${base}${p.replace(/^\//, '')}` : `${base}${p.replace(/^\//, '')}`);
  const hero = imageMeta(heroImage.file);
  const heroSrcset = (ext: string) =>
    hero.widths.map((w) => `${base}images/${heroImage.file}-${w}.${ext} ${w}w`).join(', ');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: site.name,
    description: `${site.category} sobre ${site.address.street}, en ${site.address.locality}, ${site.address.region}.`,
    telephone: site.phone.tel,
    hasMap: site.mapsUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.countryCode,
    },
    ...(siteUrl && { url: `${siteUrl}${base}`, image: abs('og.jpg') }),
  };

  return {
    name: 'las-chapas-seo',
    transformIndexHtml(html) {
      const head = [
        `<link rel="preload" as="image" type="image/avif" imagesrcset="${heroSrcset('avif')}" imagesizes="100vw" fetchpriority="high">`,
        siteUrl && `<link rel="canonical" href="${siteUrl}${base}">`,
        siteUrl && `<meta property="og:url" content="${siteUrl}${base}">`,
        `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
      ]
        .filter(Boolean)
        .join('\n    ');
      return html
        .replaceAll('%OG_IMAGE%', abs('og.jpg'))
        .replaceAll('%ADDRESS%', fullAddress)
        .replace('</head>', `    ${head}\n  </head>`);
    },
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /', siteUrl && `Sitemap: ${siteUrl}${base}sitemap.xml`].filter(Boolean);
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots.join('\n') + '\n' });
      if (siteUrl) {
        const today = new Date().toISOString().slice(0, 10);
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}${base}</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`,
        });
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = (env.VITE_SITE_URL ?? '').replace(/\/+$/, '');
  // Subcarpeta donde se publica (GitHub Pages: /LasChapas/). Con dominio propio, '/'.
  const base = `/${(env.BASE_PATH ?? '').replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');
  return {
    base,
    plugins: [react(), seo(siteUrl, base)],
    build: { target: 'es2020' },
  };
});
