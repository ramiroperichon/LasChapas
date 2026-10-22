import { site } from '../content/site';

export type Inquiry = {
  checkIn: string; // yyyy-mm-dd
  checkOut: string;
  guests: string;
  name: string;
  notes: string;
};

const dateFmt = new Intl.DateTimeFormat('es-AR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

const parse = (iso: string) => (iso ? new Date(`${iso}T00:00:00Z`) : null);

export function nights(checkIn: string, checkOut: string): number | null {
  const a = parse(checkIn);
  const b = parse(checkOut);
  if (!a || !b) return null;
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

/** Arma el texto de la consulta para WhatsApp. No confirma ninguna reserva. */
export function buildInquiryMessage(q: Inquiry): string {
  const lines: string[] = [site.whatsappGreeting];
  const details: string[] = [];
  const a = parse(q.checkIn);
  const b = parse(q.checkOut);
  if (a) details.push(`• Llegada: ${dateFmt.format(a)}`);
  if (b) details.push(`• Salida: ${dateFmt.format(b)}`);
  const n = nights(q.checkIn, q.checkOut);
  if (n && n > 0) details.push(`• Noches: ${n}`);
  if (q.guests) details.push(`• Personas: ${q.guests}`);
  if (q.name.trim()) details.push(`• Nombre: ${q.name.trim()}`);
  if (details.length) lines.push('', ...details);
  if (q.notes.trim()) lines.push('', q.notes.trim());
  return lines.join('\n');
}

/** Fecha local de hoy en formato yyyy-mm-dd (para el mínimo de los campos). */
export function todayISO(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
