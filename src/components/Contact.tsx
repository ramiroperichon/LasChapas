import { useId, useState, type CSSProperties, type FormEvent } from 'react';
import { site, telUrl, whatsappUrl } from '../content/site';
import { buildInquiryMessage, nights, todayISO, type Inquiry } from '../lib/inquiry';
import { ButtonInner, ButtonLink } from './Button';
import { PhoneIcon, WhatsAppIcon } from './Icons';
import { SectionLabel } from './SectionLabel';
import { Words } from './Words';
import './Contact.css';

const empty: Inquiry = { checkIn: '', checkOut: '', guests: '', name: '', notes: '' };

export function Contact() {
  const [q, setQ] = useState<Inquiry>(empty);
  const [error, setError] = useState('');
  const id = useId();
  const today = todayISO();
  const n = nights(q.checkIn, q.checkOut);

  const set = (key: keyof Inquiry) => (e: { target: { value: string } }) => {
    setError('');
    setQ((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (q.checkIn && q.checkOut && (n ?? 0) <= 0) {
      setError('La fecha de salida tiene que ser posterior a la de llegada.');
      return;
    }
    const url = whatsappUrl(buildInquiryMessage(q));
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) window.location.href = url;
  };

  return (
    <section className="contact section" id="contacto" aria-labelledby="contacto-titulo">
      <div className="wrap">
        <SectionLabel num="04">Consultas</SectionLabel>

        <div className="contact__grid">
          <div className="contact__intro">
            <Words id="contacto-titulo" className="h2" parts={['Contanos cuándo', { em: 'venís.' }]} />
            <p className="lead" data-reveal="up" style={{ '--d': 150 } as CSSProperties}>
              Te responde directamente el propietario. Escribinos por WhatsApp o llamanos para consultar
              disponibilidad.
            </p>

            <div className="contact__direct">
              <a className="contact__phone" href={telUrl} data-reveal="up" style={{ '--d': 250 } as CSSProperties}>
                <span className="mono">
                  <PhoneIcon className="contact__phone-icon" /> Llamar
                </span>
                <span className="contact__phone-number">{site.phone.display}</span>
              </a>
              <div data-reveal="up" style={{ '--d': 350 } as CSSProperties}>
                <ButtonLink href={whatsappUrl()} variant="accent" icon={<WhatsAppIcon className="btn__icon" />}>
                  Escribir por WhatsApp
                </ButtonLink>
              </div>
            </div>
          </div>

          <form className="inquiry" onSubmit={submit} data-reveal="up" style={{ '--d': 200 } as CSSProperties}>
            <div className="inquiry__head">
              <h3 className="inquiry__title">Armá tu consulta</h3>
              <p className="mono">Se envía por WhatsApp</p>
            </div>

            <div className="inquiry__row">
              <div className="field">
                <label htmlFor={`${id}-in`}>Llegada</label>
                <input id={`${id}-in`} type="date" min={today} value={q.checkIn} onChange={set('checkIn')} />
              </div>
              <div className="field">
                <label htmlFor={`${id}-out`}>Salida</label>
                <input
                  id={`${id}-out`}
                  type="date"
                  min={q.checkIn || today}
                  value={q.checkOut}
                  onChange={set('checkOut')}
                  aria-describedby={error ? `${id}-error` : undefined}
                  aria-invalid={error ? true : undefined}
                />
              </div>
            </div>

            <div className="inquiry__row">
              <div className="field">
                <label htmlFor={`${id}-guests`}>Personas</label>
                <input
                  id={`${id}-guests`}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={50}
                  placeholder="Ej.: 2"
                  value={q.guests}
                  onChange={set('guests')}
                />
              </div>
              <div className="field">
                <label htmlFor={`${id}-name`}>
                  Nombre <span className="field__opt">(opcional)</span>
                </label>
                <input id={`${id}-name`} type="text" autoComplete="name" value={q.name} onChange={set('name')} />
              </div>
            </div>

            <div className="field">
              <label htmlFor={`${id}-notes`}>
                Comentario <span className="field__opt">(opcional)</span>
              </label>
              <textarea id={`${id}-notes`} rows={3} value={q.notes} onChange={set('notes')} placeholder="Algo que quieras contarnos o preguntar" />
            </div>

            <p className="inquiry__summary mono" aria-live="polite">
              {n && n > 0 ? `${n} ${n === 1 ? 'noche' : 'noches'}` : 'Elegí las fechas (opcional)'}
            </p>

            {error && (
              <p className="inquiry__error" id={`${id}-error`} role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="btn btn--block">
              <ButtonInner icon={<WhatsAppIcon className="btn__icon" />}>Enviar por WhatsApp</ButtonInner>
            </button>

            <p className="inquiry__disclaimer">
              Enviar la consulta no confirma una reserva: la disponibilidad y las condiciones se acuerdan por WhatsApp
              con el propietario.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
