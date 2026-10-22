/**
 * Fuente única de verdad con los datos del negocio.
 * Todo lo que aparece en la página (textos, enlaces, datos estructurados)
 * sale de acá. No agregues datos que no estén confirmados.
 */
export const site = {
  name: 'Las Chapas',
  category: 'Hospedaje temporario',
  address: {
    street: 'Avenida San Martín',
    locality: 'Mariano I. Loza',
    region: 'Corrientes',
    country: 'Argentina',
    countryCode: 'AR',
  },
  phone: {
    display: '3773-524807',
    /** Formato internacional para enlaces tel: (llamada desde cualquier país). */
    tel: '+543773524807',
    /** Número para wa.me: código de país 54 + 9 (móvil) + área sin 0 + número. */
    whatsapp: '5493773524807',
  },
  mapsUrl: 'https://maps.app.goo.gl/A6ktfKGPRbjkx1SN8',
  /**
   * URL de inserción de Google Maps (iframe). Vacía a propósito: el enlace corto
   * no sirve como embed. Para obtenerla: Google Maps → Compartir → Insertar un
   * mapa → copiar solo el valor de `src` y pegarlo acá.
   */
  mapEmbedUrl: '',
  whatsappGreeting: 'Hola, quisiera consultar por disponibilidad en Las Chapas.',
} as const;

/**
 * PENDIENTE DE CONFIRMAR — datos que se mostrarán automáticamente cuando se
 * completen. Mientras estén vacíos, la página no los menciona.
 */
export const pending = {
  /** Ej.: ['Wi-Fi', 'Estacionamiento', 'Aire acondicionado'] — solo si es real. */
  amenities: [] as string[],
  /** Ej.: 'Ingreso desde las 14 h · Salida hasta las 10 h'. */
  checkInOut: '',
  /** Ej.: 'Habitaciones para 2 a 4 personas'. */
  capacity: '',
};

export const fullAddress = `${site.address.street}, ${site.address.locality}, ${site.address.region}, ${site.address.country}`;

export function whatsappUrl(message: string = site.whatsappGreeting): string {
  return `https://wa.me/${site.phone.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const telUrl = `tel:${site.phone.tel}`;
