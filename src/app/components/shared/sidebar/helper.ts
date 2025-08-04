import { animate, style, transition, trigger } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('350ms', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate('350ms', style({ opacity: 0 }))
  ])
]);

export interface INavbarData {
  routeLink: string;       // la ruta del menú
  icon?: string;           // clase del ícono (ej. 'fa fa-home')
  label: string;           // texto a mostrar
  expanded?: boolean;      // si está expandido o no
  items?: INavbarData[];   // submenús
}
