/**
 * "Un día en Las Chapas": los momentos del recorrido, en orden.
 * Cada texto describe lo que se ve en su foto; no agregues servicios que
 * no estén confirmados.
 */
import type { ImageEntry } from './images';

export type StoryStep = {
  moment: string;
  title: string;
  text: string;
  image: ImageEntry;
};

export const storySteps: StoryStep[] = [
  {
    moment: 'Mañana',
    title: 'Sombra en la galería',
    text: 'Columnas blancas, techo de madera y el parque al costado. Un buen lugar para empezar el día sin apuro.',
    image: {
      file: 'galeria-dia',
      alt: 'Galería con columnas blancas junto al parque arbolado en un día de sol',
      provisional: false,
    },
  },
  {
    moment: 'Mediodía',
    title: 'Un chapuzón',
    text: 'La pileta, con borde de ladrillo y rodeada de verde, para los días de calor correntino.',
    image: {
      file: 'pileta',
      alt: 'Pileta con borde de ladrillo y una flor blanca en primer plano',
      focus: '50% 60%',
      provisional: false,
    },
  },
  {
    moment: 'Tarde',
    title: 'El parque',
    text: 'Árboles grandes, naranjos y rincones con bancos de piedra para leer, charlar o no hacer nada.',
    image: {
      file: 'parque-arboles',
      alt: 'Parque con árboles grandes, bancos de piedra y monstera en primer plano',
      focus: '50% 40%',
      provisional: false,
    },
  },
  {
    moment: 'Noche',
    title: 'Las luces del fogón',
    text: 'Cuando cae el sol se encienden las luces sobre el cerco de cañas y el fogón se vuelve el centro de la noche.',
    image: {
      file: 'fogon-atardecer',
      alt: 'Fogón con asientos de troncos al atardecer y luces sobre el cerco',
      provisional: false,
    },
  },
];
