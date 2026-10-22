import { Closing, FloatingWhatsApp } from './components/Closing';
import { Contact } from './components/Contact';
import { Gallery } from './components/Gallery';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Intro } from './components/Intro';
import { Location } from './components/Location';
import { RibBand } from './components/RibBand';
import { useParallax, useReveal } from './hooks/useMotion';

export default function App() {
  useReveal();
  useParallax();
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">
        <Hero />
        <Intro />
        <RibBand />
        <Gallery />
        <Contact />
        <Location />
      </main>
      <Closing />
      <FloatingWhatsApp />
    </>
  );
}
